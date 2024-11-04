// import * as jwt from 'jsonwebtoken';

function isTokenExpired(token: string): boolean {
    //TODO check
    // const payload: any = jwt.verify(token.split(".")[1], 'pf-2024a-super-secret-key');
    const payload: any = JSON.parse(atob(token.split(".")[1]))
    return payload.exp * 1000 < new Date().getTime()
}

function updateOptions(options: any) {
    let newOptions = { ...options };
    newOptions.headers = { ...options.headers };
    const getawayIdToken = localStorage.getItem("getawayIdToken");
    const getawayAccessToken = localStorage.getItem("getawayAccessToken");
    const getawayRefreshToken = localStorage.getItem("getawayRefreshToken");
    //TODO ver aca que pasa si me vence el access
    //if (getawayAccessToken && !isTokenExpired(getawayAccessToken)) {
    if (getawayIdToken && !isTokenExpired(getawayIdToken)) {
        newOptions.headers["Authorization"] = `Bearer ${getawayIdToken}`
    } else if (getawayRefreshToken) {
        newOptions.headers["Authorization"] = `Bearer ${getawayRefreshToken}`
    }
    return newOptions;
}

export function authedFetch(url: string, options: any) {
    return fetch(url, updateOptions(options));
}