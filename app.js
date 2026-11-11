(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var kacis = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var para = function (n) { return Number(n).toLocaleString('tr-TR') + ' ₺'; };
  var azalt = function (s) { return String(s).toLocaleLowerCase('tr-TR'); };

  var veri = null;
  var durum = { ara: '', haric: [], sirala: 'varsayilan', maxKcal: 600 };
  var params = new URLSearchParams(location.search);

  function yukle() {
    if (params.get('onizleme')) {
      try { var t = localStorage.getItem('bereket_taslak'); if (t) return Promise.resolve(JSON.parse(t)); } catch (e) {}
    }
    return fetch('menu.json?v=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); });
  }

  function gorsel(u) { return u.img || u.imgData || ''; }

  function filtrele() {
    var q = azalt(durum.ara.trim());
    return veri.urunler.filter(function (u) {
      if (q && azalt(u.ad + ' ' + (u.acik || '')).indexOf(q) < 0) return false;
      if (durum.haric.some(function (a) { return (u.alerjen || []).indexOf(a) > -1; })) return false;
      if (durum.maxKcal < 600 && u.kcal > durum.maxKcal) return false;
      return true;
    });
  }

  function sirala(liste) {
    var l = liste.slice();
    if (durum.sirala === 'fiyatArtan') l.sort(function (a, b) { return a.fiyat - b.fiyat; });
    if (durum.sirala === 'fiyatAzalan') l.sort(function (a, b) { return b.fiyat - a.fiyat; });
    if (durum.sirala === 'kaloriAz') l.sort(function (a, b) { return a.kcal - b.kcal; });
    return l;
  }

  function etiketHtml(u) {
    if (u.tukendi) return '<span class="etiket bitti">Tükendi</span>';
    if ((u.rozet || []).indexOf('imza') > -1) return '<span class="etiket imza">İmza Lezzet</span>';
    if ((u.rozet || []).indexOf('yeni') > -1) return '<span class="etiket yeni">Yeni</span>';
    return '';
  }

  function kartHtml(u) {
    var g = gorsel(u);
    return '<article class="kart' + (u.tukendi ? ' bitti' : '') + '">' + etiketHtml(u) +
      '<div class="kart-govde"><h3>' + kacis(u.ad) + '</h3><p class="acik">' + kacis(u.acik) + '</p>' +
      '<div class="kart-alt"><div class="sol"><span class="kcal">' + kacis(u.kcal) + ' kcal</span>' +
      (u.alerjen || []).map(function (a) { return window.alerjenIkon(a); }).join('') +
      '</div><span class="fiyat">' + para(u.fiyat) + '</span></div></div>' +
      (g ? '<img class="kart-gorsel" loading="lazy" alt="' + kacis(u.ad) + '" src="' + kacis(g) + '">' : '') +
      '</article>';
  }

  function ciz() {
    var sonuc = filtrele();
    var kutu = $('#menu');
    var html = '';
    var duzenli = durum.sirala === 'varsayilan';

    if (!sonuc.length) {
      html = '<div class="bos"><b>Bulamadık</b>Aradığınız lezzet bu süzgeçte yok. Süzgeci gevşetip bir daha bakalım mı?</div>';
    } else if (duzenli) {
      veri.kategoriler.forEach(function (k) {
        var l = sonuc.filter(function (u) { return u.kat === k.id; });
        if (!l.length) return;
        html += '<section class="bolum" id="k_' + kacis(k.id) + '" data-k="' + kacis(k.id) + '"><h2>' + kacis(k.ad) + '</h2>' +
          (k.alt ? '<p class="alt-baslik">' + kacis(k.alt) + '</p>' : '') + l.map(kartHtml).join('') + '</section>';
      });
    } else {
      html = '<section class="bolum"><h2>Tüm ürünler</h2><p class="alt-baslik">' +
        ({ fiyatArtan: 'Fiyata göre artan', fiyatAzalan: 'Fiyata göre azalan', kaloriAz: 'Kaloriye göre az olandan' }[durum.sirala]) +
        '</p>' + sirala(sonuc).map(kartHtml).join('') + '</section>';
    }
    kutu.innerHTML = html;

    // kategori çipleri
    var gorunen = veri.kategoriler.filter(function (k) { return $('#k_' + k.id); });
    $('#kategoriler').innerHTML = duzenli ? gorunen.map(function (k, i) {
      return '<button class="chip' + (i === 0 ? ' aktif' : '') + '" data-k="' + kacis(k.id) + '">' + kacis(k.ad) + '</button>';
    }).join('') : '';
    $('#kategoriler').style.display = duzenli && gorunen.length ? '' : 'none';

    gozlemKur();
    suzSayac();
  }

  var kartGozlem, bolumGozlem;
  function gozlemKur() {
    if (kartGozlem) kartGozlem.disconnect();
    if (bolumGozlem) bolumGozlem.disconnect();
    var kartlar = $$('.kart');
    if (!('IntersectionObserver' in window)) { kartlar.forEach(function (k) { k.classList.add('gor'); }); return; }
    kartGozlem = new IntersectionObserver(function (ent) {
      ent.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('gor'); kartGozlem.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    kartlar.forEach(function (k, i) { k.style.transitionDelay = (i % 4) * 60 + 'ms'; kartGozlem.observe(k); });

    bolumGozlem = new IntersectionObserver(function (ent) {
      ent.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.getAttribute('data-k');
        $$('.chip').forEach(function (c) {
          var on = c.getAttribute('data-k') === id;
          c.classList.toggle('aktif', on);
          if (on) { var bar = $('#kategoriler'); bar.scrollTo({ left: c.offsetLeft - 20, behavior: 'smooth' }); }
        });
      });
    }, { rootMargin: '-140px 0px -70% 0px' });
    $$('.bolum[data-k]').forEach(function (b) { bolumGozlem.observe(b); });
  }

  function gununCiz() {
    var l = veri.urunler.filter(function (u) { return u.gunun && !u.tukendi; });
    $('#gununBolum').hidden = !l.length;
    $('#gununSeri').innerHTML = l.map(function (u) {
      var g = gorsel(u);
      return '<div class="g-kart">' + (g ? '<img alt="' + kacis(u.ad) + '" src="' + kacis(g) + '">' : '') +
        '<h3>' + kacis(u.ad) + '</h3><p>' + kacis(u.acik) + '</p><div class="g-alt"><div class="sol"><span class="kcal">' + kacis(u.kcal) + ' kcal</span>' +
        (u.alerjen || []).map(function (a) { return window.alerjenIkon(a); }).join('') + '</div><span class="g-fiyat">' + para(u.fiyat) + '</span></div></div>';
    }).join('');
  }

  function suzSayac() {
    var n = durum.haric.length + (durum.maxKcal < 600 ? 1 : 0) + (durum.sirala !== 'varsayilan' ? 1 : 0);
    var b = $('#suzSayac'); b.hidden = !n; b.textContent = n;
  }

  /* alerjen bölümü ve panel */
  function alerjenCiz() {
    $('#alerjenIzgara').innerHTML = window.ALERJENLER.map(function (a) {
      var s = durum.haric.indexOf(a.id) > -1;
      return '<button class="al-oge' + (s ? ' sec' : '') + '" data-al="' + a.id + '">' + window.alerjenIkon(a.id) + '<span>' + a.ad + '</span></button>';
    }).join('');
    $('#haricChip').innerHTML = window.ALERJENLER.map(function (a) {
      var s = durum.haric.indexOf(a.id) > -1;
      return '<button class="f-chip' + (s ? ' sec' : '') + '" data-al="' + a.id + '">' + window.alerjenIkon(a.id) + a.ad + '</button>';
    }).join('');
  }
  function haricDegis(id) {
    var i = durum.haric.indexOf(id);
    if (i > -1) durum.haric.splice(i, 1); else durum.haric.push(id);
    alerjenCiz(); ciz();
    bildir(i > -1 ? window.ALERJEN[id].ad + ' içeren ürünler geri geldi' : window.ALERJEN[id].ad + ' içeren ürünler gizlendi');
  }

  var bildirZaman;
  function bildir(m) {
    var b = $('#bildirim'); b.textContent = m; b.classList.add('goster');
    clearTimeout(bildirZaman); bildirZaman = setTimeout(function () { b.classList.remove('goster'); }, 2200);
  }

  function panelAc(ac) {
    $('#panel').hidden = !ac; $('#ortu').hidden = !ac;
    document.body.style.overflow = ac ? 'hidden' : '';
  }

  /* hero: sloganlar, taneler, un efekti */
  function kahramanKur() {
    var s = veri.ayar.sloganlar && veri.ayar.sloganlar.length ? veri.ayar.sloganlar : ['Bereket, taze fırından sofranıza.'];
    var i = 0, el = $('#slogan'); el.textContent = s[0];
    if (s.length > 1) setInterval(function () {
      el.classList.add('gizle');
      setTimeout(function () { i = (i + 1) % s.length; el.textContent = s[i]; el.classList.remove('gizle'); }, 450);
    }, 3800);

    var alan = $('#taneler'), h = '';
    for (var k = 0; k < 9; k++) {
      h += '<i class="tane" style="left:' + (Math.random() * 96).toFixed(1) + '%;animation-duration:' + (7 + Math.random() * 7).toFixed(1) +
        's;animation-delay:-' + (Math.random() * 12).toFixed(1) + 's;transform:rotate(' + Math.round(Math.random() * 90) + 'deg)"></i>';
    }
    alan.innerHTML = h;

    $('#logoBtn').addEventListener('click', function (e) {
      for (var n = 0; n < 16; n++) {
        var p = document.createElement('span'); p.className = 'un';
        p.style.left = e.clientX + 'px'; p.style.top = e.clientY + 'px';
        p.style.setProperty('--x', (Math.random() * 120 - 60) + 'px'); p.style.setProperty('--y', (Math.random() * -110 - 10) + 'px');
        document.body.appendChild(p); setTimeout(function (q) { q.remove(); }.bind(null, p), 950);
      }
      bildir('Un tozu havada, afiyet olsun!');
    });
  }

  /* oklava ilerleme */
  function ilerlemeKur() {
    var cubuk = $('#ilerleme .cubuk'), ok = $('#oklava'), bekle = false;
    function guncelle() {
      bekle = false;
      var h = document.documentElement.scrollHeight - innerHeight;
      var p = h > 0 ? Math.min(1, scrollY / h) : 0;
      cubuk.style.width = (p * 100) + '%';
      ok.style.left = (p * 100) + '%';
      ok.style.transform = 'translateX(-50%) rotate(' + (scrollY * 0.6) + 'deg)';
    }
    addEventListener('scroll', function () { if (!bekle) { bekle = true; requestAnimationFrame(guncelle); } }, { passive: true });
    guncelle();
  }

  function olaylar() {
    $('#kategoriler').addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      var b = $('#k_' + c.getAttribute('data-k')); if (b) b.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.addEventListener('click', function (e) {
      var ai = e.target.closest('.kart .ai, .g-kart .ai');
      if (ai) { bildir(window.ALERJEN[ai.getAttribute('data-al')].ad + ' içerir'); return; }
      var al = e.target.closest('[data-al].al-oge, [data-al].f-chip');
      if (al) haricDegis(al.getAttribute('data-al'));
    });
    $('#araBtn').addEventListener('click', function () {
      var k = $('#aramaKutu'); k.hidden = !k.hidden; if (!k.hidden) $('#aramaGiris').focus();
    });
    $('#aramaKapat').addEventListener('click', function () {
      $('#aramaKutu').hidden = true; $('#aramaGiris').value = ''; durum.ara = ''; ciz();
    });
    $('#aramaGiris').addEventListener('input', function (e) { durum.ara = e.target.value; ciz(); });
    $('#suzBtn').addEventListener('click', function () { panelAc(true); });
    $('#ortu').addEventListener('click', function () { panelAc(false); });
    $('#suzUygula').addEventListener('click', function () { panelAc(false); window.scrollTo({ top: $('#menu').offsetTop - 120, behavior: 'smooth' }); });
    $('#suzTemizle').addEventListener('click', function () {
      durum.haric = []; durum.sirala = 'varsayilan'; durum.maxKcal = 600;
      $('#kcalAralik').value = 600; kcalYaz(); siralamaIsaretle(); alerjenCiz(); ciz();
    });
    $('#siralama').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      durum.sirala = b.getAttribute('data-s'); siralamaIsaretle(); ciz();
    });
    $('#kcalAralik').addEventListener('input', function (e) { durum.maxKcal = +e.target.value; kcalYaz(); ciz(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') panelAc(false); });
  }
  function siralamaIsaretle() {
    $$('#siralama button').forEach(function (b) { b.classList.toggle('secili', b.getAttribute('data-s') === durum.sirala); });
  }
  function kcalYaz() { $('#kcalDeger').textContent = durum.maxKcal >= 600 ? 'Sınırsız' : durum.maxKcal + ' kcal'; }

  function baslat() {
    var a = veri.ayar || {};
    var d = $('#duyuru');
    if (a.duyuruAktif && a.duyuru) { d.textContent = a.duyuru; d.hidden = false; }
    $('#altYazi').textContent = a.altYazi || '';
    $('#not').textContent = a.not || '';
    if (params.get('onizleme')) bildir('Önizleme: taslak gösteriliyor');
    gununCiz(); alerjenCiz(); ciz(); kahramanKur(); ilerlemeKur(); olaylar();
  }

  yukle().then(function (v) { veri = v; baslat(); }).catch(function () {
    $('#menu').innerHTML = '<div class="bos"><b>Hay aksi</b>Menü şu an yüklenemedi. Lütfen sayfayı yenileyin.</div>';
  });
})();
