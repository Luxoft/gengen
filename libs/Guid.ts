import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import type { TypeOrUndefined } from './types';

export class Guid {
    public static empty = new Guid('00000000-0000-0000-0000-000000000000');

    private id!: string;

    constructor(value: TypeOrUndefined<Guid | string>) {
        if (!value) {
            return Guid.empty;
        }

        if (value instanceof Guid) {
            return new Guid(value.toString());
        }

        this.checkFormat(value);
        this.id = value.toLowerCase();
    }

    public static new(): Guid {
        function gen(): string {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return new Guid(`${gen()}${gen()}-${gen()}-${gen()}-${gen()}-${gen()}${gen()}${gen()}`);
    }

    public static isGuid(value: string): boolean {
        if (!value) {
            return false;
        }

        try {
            new Guid(value);
            return true;
        } catch {
            return false;
        }
    }

    public toString(): string {
        return this.id;
    }

    public isEmpty(): boolean {
        return this.id === Guid.empty.toString();
    }

    public equals(value: string | Guid): boolean {
        if (!value) {
            return false;
        }

        const valueToCompare = typeof value === 'string' ? value.toLowerCase() : value.toString();
        return this.id === valueToCompare;
    }

    private checkFormat(value: string): void {
        const format = new RegExp('^([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})$', 'i');

        if (!format.test(value)) {
            throw new Error(`Incorrect guid format. Raw value '${value}'`);
        }
    }
}

export function mapGuid(): OperatorFunction<string, Guid> {
    return map((z: string) => (z ? new Guid(z) : Guid.empty));
}
