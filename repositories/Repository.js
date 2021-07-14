import ProductRepository from "./ProductRepository";
import CategoryRepository from "./CategoryRepository";
import SubcategoryRepository from "./SubcategoryRepository";
import BrandRepository from "./BrandRepository";
import HomepageRepository from "./HomepageRepository";
import OrderRepository from "./OrderRepository";
import CouponRepository from "./CouponRepository";
import ReviewRepository from "./ReviewRepository";
import PaymentRepository from "./PaymentRepository";
import UserRepository from "./UserRepository";

export default $axios => ({
  product: ProductRepository($axios),
  category: CategoryRepository($axios),
  brand: BrandRepository($axios),
  subcategory: SubcategoryRepository($axios),
  homepage: HomepageRepository($axios),
  order: OrderRepository($axios),
  coupon: CouponRepository($axios),
  review: ReviewRepository($axios),
  payment: PaymentRepository($axios),
  user: UserRepository($axios)
});
