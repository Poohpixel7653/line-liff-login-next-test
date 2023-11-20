export interface IResponse {
    type: string;
    status: number;
    message: string;
    data: any;
    error?: {
        message?: string;
    };
}
