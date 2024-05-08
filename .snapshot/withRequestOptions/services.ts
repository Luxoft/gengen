import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid, mapGuid } from './Guid';
import { BaseHttpService, IAngularHttpRequestOptions } from './base-http.service';
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

    public addCategory(category: $models.ICategory, options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<Guid> {
        return this.post<string>(
            `AddCategory`,
            category,
            options,
        ).pipe(mapGuid());
    }

    public upload(data: FormData, options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<Guid> {
        return this.post<string>(
            `Upload`,
            data,
            options,
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

    public postFeedback(options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<void> {
        return this.post<void>(
            ``,
            options,
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

    public download(saveAs?: $types.TypeOrUndefined<string>, options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Promise<IDownloadResult> {
        return this.downloadFile(
            `Download`,
            'get',
            undefined,
            saveAs,
            options
        );
    }

    public downloadAttachment(id: string, productIdentityDTO: $models.IProductIdentityDTO, saveAs?: $types.TypeOrUndefined<string>, options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Promise<IDownloadResult> {
        return this.downloadFile(
            `DownloadAttachment?id=${encodeURIComponent(id)}`,
            'post',
            productIdentityDTO,
            saveAs,
            options
        );
    }

    public getByCustomerType(customer: string, type: string, date: string, options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<$types.TypeOrUndefined<$models.Product>> {
        return this.get<$types.TypeOrUndefined<$models.IProduct>>(
            `getByCustomer/${encodeURIComponent(customer)}/type/${encodeURIComponent(type)}?date=${encodeURIComponent(date)}`,
            options,
        ).pipe($mappers.mapSingle($models.Product));
    }

    public getById(id: string, options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<$types.TypeOrUndefined<$models.Product>> {
        return this.get<$types.TypeOrUndefined<$models.IProduct>>(
            `GetById/${encodeURIComponent(id)}`,
            options,
        ).pipe($mappers.mapSingle($models.Product));
    }

    public getProduct(options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            ``,
            options,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public getProducts(options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `GetProducts`,
            options,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public getProductsByStatus(status: $models.ProductStatus, options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `GetProductsByStatus/${encodeURIComponent(status)}`,
            options,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public itemsGetById(parameter: string, options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<$models.Product[]> {
        return this.post<$models.IProduct[]>(
            `Items/GetById`,
            parameter,
            options,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public itemsGetByIds(parameter: string[], options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<$models.Product[]> {
        return this.post<$models.IProduct[]>(
            `Items/GetByIds`,
            parameter,
            options,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public product(options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `Product`,
            options,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public searchProducts(name: string, options?: $types.TypeOrUndefined<IAngularHttpRequestOptions>): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `SearchProducts?name=${encodeURIComponent(name)}`,
            options,
        ).pipe($mappers.mapCollection($models.Product));
    }
}
