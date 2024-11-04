import { NavigateFunction } from "react-router-dom";
import { Result } from "../types";

export function serviceHandler<T>(
    promise: Promise<Result<T>>,
    navigate: NavigateFunction,
    setterFunction: (data: T) => void,
    cleanerFunction: () => void,
    noContentFunction: () => void
): void {
    promise.then((response: Result<T>) => {
        console.log("serviceHandler:", JSON.stringify(response))
        if (response.hasFailed()) {
            if (isNaN(response.getError().getStatus())) {
                return;
            } else {
                navigate('/error', {
                    state: {
                        code: response.getError().getStatus(),
                        message: response.getError().getMessage(),
                    },
                    replace: true,
                })
            }
        } else {
            if (response.getStatusCode() === 204) {
                noContentFunction();
            } else {
                setterFunction(response.getData());
            }
        }
    })
        .catch((error) => {
            const errorCode = error.message === '401' ? 401 : 500;
            navigate('/error', {
                state: {
                    code: errorCode,
                    message: errorCode === 401 ? 'Unauthorized - Session expired' : 'Server error',
                },
                replace: true,
            });
        })
        .finally(cleanerFunction);
}
