import { HttpClient, HttpResponseBase } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';

export interface IDownloadResult {
  filename: string;

  response: HttpResponseBase;
}

export class DownloadFileService extends BaseHttpService {
  private readonly fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

  constructor(relativePath: string, http: HttpClient) {
    super(relativePath, http);
  }

  public async downloadFile(
    url: string,
    method: 'post' | 'get',
    data?: {},
    saveAs?: string
  ): Promise<IDownloadResult> {
    const request =
      method === 'get'
        ? this.http.get(`${this.path}/${url}`, {
            observe: 'response',
            responseType: 'blob',
          })
        : this.http.post(`${this.path}/${url}`, data, {
            observe: 'response',
            responseType: 'blob',
          });

    const response = await request.toPromise();
    const filename = this.getFileName(response, saveAs);
    const result: IDownloadResult = { filename, response };

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      const success = window.navigator.msSaveOrOpenBlob(
        response.body,
        filename
      );
      return success ? Promise.resolve(result) : Promise.reject(result);
    }

    const link = document.createElement('a');
    const href = window.URL.createObjectURL(response.body);
    link.href = href;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(href);
    link.remove();

    return Promise.resolve(result);
  }

  private getFileName(httpResponse: HttpResponseBase, saveAs?: string): string {
    if (saveAs) {
      return saveAs;
    }

    const disposition = httpResponse.headers.get('Content-Disposition');
    const results = this.fileNameRegex.exec(disposition);
    if (results && results[1]) {
      return results[1].replace(/['"]/g, '');
    }

    return 'unknown filename';
  }
}
