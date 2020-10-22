import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IAngularHttpRequestOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

export abstract class BaseHttpService {
  constructor(private relativePath: string, protected http: HttpClient) {}

  protected get<TResult>(url: string): Observable<TResult> {
    return this.http.get<TResult>(`${this.relativePath}/${url}`);
  }

  protected post<TResult, TData = {}>(
    url: string,
    data?: TData,
    options?: IAngularHttpRequestOptions
  ): Observable<TResult> {
    return this.http.post<TResult>(
      `${this.relativePath}/${url}`,
      data,
      options
    );
  }

  protected delete<TResult>(
    url: string,
    options?: IAngularHttpRequestOptions
  ): Observable<TResult> {
    return this.http.delete<TResult>(`${this.relativePath}/${url}`, options);
  }

  public get path(): string {
    return this.relativePath;
  }
}
