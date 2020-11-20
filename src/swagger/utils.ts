export function distinct(value: string[]): string[] {
    return [...new Set(value)];
}

export function lowerFirst(value: string): string {
    const [first, ...other] = value;
    return first.toLocaleLowerCase() + other.join('');
}
export function sortBy<T>(fn: (value: T) => string): (a: T, b: T) => number {
    return (a: T, b: T) => (fn(a) || '').localeCompare((fn(b) || ''))
}

export function last<T>(array: T[]): T {
    return array[array.length - 1];
}

export function first<T>(array: T[]): T {
    return array[0];
}
