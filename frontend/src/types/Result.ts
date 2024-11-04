import ErrorResponse from "./ErrorResponse";

export default class Result<T> {
    private readonly data: T;
    private readonly error: ErrorResponse;
    private readonly failed: boolean;
    private readonly statusCode: number;

    private constructor(data: T, failed: boolean, error: ErrorResponse, statusCode: number) {
        this.data = data;
        this.failed = failed;
        this.error = error;
        this.statusCode = statusCode
    }

    public getData(): T {
        return this.data;
    }

    public getError(): ErrorResponse {
        return this.error;
    }

    public static ok<T>(data: T, status: number) {
        return new Result<T>(data, false, null as any, status);
    }

    public static failed(error: ErrorResponse) {
        return new Result(null as any, true, error, error.getStatus());
    }

    public hasFailed(): boolean {
        return this.failed;
    }

    public getStatusCode(): number {
        return this.statusCode;
    }
}