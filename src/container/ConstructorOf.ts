// eslint-disable-next-line @typescript-eslint/ban-types
type AbstractConstructor<T> = Function & { prototype: T };
export type Constructor<T> = new (...args: unknown[]) => T;

export type ConstructorOf<T> = Constructor<T> | AbstractConstructor<T>;
