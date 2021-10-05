export type TypeOrUndefined<T> = T | undefined;
export type TypeOrUndefinedNullable<T> = T | undefined | null;
export type DTOIdentityType = { id: TypeOrUndefined<string> };