const axios = require("axios");
module.exports = async function() {
  const baseUrl = process.env.BASE_URL || "http://localhost:1337";
  const { data: products } = await axios.get(
    baseUrl + "/products?_sort=updatedAt:DESC"
  );
  const { data: categories } = await axios.get(
    baseUrl + "/categories?_sort=updatedAt:DESC"
  );
  const { data: brands } = await axios.get(
    baseUrl + "/brands?_sort=updatedAt:DESC"
  );
  const { data: subcats } = await axios.get(
    baseUrl + "/subcategories?_sort=updatedAt:DESC"
  );
  const productPages = products.map(prod => ({
    url: "/products/" + prod.slug,
    changefreq: "weekly",
    lastmod: prod.updatedAt,
    priority: 0.8,
    img: prod.images.map(item => ({
      url: item.url,
      caption: item.caption || prod.name,
      title: prod.name
    }))
  }));
  const categoryPages = categories.map(cat => ({
    url: "/categories/" + cat.key,
    changefreq: "weekly",
    lastmod: cat.updatedAt,
    priority: 0.8,
    img: [
      {
        url: cat.cover.url,
        caption: cat.cover.caption || cat.name,
        title: cat.name
      }
    ]
  }));
  const brandPages = brands.map(item => ({
    url: "/brands/" + item.key,
    changefreq: "weekly",
    lastmod: item.updatedAt,
    priority: 0.8,
    img: [
      {
        url: item.logo.url,
        caption: item.logo.caption || item.name,
        title: item.name
      }
    ]
  }));
  const subcatPages = subcats.map(item => ({
    url: "/subcategories/" + item.key,
    changefreq: "weekly",
    lastmod: item.updatedAt,
    priority: 0.8,
    img: [
      {
        url: item.cover.url,
        caption: item.cover.caption || item.name,
        title: item.name
      }
    ]
  }));
  return [
    {
      url: "/",
      changefreq: "weekly",
      priority: 1
    },
    {
      url: "/products",
      changefreq: "weekly",
      lastmod: products[0].updatedAt,
      priority: 1
    },
    {
      url: "/categories",
      changefreq: "weekly",
      lastmod: categories[0].updatedAt,
      priority: 1
    },
    {
      url: "/brands",
      changefreq: "weekly",
      lastmod: brands[0].updatedAt,
      priority: 1
    },
    ...productPages,
    ...categoryPages,
    ...brandPages,
    ...subcatPages
  ];
};
