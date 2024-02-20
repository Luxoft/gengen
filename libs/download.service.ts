import type { HttpClient, HttpContext, HttpHeaders, HttpParams, HttpResponseBase } from '@angular/common/http';

import { BaseHttpService, IAngularHttpRequestOptions } from './base-http.service';

export interface IDownloadResult {
    filename: string;

    response: HttpResponseBase;
}

interface IAngularHttpRequestOptionsBlob {
    headers?:
        | HttpHeaders
        | {
              [header: string]: string | string[];
          };
    observe: 'response';
    context?: HttpContext;
    params?:
        | HttpParams
        | {
              [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
          };
    reportProgress?: boolean;
    responseType: 'blob';
    withCredentials?: boolean;
}

export class DownloadFileService extends BaseHttpService {
    private readonly fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    private readonly defaultFileName = 'unknown filename';

    constructor(relativePath: string, http: HttpClient) {
        super(relativePath, http);
    }

    public async downloadFile(
        url: string,
        method: 'post' | 'get',
        data?: {},
        saveAs?: string,
        options?: IAngularHttpRequestOptions
    ): Promise<IDownloadResult> {
        const downloadOptions: IAngularHttpRequestOptionsBlob = {
            ...options,
            observe: 'response',
            responseType: 'blob'
        };

        const request =
            method === 'get' ? this.http.get(this.getPath(url), downloadOptions) : this.http.post(this.getPath(url), data, downloadOptions);

        const response = (await request.toPromise())!;
        const filename = this.getFileName(response, saveAs);
        this.downloadBlob(filename, response.body!);
        return { filename, response };
    }

    private downloadBlob(filename: string, data: Blob): void {
        const link = document.createElement('a');
        const href = window.URL.createObjectURL(data);
        link.href = href;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(href);
        link.remove();
    }

    private getFileName(httpResponse: HttpResponseBase, saveAs?: string): string {
        if (saveAs) {
            return saveAs;
        }

        const disposition = httpResponse.headers.get('Content-Disposition');
        if (!disposition) {
            return this.defaultFileName;
        }

        const results = this.fileNameRegex.exec(disposition);
        if (!results?.[1]) {
            return this.defaultFileName;
        }

        return results?.[1].replace(/['"]/g, '');
    }
}
