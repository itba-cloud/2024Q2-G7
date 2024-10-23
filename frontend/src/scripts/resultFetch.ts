import { ErrorResponse, PostResponse, PutResponse, Result } from "../types";
import { authedFetch } from "./authedFetch";
import { checkValidJWT } from "./checkError";

export async function resultFetch<RetType>(
    url: string,
    options: any
): Promise<Result<RetType>> {
    try {
        console.log("result fetch - url:", url);
        const response = await authedFetch(url, options);
        console.log("result fetch - response:", JSON.stringify(response));
        let parsedResponse;
        if (options.method === "POST") {
            parsedResponse = postCheckError(response);
        } else if (options.method === "PUT") {
            parsedResponse = putCheckError(response);
        } else {
            parsedResponse = await checkValidJWT<RetType>(response);
        }
        return Result.ok(parsedResponse as RetType, response.status);
    } catch (err: any) {
        console.log("result fetch - ERROR:", JSON.stringify(err));
        return Result.failed(new ErrorResponse(parseInt(err.message), err.title, err.message));
    }
}

function postCheckError(response: Response): PostResponse {
    if (
        response.status >= 200 &&
        response.status <= 299
    ) {
        return { url: response.headers.get("Location") } as PostResponse;
    } else {
        throw Error(response.status.toString());
    }
}

function putCheckError(response: Response): PutResponse {
    if (
        response.status >= 200 &&
        response.status <= 299
    ) {
        return { statusCode: response.status } as PutResponse;
    } else {
        throw Error(response.status.toString());
    }
}
