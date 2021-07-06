declare global {
    interface Window {
        __gengen__basePathMap: Record<string, string>;
    }
}

export function getBasePath(alias: string, relativePath: string): string {
    const basePath = window.__gengen__basePathMap?.[alias];
    if (!basePath) {
        return relativePath;
    }

    return `${basePath}${relativePath}`;
}
