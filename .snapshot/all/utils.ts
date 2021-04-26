declare global {
    interface Window {
        __gengen__basePathMap: Record<string, string>;
    }
}

export function getBasePath(alias: string | undefined, relativePath: string): string {
    if (!alias) {
        return relativePath;
    }
    const basePath = window?.__gengen__basePathMap?.[alias];
    if (!basePath) {
        return relativePath;
    }

    return `${basePath}${relativePath}`;
}
