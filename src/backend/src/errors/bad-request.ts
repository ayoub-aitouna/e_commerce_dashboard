import { CustomAPIError } from "./custom-error";

import { StatusCodes } from "http-status-codes";

class BadRequest extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export { BadRequest };
