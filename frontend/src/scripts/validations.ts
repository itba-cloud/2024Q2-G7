export function checkUrl(url: string | undefined): string | undefined {
    if (url && url.length !== 0 && !url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }
    return url;
}

export function validatePage(
    maxPage: number,
    pageToShow: number,
    currentPage: number,
): boolean {
    return (maxPage === 0 && (pageToShow <= 1 || pageToShow > maxPage))
    ||
    ((pageToShow >= 1 && pageToShow <= maxPage) && (currentPage >= 0 && currentPage <= maxPage))
}