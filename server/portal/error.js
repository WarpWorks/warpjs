function rethrow(ErrorClass, message, originalError) {
    throw new ErrorClass(message, originalError);
}

class I3CError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = `I3CPortal.${this.constructor.name}`;
        this.originalError = originalError;
    }
}

I3CError.rethrow = rethrow;

module.exports = I3CError;
