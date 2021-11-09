import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IAngularHttpRequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    observe?: 'body' | 'response';
    params?: HttpParams | { [param: string]: string | string[] };
    reportProgress?: boolean;
    responseType?: 'json' | 'blob';
    withCredentials?: boolean;
}

export abstract class BaseHttpService {
    constructor(private relativePath: string, protected http: HttpClient) {}

    protected get<TResult>(url: string, options?: IAngularHttpRequestOptions): Observable<TResult> {
        return this.http.get<TResult>(this.getPath(url), options as unknown);
    }

    protected post<TResult, TData = {}>(
        url: string,
        data?: TData,
        options?: IAngularHttpRequestOptions
    ): Observable<TResult> {
        return this.http.post<TResult>(this.getPath(url), data, options as unknown);
    }

    protected delete<TResult>(url: string, options?: IAngularHttpRequestOptions): Observable<TResult> {
        return this.http.delete<TResult>(this.getPath(url), options as unknown);
    }

    public get path(): string {
        return this.relativePath;
    }

    private getPath(url: string): string {
        return `${this.relativePath}${url ? `/${url}` : ''}`;
    }
}
