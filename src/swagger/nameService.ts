export class NameService {
    public getInterfaceName(name: string): string {
        return `I${name}`;
    }

    public getUnionName(name: string): string {
        return `${name}Union`;
    }

    public getUnionTypesName(name: string): string {
        return `${name}UnionTypes`;
    }

    public getClassName(name: string): string {
        return `${name}Class`;
    }
}
