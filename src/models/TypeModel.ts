import { PropertyKind } from './kinds/PropertyKind';

export interface IType {
    kind: PropertyKind;
    type: string;
    dtoType: string;
}
