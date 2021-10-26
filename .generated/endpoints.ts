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
        postProduct: '/Product/Product',
        getProduct1: '/Product/GetProduct1',
        getProductDefault: '/api/v1/Product',
        postProductDefault: '/api/v1/Product',
        putProductDefault: '/api/v1/Product',
        getProductsByStatus: '/api/v1/Product/GetProductsByStatus/{status}',
        searchProducts: '/Product/SearchProducts'
    };
}
