export function addHttps(url: string): string {
    return `https://` + url.replace(/https?:\/\//g, '');
}

export function removeEndingSlash(url: string): string {
    if (url.endsWith("/")) {
        return url.slice(0, -1);
    }
    return url;
}

export function fixUrl(url: string): string {
    return removeEndingSlash(addHttps(url));
}
