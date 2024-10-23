export default class ErrorResponse {
    private readonly status: number;
    private readonly title: string;
    private readonly message: string;

    public constructor(status: number, title: string, message: string) {
        this.status = status;
        this.title = title;
        this.message = message;
    }

    public getStatus(): number {
        return this.status;
    }

    public getTitle(): string {
        return this.title;
    }

    public getMessage(): string {
        return this.message;
    }
}