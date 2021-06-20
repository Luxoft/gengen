export class Endpoints {
    public static CategoryService = {
        addCategory: '/api/v1/Category/AddCategory',
        upload: '/api/v1/Category/Upload'
    };
    public static ProductService = {
        '': '/api/v1/Product',
        download: '/Product/Download',
        getById: '/api/v1/Product/GetById/{id}',
        getProducts: '/Product/GetProducts',
        searchProducts: '/Product/SearchProducts'
    };
}
