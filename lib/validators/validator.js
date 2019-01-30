"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
const Joi = require("joi");
const util_1 = require("util");
var validators;
(function (validators) {
    let ValidatorProviders;
    (function (ValidatorProviders) {
        ValidatorProviders["LocationValidator"] = "Validate Location";
        ValidatorProviders["PrayerSettingsValidator"] = "Validate Prayer Settings";
    })(ValidatorProviders = validators.ValidatorProviders || (validators.ValidatorProviders = {}));
    ;
    ;
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
        //   abstract  createValidator(): IValid<ValidtionTypes>;
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
                .and('address', 'countryCode')
                .and('latitude', 'longtitude');
        }
        async validate(validateObject) {
            let result, err, iErr;
            [err, result] = await to(Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true }));
            if (!util_1.isNullOrUndefined(err)) {
                iErr = this.processErrorMessages(err);
                this.setIsValid(false);
                this.setValidatonError(iErr);
                return Promise.reject(iErr);
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
        static createValidator() {
            return new LocationValidator();
        }
    }
    validators.LocationValidator = LocationValidator;
    class PrayerSettingsValidator extends Validator {
        constructor() {
            super(ValidatorProviders.PrayerSettingsValidator);
            this._joiSchema = Joi.object().keys({
                startDate: Joi.date().less(Joi.ref('endDate')).required(),
                endDate: Joi.string().required(),
                method: Joi.object().required()
            });
        }
        validate(validateObject) {
            throw new Error("Method not implemented.");
        }
        static createValidator() {
            return new PrayerSettingsValidator();
        }
    }
    validators.PrayerSettingsValidator = PrayerSettingsValidator;
    // export class ValidatorProviderFactory {
    //     static createValidateProvider(validatorProviderName: ValidatorProviders): IValid<ValidtionTypes> {
    //         switch (validatorProviderName) {
    //             case ValidatorProviders.LocationValidator:
    //             return new LocationValidator();
    //                 break;
    //             case ValidatorProviders.PrayerSettingsValidator:
    //             return new PrayerSettingsValidator();
    //             break;
    //         }
    //     }
    // }
})(validators = exports.validators || (exports.validators = {}));