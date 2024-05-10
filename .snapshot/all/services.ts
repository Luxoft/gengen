import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid, mapGuid } from './Guid';
import { BaseHttpService } from './base-http.service';
import { DownloadFileService, IDownloadResult } from './download.service';
import { getBasePath } from './utils';
import * as $mappers from './mappers';
import type * as $types from './types';
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
        ).pipe(mapGuid());
    }

    public upload(data: FormData): Observable<Guid> {
        return this.post<string>(
            `Upload`,
            data,
        ).pipe(mapGuid());
    }
}

@Injectable({
    providedIn: 'root'
})
export class FeedbackService extends BaseHttpService {
    constructor(http: HttpClient) {
        super(getBasePath('', '/api/feedback'), http);
    }

    public postFeedback(): Observable<void> {
        return this.post<void>(
            ``,
        );
    }
}

@Injectable({
    providedIn: 'root'
})
export class ProductService extends DownloadFileService {
    constructor(http: HttpClient) {
        super(getBasePath('', '/Product'), http);
    }

    public download(saveAs?: $types.TypeOrUndefined<string>): Promise<IDownloadResult> {
        return this.downloadFile(
            `Download`,
            'get',
            undefined,
            saveAs,
            undefined
        );
    }

    public downloadAttachment(id: string, productIdentityDTO: $models.IProductIdentityDTO, saveAs?: $types.TypeOrUndefined<string>): Promise<IDownloadResult> {
        return this.downloadFile(
            `DownloadAttachment?id=${encodeURIComponent(id)}`,
            'post',
            productIdentityDTO,
            saveAs,
            undefined
        );
    }

    public getByCustomerType(customer: string, type: string, date: string): Observable<$types.TypeOrUndefined<$models.Product>> {
        return this.get<$types.TypeOrUndefined<$models.IProduct>>(
            `getByCustomer/${encodeURIComponent(customer)}/type/${encodeURIComponent(type)}?date=${encodeURIComponent(date)}`,
        ).pipe($mappers.mapSingle($models.Product));
    }

    public getById(id: string): Observable<$types.TypeOrUndefined<$models.Product>> {
        return this.get<$types.TypeOrUndefined<$models.IProduct>>(
            `GetById/${encodeURIComponent(id)}`,
        ).pipe($mappers.mapSingle($models.Product));
    }

    public getProduct(): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            ``,
        ).pipe($mappers.mapCollection($models.Product));
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

    public itemsGetById(parameter: string): Observable<$models.Product[]> {
        return this.post<$models.IProduct[]>(
            `Items/GetById`,
            parameter,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public itemsGetByIds(parameter: string[]): Observable<$models.Product[]> {
        return this.post<$models.IProduct[]>(
            `Items/GetByIds`,
            parameter,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public product(): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `Product`,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public searchProducts(name: string): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `SearchProducts?name=${encodeURIComponent(name)}`,
        ).pipe($mappers.mapCollection($models.Product));
    }
}
