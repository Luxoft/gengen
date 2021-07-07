import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from './Guid';
import { BaseHttpService } from './base-http.service';
import { DownloadFileService, IDownloadResult } from './download.service';
import { getBasePath } from './utils';
import * as $mappers from './mappers';
import * as $models from './models';

@Injectable({
    providedIn: 'root'
})
export class CategoryService extends BaseHttpService {
    constructor(http: HttpClient) {
        super(getBasePath('', '/api/v1/Category'), http);
    }

    public addCategory(category: $models.ICategory): Observable<Guid> {
        return this.post<string>(
            `AddCategory`,
            category,
        ).pipe($mappers.mapGuid());
    }

    public upload(data: FormData): Observable<Guid> {
        return this.post<string>(
            `Upload`,
            data,
        ).pipe($mappers.mapGuid());
    }
}

@Injectable({
    providedIn: 'root'
})
export class ProductService extends DownloadFileService {
    constructor(http: HttpClient) {
        super(getBasePath('', '/Product'), http);
    }

    public download(saveAs: string = undefined): Promise<IDownloadResult> {
        return this.downloadFile(
            `Download`,
            'get',
            undefined,
            saveAs
        );
    }

    public getById(id: string): Observable<$models.Product> {
        return this.get<$models.IProduct>(
            `GetById/${encodeURIComponent(id)}`,
        ).pipe($mappers.mapSingle($models.Product));
    }

    public getProducts(): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `GetProducts`,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public getProductsByStatus(status: $models.ProductStatus): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `GetProductsByStatus/${encodeURIComponent(status)}`,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public searchProducts(name: string): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `SearchProducts?name=${encodeURIComponent(name)}`,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public type(customer: string, type: string, date: string): Observable<$models.Product> {
        return this.get<$models.IProduct>(
            `getByCustomer/${encodeURIComponent(customer)}/type/${encodeURIComponent(type)}?date=${encodeURIComponent(date)}`,
        ).pipe($mappers.mapSingle($models.Product));
    }
}
