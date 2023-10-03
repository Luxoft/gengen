export class PathBuilder {
    public normalizePath(path: string): string {
        return path
            .split('/')
            .filter((x) => x)
            .join('/');
    }
}
