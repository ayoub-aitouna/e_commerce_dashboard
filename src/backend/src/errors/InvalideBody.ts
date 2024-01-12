import { CustomError } from "./custom-error";

class InvalideBody extends CustomError {
    private static readonly _statusCode = 400;
    private readonly _code: number;
    private readonly _logging: boolean;
    private readonly _context: { [key: string]: any };

    constructor() {

        super("Invalid Body Values");
        this._code = 400;
        this._logging = false;
        this._context = {};

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, InvalideBody.prototype);
    }

    get errors() {
        return { message: this.message, context: this._context };
    }

    get statusCode() {
        return this._code;
    }

    get logging() {
        return this._logging;
    }
}

export { InvalideBody };
