export interface Partner {
  name: string;
  slug: string;
  logo?: string;
  url: string;
}

export const PARTNER_BRANDS: Partner[] = [
  { name: 'НОВАТЭК', slug: 'novatek', logo: '/partners/novatek.svg', url: 'https://novatek.ru' },
  { name: 'СИБУР', slug: 'sibur', logo: '/partners/sibur.svg', url: 'https://www.sibur.ru' },
  { name: 'ГK ПИК', slug: 'pik', logo: '/partners/pik.svg', url: 'https://www.pik.ru' },
  { name: 'ЛУКОЙЛ', slug: 'lukoil', logo: '/partners/lukoil.svg', url: 'https://lukoil.ru' },
  { name: 'РЖД', slug: 'rzd', logo: '/partners/rzd.svg', url: 'https://www.rzd.ru' },
  { name: 'РОСАТОМ', slug: 'rosatom', logo: '/partners/rosatom.svg', url: 'https://rosatom.ru' },
  { name: 'ГАЗПРОМ', slug: 'gazprom', logo: '/partners/gazprom.svg', url: 'https://www.gazprom.ru' },
  { name: 'СЕВЕРСТАЛЬ', slug: 'severstal', logo: '/partners/severstal.png', url: 'https://severstal.com' },
  { name: 'МЕТАЛЛОИНВЕСТ', slug: 'metalloinvest', logo: '/partners/metalloinvest.svg', url: 'https://www.metalloinvest.com' },
  { name: 'ОМК', slug: 'omk', logo: '/partners/omk.svg', url: 'https://www.omk.ru' },
  { name: 'УЗТМ', slug: 'uztm', logo: '/partners/uztm.png', url: 'https://www.uralmash.ru' },
  { name: 'ЕВРАЗ', slug: 'evraz', logo: '/partners/evraz.svg', url: 'https://evraz.com' },
];
