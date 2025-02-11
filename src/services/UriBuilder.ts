import { ParameterPlace } from '../models/kinds/ParameterPlace';
import { IMethodModel } from '../models/method-parameter/IMethodModel';
import { IParameter } from '../models/method-parameter/IParameter';

export class UriBuilder {
    public buildUri(model: IMethodModel): string {
        const queryParams = this.getQueryParams(model.parameters);
        const pathParams = this.getPathParam(model.parameters);
        let path = model.originUri;

        if (pathParams.length) {
            pathParams.forEach((z) => (path = path.replace(`{${z}}`, `\${encodeURIComponent(${z})}`)));
        }

        return '`' + `${path}${queryParams}` + '`';
    }

    private getQueryParams(params: IParameter[]): string {
        const pairs = params.filter((z) => z.place === ParameterPlace.Query)
            .map((z) => z.isCollection ?
                `\${(${z.name}.map(x=> \`${z.name}=\${encodeURIComponent(x)}\`).join('&'))}` :
                `${z.name}=\${encodeURIComponent(${z.name})}`);

        if (!pairs.length) {
            return '';
        }

        return `?${pairs.join('&')}`;
    }

    private getPathParam(params: IParameter[]): string[] {
        return params.filter((z) => z.place === ParameterPlace.Path).map((z) => z.name);
    }
}
