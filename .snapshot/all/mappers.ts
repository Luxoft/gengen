import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function mapCollection<TDTO, TModel>(dtoMapper: {
  fromDTO(value: TDTO): TModel;
}): OperatorFunction<TDTO[], TModel[]> {
  return map((z) => z.map((x) => dtoMapper.fromDTO(x)));
}

export function mapSingle<TDTO, TModel>(dtoMapper: {
  fromDTO(value: TDTO): TModel;
}): OperatorFunction<TDTO, TModel> {
  return map((z) => (z ? dtoMapper.fromDTO(z) : undefined));
}

export function mapIdentityCollection<TModel>(identity: {
  new (id: string): TModel;
}): OperatorFunction<{ id: string }[], TModel[]> {
  return map((z) => z.map((x) => new identity(x.id)));
}

export function mapIdentitySingle<TModel>(identity: {
  new (id: string): TModel;
}): OperatorFunction<{ id: string }, TModel> {
  return map((z) => (z ? new identity(z.id) : undefined));
}
