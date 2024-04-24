export function first<T>(array: T[]): T {
    return array[0];
}

export function lowerFirst(value: string): string {
    const [first, ...other] = value;
    return first.toLocaleLowerCase() + other.join('');
}

export function upperFirst(value: string): string {
    const [first, ...other] = value;
    return first.toLocaleUpperCase() + other.join('');
}

export function last<T>(array: T[]): T {
    return array[array.length - 1];
}

export function sortBy<T>(fn: (value: T) => string): (a: T, b: T) => number {
    return (a: T, b: T) => (fn(a) || '').localeCompare(fn(b) || '');
}

export function getInterfaceName(name: string): string {
    return `I${name}`;
}

export function getUnionName(name: string): string {
    return `${name}Union`;
}

export function getUnionTypesName(name: string): string {
    return `${name}UnionTypes`;
}

export function getClassName(name: string): string {
    return `${name}Class`;
}
