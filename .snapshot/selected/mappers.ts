import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { toDateIn } from './date-converters';
import { Guid } from './Guid';

export function mapCollection<TDTO, TModel>(dtoMapper: { fromDTO(value: TDTO): TModel }): OperatorFunction<TDTO[], TModel[]> {
    return map((z: TDTO[]) => z.map((x) => dtoMapper.fromDTO(x)));
}

export function mapSingle<TDTO, TModel>(dtoMapper: { fromDTO(value: TDTO): TModel }): OperatorFunction<TDTO, TModel> {
    return map((z: TDTO) => (z ? dtoMapper.fromDTO(z) : undefined));
}

export function mapIdentityCollection<TModel>(identity: { new(id: string): TModel }): OperatorFunction<{ id: string }[], TModel[]> {
    return map((z: { id: string }[]) => z.map((x) => new identity(x.id)));
}

export function mapIdentitySingle<TModel>(identity: { new(id: string): TModel }): OperatorFunction<{ id: string }, TModel> {
    return map((z: { id: string }) => (z ? new identity(z.id) : undefined));
}

export function mapGuid(): OperatorFunction<string, Guid> {
    return map((z: string) => (z ? new Guid(z) : Guid.empty));
}

export function mapDate(): OperatorFunction<string, Date | null> {
    return map((z: string) => (z ? toDateIn(z) : null));
}
