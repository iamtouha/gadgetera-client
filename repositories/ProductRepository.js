import qs from "qs";

const resource = "/products";

export default $axios => ({
  get(filterParams, { start, limit } = { start: 0, limit: 12 }) {
    const {
      slug,
      sortField,
      search,
      model,
      sortOrder,
      maxPrice,
      minPrice,
      brand,
      category,
      subcategory,
      subcatKey,
      brandKey
    } = filterParams;
    const sort =
      sortField && sortOrder ? `${sortField}:${sortOrder.toUpperCase()}` : null;
    const filterObj = {
      name_contains: search,
      price_gte: minPrice,
      price_lte: maxPrice,
      brand,
      model,
      subcategory,
      "brand.key": brand ? null : brandKey,
      "subcategory.key": subcategory ? null : subcatKey,
      "subcategory.category": subcategory ? null : category,
      _sort: sort,
      _start: start,
      _limit: limit
    };
    const filter = Object.keys(filterObj).reduce((acc, key) => {
      const val = filterObj[key];
      if (val) {
        acc[key] = val;
      }
      return acc;
    }, {});
    const query = qs.stringify(filter);
    return $axios.$get(`${resource}?${slug ? "slug=" + slug : query}`);
  },
  getOne(id) {
    return $axios.$get(`${resource}/${id}`);
  }
});
