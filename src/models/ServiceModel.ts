import { IMethodModel } from './MethodModel';

export interface IServiceModel {
    name: string;
    relativePath: string;
    methods: IMethodModel[];
}
