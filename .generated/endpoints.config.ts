import { Endpoints } from './endpoints';

export default new Set<string>([
    Endpoints.ProductService.getProducts,
    Endpoints.CategoryService.addCategory,
]);
