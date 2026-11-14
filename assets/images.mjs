export const images = {
  "product-coffin-fabric": { "alt": "Закрытый гроб с тканевой обивкой" },
  "product-coffin-wood": { "alt": "Закрытый гроб из натурального дерева" },
  "product-coffin-custom": { "alt": "Закрытый гроб из тёмного дерева с декоративной отделкой" },
  "product-wreath-roses": { "alt": "Траурный венок из белых роз и зелени" },
  "product-wreath-memory": { "alt": "Траурный венок из белых цветов и зелени" },
  "product-flower-basket": { "alt": "Корзина белых цветов и зелени" },

  "remote-care": {
    "alt": "Белая калла и ветка оливы на камне у окна в тихий сад"
  },
  "garden-haze": {
    "alt": "Мягкие силуэты деревьев и каменной дорожки в расфокусе"
  },
  "stone-graphite": {
    "alt": "Мелкозернистая фактура матового графитового камня"
  },
  "stone-marble": {
    "alt": "Тёмный матовый мрамор с тонкими светлыми прожилками"
  },
  "stone-limestone": {
    "alt": "Светлая тёплая поверхность натурального известняка"
  },
  "home": {
    "alt": "Белые каллы и розы на камне в мягком солнечном свете"
  },
  "hub-services": {
    "alt": "Сдержанная цветочная композиция в зале прощания"
  },
  "hub-prices": {
    "file": "hub-prices-v2", "alt": "Закрытая папка, траурные цветы и свеча"
  },
  "hub-memorials": {
    "file": "hub-memorials-v2", "alt": "Гранитная стела с именем и эпитафией среди белых цветов"
  },
  "hub-help": {
    "file": "hub-help-v2", "alt": "Разлинованная книга соболезнований и свеча"
  },
  "hub-contacts": {
    "alt": "Телефон и блокнот на столе у спокойного окна"
  },
  "funeral": {
    "alt": "Зал прощания с белыми цветами и сдержанным оформлением"
  },
  "cremation": {
    "alt": "Керамическая урна, свеча и белые цветы"
  },
  "remote": {
    "file": "remote-header-logo", "alt": "Ноутбук со знаком и названием «Знак вечности», смартфон с тем же знаком без текста"
  },
  "repatriation": {
    "alt": "Ритуальный автомобиль на тихой дороге"
  },
  "exhumation": {
    "file": "exhumation-v2", "alt": "Каменная дорожка и стела с надписью в мемориальном саду"
  },
  "documents": {
    "file": "documents-v2", "alt": "Папка, конверт, свеча и траурные цветы"
  },
  "goods": {
    "alt": "Ритуальные принадлежности из дерева и ткани"
  },
  "preparation": {
    "alt": "Аккуратно сложенная светлая ткань и средства ухода"
  },
  "floristry": {
    "alt": "Траурный венок из белых роз и зелени"
  },
  "care": {
    "file": "care-v2", "alt": "Ухоженное захоронение с надписью на стеле и цветами"
  },
  "forging": {
    "alt": "Кованая ограда с простым растительным рисунком"
  },
  "flower-delivery": {
    "alt": "Корзина белых цветов с нейтральной траурной лентой"
  },
  "goods-coffins": {
    "alt": "Закрытый деревянный гроб со светлой цветочной композицией"
  },
  "goods-wreaths": {
    "alt": "Венок и корзина белых цветов"
  },
  "article-first-steps": {
    "file": "article-first-steps-v2", "alt": "Белые цветы с траурной лентой и свеча"
  },
  "article-medical-certificate": {
    "file": "article-medical-certificate-v2", "alt": "Закрытая папка, конверт, свеча и цветок с траурной лентой"
  },
  "article-state-certificate": {
    "alt": "Папка для документов и конверт в мягком свете"
  },
  "article-support": {
    "alt": "Два спокойных кресла для беседы и белые цветы"
  },
  "article-places": {
    "alt": "Тихая аллея мемориального сада"
  },
  "legal": {
    "alt": "Нейтральная папка с чистыми листами на тёмном столе"
  }
};

export function imageSources(key) {
  const image = images[key];
  if (!image) throw new Error(`Unknown image key: ${key}`);
  const file = image.file || key;
  return { alt: image.alt, src: `/znak-vechnosti-preview/assets/${file}-1600.jpg`, srcset: `/znak-vechnosti-preview/assets/${file}-760.jpg 760w, /znak-vechnosti-preview/assets/${file}-1600.jpg 1600w`, width:1600, height:900 };
}
