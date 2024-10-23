import { ErrorResponse, PagedContent, Result } from "../types";
import { authedFetch } from "./authedFetch";
import { checkValidJWT } from "./checkError";

export async function getPagedFetch<RetType>(
    url: string,
    page?: number,
): Promise<Result<PagedContent<RetType>>> {
    let urlPaged = new URL(url);
    if (page) {
        urlPaged.searchParams.append("page", page.toString());
    }
    try {
        const response = await authedFetch(urlPaged.toString(), {
            method: "GET",
        });
        const parsedResponse = await checkValidJWT<RetType>(response);
        const maxPage = response.headers.get("X-Total-Pages");
        if (parsedResponse === null) {
            return Result.ok(new PagedContent([] as RetType, 1), 204)
        } else {
            return Result.ok(
                new PagedContent(parsedResponse, maxPage ? parseInt(maxPage) : 1), response.status
            );
        }

    } catch (err: any) {
        return Result.failed(new ErrorResponse(parseInt(err.message), err.title, err.message));
    }
}
