import { TYPES_NAMESPACE } from './consts';

export function typeOrUndefined(type: string): string {
    return `${TYPES_NAMESPACE}.TypeOrUndefined<${type}>`;
}

export function publicFields(type: string): string {
    return `${TYPES_NAMESPACE}.PublicFields<${type}>`;
}
