export class Endpoints {
    public static CategoryService = {
        addCategory: '/api/v1/Category/AddCategory',
        upload: '/api/v1/Category/Upload'
    };
    public static ProductService = {
        download: '/Product/Download',
        getByCustomerType: '/Product/getByCustomer/{customer}/type/{type}',
        getById: '/api/v1/Product/GetById/{id}',
        getProducts: '/Product/GetProducts',
        getProductsByStatus: '/api/v1/Product/GetProductsByStatus/{status}',
        product: '/Product/Product',
        productGet: '/api/v1/Product',
        searchProducts: '/Product/SearchProducts'
    };
}
