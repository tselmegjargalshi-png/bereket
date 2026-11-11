/* Bereket Fırın & Pastane: ortak alerjen listesi (menü ve yönetim paneli kullanır) */
(function () {
  var S = 'viewBox="0 0 24 24" fill="#fff" stroke="none" aria-hidden="true"';
  var C = 'style="fill:var(--c)"';
  var L = 'fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"';

  var liste = [
    { id: 'gluten', ad: 'Gluten', renk: '#A4532F',
      svg: '<svg ' + S + '><path d="M12 22V9" ' + L + '/>' +
        '<ellipse cx="12" cy="5" rx="1.8" ry="3.2"/>' +
        '<ellipse cx="8.6" cy="9.6" rx="1.7" ry="3" transform="rotate(-35 8.6 9.6)"/>' +
        '<ellipse cx="15.4" cy="9.6" rx="1.7" ry="3" transform="rotate(35 15.4 9.6)"/>' +
        '<ellipse cx="8.6" cy="14.6" rx="1.7" ry="3" transform="rotate(-35 8.6 14.6)"/>' +
        '<ellipse cx="15.4" cy="14.6" rx="1.7" ry="3" transform="rotate(35 15.4 14.6)"/></svg>' },
    { id: 'sut', ad: 'Süt', renk: '#C98BC4',
      svg: '<svg ' + S + '><path d="M6 3h5v3l1.6 2.6V21H4.4V8.6L6 6z"/><path d="M14.5 11H20l-.8 10h-3.9z"/>' +
        '<rect x="6.2" y="12" width="4.4" height="4" rx="1" ' + C + '/></svg>' },
    { id: 'yumurta', ad: 'Yumurta', renk: '#E3C410',
      svg: '<svg ' + S + '><path d="M12 3c4.4 0 8.5 3 8.5 8 0 4.2-3 8.5-7.5 8.5-5 0-9.5-2.2-9.5-7C3.5 7 7 3 12 3z"/>' +
        '<circle cx="12" cy="11.5" r="3.4" ' + C + '/></svg>' },
    { id: 'fistik', ad: 'Yer fıstığı', renk: '#E5A93A',
      svg: '<svg ' + S + '><g transform="rotate(-35 12 12)"><circle cx="12" cy="7.2" r="4.4"/><circle cx="12" cy="16.6" r="4.9"/>' +
        '<rect x="8" y="9.5" width="8" height="5" /></g>' +
        '<circle cx="11" cy="8" r=".9" ' + C + '/><circle cx="14.2" cy="14" r=".9" ' + C + '/><circle cx="10.4" cy="16" r=".9" ' + C + '/></svg>' },
    { id: 'yemis', ad: 'Sert kabuklu yemişler', renk: '#E58A33',
      svg: '<svg ' + S + '><path d="M5.5 10.5h13c0-3.4-2.9-5.5-6.5-5.5S5.5 7.100 5.500 10.500z"/>' +
        '<path d="M6.800 12h10.400c-.6 4.800-2.700 8-5.200 8.500C9.500 20 7.400 16.800 6.800 12z"/><path d="M12 3v2.500" ' + L + '/></svg>' },
    { id: 'susam', ad: 'Susam', renk: '#EF8A2D',
      svg: '<svg ' + S + '>' +
        '<ellipse cx="12" cy="6" rx="2" ry="3.400"/>' +
        '<ellipse cx="17.700" cy="10.200" rx="2" ry="3.400" transform="rotate(72 17.700 10.200)"/>' +
        '<ellipse cx="15.500" cy="16.900" rx="2" ry="3.400" transform="rotate(144 15.500 16.900)"/>' +
        '<ellipse cx="8.500" cy="16.900" rx="2" ry="3.400" transform="rotate(216 8.500 16.900)"/>' +
        '<ellipse cx="6.300" cy="10.200" rx="2" ry="3.400" transform="rotate(288 6.300 10.200)"/></svg>' },
    { id: 'soya', ad: 'Soya', renk: '#2FA24A',
      svg: '<svg ' + S + '><path d="M3.500 17.500C3.500 9 9.500 4 20.500 3.500c0 9-5.500 15-13.500 15.200z"/>' +
        '<circle cx="9" cy="14" r="1.600" ' + C + '/><circle cx="13" cy="10.800" r="1.600" ' + C + '/><circle cx="16.500" cy="7.500" r="1.400" ' + C + '/></svg>' },
    { id: 'hardal', ad: 'Hardal', renk: '#C99A3E',
      svg: '<svg ' + S + '><rect x="9" y="3" width="6" height="4" rx="1"/><rect x="6.500" y="8" width="11" height="13" rx="2.500"/>' +
        '<path d="M12 11.500c1.500 1.800 2.200 2.800 2.200 3.800a2.200 2.200 0 0 1-4.400 0c0-1 .7-2 2.200-3.800z" ' + C + '/></svg>' },
    { id: 'kereviz', ad: 'Kereviz', renk: '#8CC96B',
      svg: '<svg ' + S + '><rect x="5" y="6" width="3.400" height="15" rx="1.700" transform="rotate(-12 6.700 13.500)"/>' +
        '<rect x="10.300" y="4" width="3.400" height="17" rx="1.700"/>' +
        '<rect x="15.600" y="6" width="3.400" height="15" rx="1.700" transform="rotate(12 17.300 13.500)"/>' +
        '<circle cx="7" cy="5.500" r="2.200"/><circle cx="12" cy="3.500" r="2.200"/><circle cx="17" cy="5.500" r="2.200"/></svg>' },
    { id: 'bakla', ad: 'Acı bakla (lupin)', renk: '#8C78C0',
      svg: '<svg ' + S + '><path d="M12 22V9" ' + L + '/>' +
        '<circle cx="12" cy="4.500" r="1.800"/><circle cx="9.500" cy="8" r="1.800"/><circle cx="14.500" cy="8" r="1.800"/>' +
        '<circle cx="9" cy="12.200" r="1.800"/><circle cx="15" cy="12.200" r="1.800"/><circle cx="9.800" cy="16.400" r="1.600"/><circle cx="14.200" cy="16.400" r="1.600"/></svg>' },
    { id: 'balik', ad: 'Balık', renk: '#1E9FE0',
      svg: '<svg ' + S + '><path d="M2.500 12c3-5.200 9.500-6.500 13.500-3.200L21.500 5v14L16 15.200C12 18.500 5.500 17.200 2.500 12z"/>' +
        '<circle cx="8" cy="11" r="1.200" ' + C + '/></svg>' },
    { id: 'deniz', ad: 'Kabuklu deniz ürünleri', renk: '#2F7BD6',
      svg: '<svg ' + S + '><path d="M17.500 4.500C12 3 6 6.500 5.500 12.500c-.3 3.300 1.800 6 5 6.800l.9-2.400c-2-.6-3.200-2.300-3-4.300.4-3.500 4.200-5.800 8.400-4.700z"/>' +
        '<path d="M14.500 15.500l5.500 4M14 18.500l4-.5M10.500 19.300l-1.500 2.200" ' + L + '/><circle cx="17" cy="6.200" r="1.100" ' + C + '/></svg>' },
    { id: 'yumusakca', ad: 'Yumuşakçalar', renk: '#2FB1A6',
      svg: '<svg ' + S + '><path d="M12 21 4.500 11.500a8.500 8.500 0 0 1 15 0z"/>' +
        '<path d="M12 20V8M8.500 17.500 7.500 9.500M15.500 17.500l1-8" fill="none" stroke="var(--c)" stroke-width="1.300" stroke-linecap="round"/></svg>' },
    { id: 'sulfit', ad: 'Sülfitler', renk: '#8B1D2A',
      svg: '<svg ' + S + '><path d="M6.500 3h11c.3 5.500-2 9-5.500 9S6.200 8.500 6.500 3z"/>' +
        '<path d="M12 12v8M8 21h8" ' + L + '/><path d="M7 6.500h10" fill="none" stroke="var(--c)" stroke-width="1.400"/></svg>' }
  ];

  var harita = {};
  liste.forEach(function (a) { harita[a.id] = a; });

  window.ALERJENLER = liste;
  window.ALERJEN = harita;
  window.alerjenIkon = function (id, boyut) {
    var a = harita[id]; if (!a) return '';
    return '<span class="ai" role="img" tabindex="0" data-al="' + a.id + '" aria-label="' + a.ad + '" title="' + a.ad +
      '" style="--c:' + a.renk + (boyut ? ';--s:' + boyut + 'px' : '') + '">' + a.svg + '</span>';
  };
})();
