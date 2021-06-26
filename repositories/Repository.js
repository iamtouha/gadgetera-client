import ProductRepository from "./ProductRepository";
import CategoryRepository from "./CategoryRepository";
import SubcategoryRepository from "./SubcategoryRepository";
import BrandRepository from "./BrandRepository";
import HomepageRepository from "./HomepageRepository";

export default $axios => ({
  product: ProductRepository($axios),
  category: CategoryRepository($axios),
  brand: BrandRepository($axios),
  subcategory: SubcategoryRepository($axios),
  homepage: HomepageRepository($axios)
});
