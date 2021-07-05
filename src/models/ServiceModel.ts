import { IMethodModel } from './method-parameter/IMethodModel';

export interface IServiceModel {
    name: string;
    relativePath: string;
    methods: IMethodModel[];
}
