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

export function pruneEmptyQueryParams(url: string): string {
    const querySeparator = '?';
    const queryParamsSeparator = '&';

    if (!url || !url.includes(querySeparator)) {
        return url;
    }

    const [path, query] = url.split(querySeparator);

    const prunedQuery = query
        .split(queryParamsSeparator)
        .filter((x) => !x.trimEnd().endsWith('='))
        .join(queryParamsSeparator)
        .slice(0);

    return prunedQuery.length ? `${path}${querySeparator}${prunedQuery}` : path;
}
