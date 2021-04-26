import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from './Guid';
import { BaseHttpService } from './base-http.service';
import { DownloadFileService, IDownloadResult } from './download.service';
import { getBasePath } from './utils';
import * as $mappers from './mappers';
import * as $models from './alias-models';

@Injectable({
    providedIn: 'root'
})
export class CategoryService extends BaseHttpService {
    constructor(http: HttpClient) {
        super(getBasePath('alias', '/api/v1/Category'), http);
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
export class ProductService extends BaseHttpService {
    constructor(http: HttpClient) {
        super(getBasePath('alias', '/Product'), http);
    }

    public getProducts(): Observable<$models.Product[]> {
        return this.get<$models.IProduct[]>(
            `getProducts`,
        ).pipe($mappers.mapCollection($models.Product));
    }
}
