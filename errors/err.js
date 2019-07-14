module.exports = class ResponseError {
    static _error() {
        return {
            "error": {
                "message": "",
                "type": "",
                "code": 0,
                "error_user_title": "",
                "error_user_msg": "",
            }
        };
    }


    static getAuth(msg, code) {
        const error = this._error();
        error.error.message = msg;
        error.error.type = "Authentication";
        error.error.code = code;
        error.error.error_user_title = "Authentication Failed";
        error.error.error_user_msg = "Please login and try again.";
        return error;
    }

    static getBadRequest(msg, type, user_msg) {
        const error = this._error();
        error.error.message = msg;
        error.error.type = type;
        error.error.code = 400;
        error.error.error_user_title = "Request Failed";
        error.error.error_user_msg = user_msg;
        return error;
    }

    static getNotFound(msg) {
        const error = this._error();
        error.error.message = msg;
        error.error.type = "NotFound";
        error.error.code = 404;
        error.error.error_user_title = "Request Failed";
        error.error.error_user_msg = msg;
        return error;

    }

};