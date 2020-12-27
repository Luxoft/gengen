import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from './Guid';
import { BaseHttpService } from './base-http.service';
import { DownloadFileService, IDownloadResult } from './download.service';
import * as $mappers from './mappers';
import * as $models from './models';

@Injectable({
    providedIn: 'root'
})
export class CategoryService extends BaseHttpService {
    constructor(http: HttpClient) {
        super('/api/v1/Category', http);
    }

    public addCategory(category: $models.ICategory): Observable<Guid> {
        return this.post<string>(
            `addCategory`,
            category,
        ).pipe($mappers.mapGuid());
    }
}

@Injectable({
    providedIn: 'root'
})
export class ProductService extends DownloadFileService {
    constructor(http: HttpClient) {
        super('/Product', http);
    }

    public download(saveAs: string = undefined): Promise<IDownloadResult> {
        return this.downloadFile(
            `download`,
            'get',
            undefined,
            saveAs
        );
    }

    public get(id: string): Observable<$models.Product> {
        return this.get<$models.IProduct>(
            `get?id=${encodeURIComponent(id)}`,
        ).pipe($mappers.mapSingle($models.Product));
    }

    public getProducts(): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `getProducts`,
        ).pipe($mappers.mapCollection($models.Product));
    }

    public searchProducts(name: string): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `searchProducts?name=${encodeURIComponent(name)}`,
        ).pipe($mappers.mapCollection($models.Product));
    }
}
