declare class ApiError extends Error {
    statusCode: number;
    errors: any;
    data: any;
    success: boolean;
    constructor(statusCode: number, message?: string, errors?: any, stack?: string);
}
export default ApiError;
//# sourceMappingURL=ApiError.d.ts.map