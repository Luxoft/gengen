import type { TypeOrUndefinedNullable } from './types';
const HOUR_COEFF = 3600000;
const MINUTS_IN_HOUR = 60;

export function toDateOut<T extends TypeOrUndefinedNullable<Date>>(value: T): T extends Date ? string : undefined {
    if (!value) {
        return undefined as never;
    }

    return dateOut(value).toISOString() as never;
}

export function toDateIn<T extends TypeOrUndefinedNullable<string>>(value: T): T extends string ? Date : undefined {
    if (!value) {
        return undefined as never;
    }

    return dateIn(new Date(value)) as never;
}

function dateOut(value: Date): Date {
    const offsetHours = getOffset(value);
    return addHours(value, -offsetHours);
}

function dateIn(value: Date): Date {
    const offsetHours = getOffset(value);
    return addHours(value, offsetHours);
}

function addHours(date: Date, hours: number): Date {
    const time = date.getTime();
    const copy = new Date(time);
    copy.setTime(time + HOUR_COEFF * hours);
    return copy;
}

/**
 * @description We need to calculate offset for current date
 * cause for 2013 offset could be different compare to 2019
 */
function getOffset(date: Date): number {
    return date.getTimezoneOffset() / MINUTS_IN_HOUR;
}
