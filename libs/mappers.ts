import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { toDateIn } from './date-converters';
import type { DTOIdentityType, TypeOrUndefined } from './types';

export function mapCollection<TDTO, TModel>(dtoMapper: { fromDTO(value: TDTO): TModel }): OperatorFunction<TDTO[], TModel[]> {
    return map((z: TDTO[]) => z.map((x) => dtoMapper.fromDTO(x)));
}

export function mapSingle<TDTO, TModel>(dtoMapper: { fromDTO(value: TDTO): TModel }): OperatorFunction<TypeOrUndefined<TDTO>, TypeOrUndefined<TModel>> {
    return map((x: TypeOrUndefined<TDTO>) => (x ? dtoMapper.fromDTO(x) : undefined));
}

export function mapIdentityCollection<TModel>(identity: { new (id: TypeOrUndefined<string>): TModel }): OperatorFunction<DTOIdentityType[], TModel[]> {
    return map((z: DTOIdentityType[]) => z.map((x) => new identity(x.id)));
}

export function mapIdentitySingle<TModel>(identity: { new (id: TypeOrUndefined<string>): TModel }): OperatorFunction<TypeOrUndefined<DTOIdentityType>, TypeOrUndefined<TModel>> {
    return map((x: TypeOrUndefined<DTOIdentityType>) => (x ? new identity(x.id) : undefined));
}

export function mapDate(): OperatorFunction<string, TypeOrUndefined<Date>> {
    return map(toDateIn);
}

export function mapDateStrict(): OperatorFunction<string, Date> {
    return map((x) => toDateIn(x)!);
}
