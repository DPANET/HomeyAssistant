"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
const Joi = require("joi");
class ValidationError {
    constructor(err, message, value, objectName) {
        this._err = err;
        this._message = message;
        this._value = value;
        this._objectName = objectName;
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
    get objectName() {
        return this._objectName;
    }
    set objectName(value) {
        this._objectName = value;
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
        this._valdationErrors = new Array();
        this._isValid = false;
    }
    getIsValid() {
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
    getValdationErrors() {
        return this._valdationErrors;
    }
    setValidatonErrors(errors) {
        this._valdationErrors.push(errors);
        return this._valdationErrors;
    }
}
exports.Validator = Validator;
class LocationValidator extends Validator {
    constructor() {
        super('Location Validator');
        this._joiSchema = Joi.object().keys({
            countryCode: Joi.string().allow("")
        });
    }
    async validate(validateObject) {
        let result, err;
        [err, result] = to(await Joi.validate(validateObject, this._joiSchema));
        if (!err && result.error) {
            this.setIsValid(false);
            // return this.setValidatonErrors(new ValidationError(result.error,result.error.message,""));
            return;
        }
    }
}
exports.LocationValidator = LocationValidator;
