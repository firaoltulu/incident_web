
import { CONFIG } from 'src/config-global';

import { _mock } from './_mock';

// APP
// ----------------------------------------------------------------------

export const _appRelated = [
  'Microsoft office 365',
  'Opera',
  'Adobe acrobat reader DC',
  'Joplin',
  'Topaz photo AI',
].map((name, index) => ({
  id: _mock.id(index),
  name,
  downloaded: _mock.number.nativeL(index),
  ratingNumber: _mock.number.rating(index),
  size: _mock.number.nativeL(index) * 1024,
  totalReviews: _mock.number.nativeL(index),
  shortcut: `${CONFIG.site.basePath}/assets/icons/app/ic-app-${index + 1}.webp`,
  price: [2, 4].includes(index) ? _mock.number.price(index) : 0,
}));

export const _appInstalled = ['Germany', 'England', 'France', 'Korean', 'USA'].map(
  (country, index) => ({
    id: _mock.id(index),
    countryName: country,
    android: _mock.number.nativeL(index),
    windows: _mock.number.nativeL(index + 1),
    apple: _mock.number.nativeL(index + 2),
    countryCode: ['de', 'gb', 'fr', 'kr', 'us'][index],
  })
);

export const _appAuthors = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  totalFavorites: _mock.number.nativeL(index),
}));

export const _appInvoices = [...Array(5)].map((_, index) => {
  const category = ['Android', 'Mac', 'Windows', 'Android', 'Mac'][index];

  const status = ['paid', 'out of date', 'progress', 'paid', 'paid'][index];

  return {
    id: _mock.id(index),
    invoiceNumber: `INV-199${index}`,
    price: _mock.number.price(index),
    category,
    status,
  };
});

export const _appFeatured = [...Array(3)].map((_, index) => ({
  id: _mock.id(index + 3),
  title: _mock.postTitle(index + 3),
  description: _mock.sentence(index + 3),
  coverUrl: _mock.image.cover(index + 3),
}));

// ANALYTIC
// ----------------------------------------------------------------------


// ECOMMERCE
// ----------------------------------------------------------------------

export const _ecommerceSalesOverview = ['Total profit', 'Total income', 'Total expenses'].map(
  (label, index) => ({
    label,
    totalAmount: _mock.number.price(index) * 100,
    value: _mock.number.percent(index),
  })
);

export const _ecommerceBestSalesman = [...Array(5)].map((_, index) => {
  const category = ['CAP', 'Branded shoes', 'Headphone', 'Cell phone', 'Earings'][index];

  return {
    id: _mock.id(index),
    category,
    rank: `Top ${index + 1}`,
    email: _mock.email(index),
    name: _mock.fullName(index),
    totalAmount: _mock.number.price(index),
    avatarUrl: _mock.image.avatar(index + 8),
    countryCode: ['de', 'gb', 'fr', 'kr', 'us'][index],
  };
});

export const _ecommerceLatestProducts = [...Array(5)].map((_, index) => {
  const colors = (index === 0 && ['#2EC4B6', '#E71D36', '#FF9F1C', '#011627']) ||
    (index === 1 && ['#92140C', '#FFCF99']) ||
    (index === 2 && ['#0CECDD', '#FFF338', '#FF67E7', '#C400FF', '#52006A', '#046582']) ||
    (index === 3 && ['#845EC2', '#E4007C', '#2A1A5E']) || ['#090088'];

  return {
    id: _mock.id(index),
    colors,
    name: _mock.productName(index),
    price: _mock.number.price(index),
    coverUrl: _mock.image.product(index),
    priceSale: [1, 3].includes(index) ? _mock.number.price(index) : 0,
  };
});

export const _ecommerceNewProducts = [...Array(4)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.productName(index),
  coverUrl: _mock.image.product(index),
}));

// BANKING
// ----------------------------------------------------------------------

// BOOKING
// ----------------------------------------------------------------------


// COURSE
// ----------------------------------------------------------------------
