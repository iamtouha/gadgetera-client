import qs from "qs";

const resource = "/products";

export default $axios => ({
  filter: {
    _start: 0,
    _limit: 12
  },
  get() {
    const query = qs.stringify(this.filter);
    return $axios.get(`${resource}?${query}`);
  },
  getOne(id) {
    return $axios.get(`${resource}/${id}`);
  },
  slug(slug) {
    if (!slug) {
      return this;
    }
    this.filter.slug = slug;
    return this;
  },
  maxPrice(bdt) {
    if (bdt > 0) {
      this.filter.price_gte = +bdt;
    }
    return this;
  },
  minPrice(bdt) {
    if (bdt > 0) {
      this.filter.price_lte = +bdt;
    }
    return this;
  },
  start(from = 0) {
    this.filter._start = from;
    return this;
  },
  limit(limit = 12) {
    this.filter._limit = limit;
    return this;
  },
  sort(field, order) {
    if (order !== "asc" || order !== "desc") {
      return this;
    }
    switch (field) {
      case "date": {
        this.filter._sort = "published_at:" + order.toUpperCase();
        return this;
      }
      case "price": {
        this.filter._sort = "price:" + order.toUpperCase();
        return this;
      }
      default: {
        return this;
      }
    }
  },
  brand({ id, key }) {
    if (id) {
      this.filter.brand = id;
    } else if (key) {
      this.filter["brand.key"] = key;
    }
    return this;
  },
  subcategory({ id, key }) {
    if (id || key) {
      delete this.filter["category.key"];
      delete this.filter.category;
    }
    if (id) {
      this.filter.subcategory = id;
    } else if (key) {
      this.filter["subcategory.key"] = key;
    }
    return this;
  },
  category({ id, key }) {
    if (id) {
      this.filter["subcategory.category"] = id;
    } else if (key) {
      this.filter["subcategory.category.key"] = key;
    }
    return this;
  },
  search(text) {
    const name = text?.trim();
    if (name) {
      this.filter.name_contains = name;
    }
    return this;
  }
});
