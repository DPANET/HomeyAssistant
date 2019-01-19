"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
const Joi = require("joi");
var ValidatorProviders;
(function (ValidatorProviders) {
    ValidatorProviders["LocationValidator"] = "Validate Location";
})(ValidatorProviders = exports.ValidatorProviders || (exports.ValidatorProviders = {}));
class ValidationError {
    constructor(err) {
        this._err = err;
        this._name = err.name;
        this._message = err.message;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get err() {
        return this._err;
    }
    set err(value) {
        this._err = value;
    }
    get message() {
        return this._message;
    }
    set message(value) {
        this._message = value;
    }
    get details() {
        return this._details;
    }
    set details(value) {
        this._details = value;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
}
class Validator {
    constructor(validatorName) {
        this._validatorName = validatorName;
        this._isValid = false;
    }
    isValid() {
        return this._isValid;
    }
    setIsValid(state) {
        this._isValid = state;
    }
    get validatorName() {
        return this._validatorName;
    }
    set validatorName(value) {
        this._validatorName = value;
    }
    getValidationError() {
        if (!this.isValid())
            return this._valdationErrors;
        else
            return null;
    }
    setValidatonError(error) {
        this._valdationErrors = error;
    }
}
class LocationValidator extends Validator {
    constructor() {
        super(ValidatorProviders.LocationValidator);
        this._joiSchema = Joi.object().keys({
            countryCode: Joi.string().regex(/^[A-Z]{2}$/i),
            address: Joi.string(),
            latitude: Joi.number().min(-90).max(90),
            longtitude: Joi.number().min(-180).max(180),
            countryName: Joi.any()
        })
            .with('address', 'countryCode')
            .with('latitude', 'longtitude');
    }
    async validate(validateObject) {
        let result, err, iErr;
        [err, result] = to(await Joi.validate(validateObject, this._joiSchema));
        if (err) {
            iErr = this.processErrorMessages(err);
            this.setIsValid(false);
            this.setValidatonError(iErr);
            Promise.reject(iErr);
        }
        else {
            this.setIsValid(true);
            return Promise.resolve(true);
        }
    }
    processErrorMessages(err) {
        let validationError = new ValidationError(err);
        let details = new Array();
        validationError.value = err._object;
        err.details.forEach(element => {
            details.push({ message: element.message, objectName: element.type, value: element.context });
        });
        validationError.details = details;
        return validationError;
    }
}
class ValidatorProviderFactory {
    static createValidateProvider(validatorProviderName) {
        switch (validatorProviderName) {
            case ValidatorProviders.LocationValidator:
                let validation = new LocationValidator();
                return validation;
        }
    }
}
exports.ValidatorProviderFactory = ValidatorProviderFactory;
