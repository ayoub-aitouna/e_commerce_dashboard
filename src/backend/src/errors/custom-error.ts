interface ErrorAttr {
    message: string;
    statusCode: number;
}
class CustomAPIError extends Error implements ErrorAttr {
    message!: string;
    statusCode!: number;

    constructor(message: string) {
        super(message);
    }
}

export { CustomAPIError };

