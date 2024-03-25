export interface IEnumModel {
    name: string;
    isNullable: boolean;
    items: { key: string; value: number | string }[];
}
