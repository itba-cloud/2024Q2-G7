import { CurrentUserModel } from "../types";

function handleResponseStatus<RetType>(response: Response): Promise<RetType> | null {
    if (response.status === 204) {
        return null;
    }
    if (response.status >= 200 && response.status <= 299) {
        return response.json() as Promise<RetType>;
    } else {
        throw Error(response.status.toString());
    }
}

// Si obtenemos un 401 quiere decir que vencio el token
export function checkValidJWT<RetType>(response: Response): Promise<RetType> | null {
    console.log("checkValidJWT:", JSON.stringify(response))
    if (response.status === 401) {
        localStorage.removeItem('getawayRefreshToken')
        localStorage.removeItem('getawayAccessToken')
        localStorage.removeItem('getawayIdToken')
        //localStorage.removeItem('getawayUser')
        throw Error('401')
        //return handleResponseStatus(response);
    }
    /* if (response) {
        const accessJWTHeader = response.headers ? response.headers.get('Getaway-Access-JWT') : null
        const refreshJWTHeader = response.headers ? response.headers.get('Getaway-Refresh-JWT') : null
        if (accessJWTHeader && refreshJWTHeader) {
            const getawayAccessToken = accessJWTHeader.split(' ')[1]
            const getawayRefreshToken = refreshJWTHeader.split(' ')[1]
            const user = JSON.parse(atob(getawayAccessToken.split('.')[1])) as CurrentUserModel
            localStorage.setItem('getawayAccessToken', getawayAccessToken)
            localStorage.setItem('getawayRefreshToken', getawayRefreshToken)
            localStorage.setItem('getawayUser', JSON.stringify(user))
        }

    } */
    return handleResponseStatus(response);
}
