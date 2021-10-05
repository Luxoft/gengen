import { TYPES_NAMESPACE } from './consts';

export function typeOrUndefined(type: string): string {
    return `${TYPES_NAMESPACE}.TypeOrUndefined<${type}>`;
}
