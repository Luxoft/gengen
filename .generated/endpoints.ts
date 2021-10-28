export class Endpoints {
    public static CategoryService = {
        addCategory: '/api/v1/Category/AddCategory',
        upload: '/api/v1/Category/Upload'
    };
    public static ProductService = {
        download: '/Product/Download',
        getByCustomerType: '/Product/getByCustomer/{customer}/type/{type}',
        getById: '/api/v1/Product/GetById/{id}',
        getProduct: '/Product/Product',
        getProductq: '/Product/GetProductq',
        getProducts: '/Product/GetProducts',
        getProductsByStatus: '/api/v1/Product/GetProductsByStatus/{status}',
        postProduct: '/Product/Product',
        productDefault: '/api/v1/Product',
        searchProducts: '/Product/SearchProducts'
    };
}
