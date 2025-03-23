export type TypeOrUndefined<T> = T | undefined;
export type TypeOrUndefinedNullable<T> = T | undefined | null;
export type PublicFields<T> = Pick<T, keyof T>;
export type DTOIdentityType = { id: TypeOrUndefined<string> };
