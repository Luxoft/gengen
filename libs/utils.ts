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
    const queryParametersSeparator = '&';

    if (!url || !url.includes(querySeparator)) {
        return url;
    }

    const splitedUrl = url.split(querySeparator);

    const path = splitedUrl[0];
    const query = splitedUrl[1];

    const prunedQuery = query
        .split(queryParametersSeparator)
        .filter((x) => !x.trimEnd().endsWith('='))
        .join(queryParametersSeparator)
        .slice(0);

    return prunedQuery.length ? `${path}${querySeparator}${prunedQuery}` : path;
}
