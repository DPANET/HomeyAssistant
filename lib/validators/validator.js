"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const to = require('await-to-js').default;
const Joi = require("@hapi/joi");
const util_1 = require("util");
const prayer = __importStar(require("../entities/prayer"));
const ramda_1 = __importDefault(require("ramda"));
var validators;
(function (validators) {
    let ValidatorProviders;
    (function (ValidatorProviders) {
        ValidatorProviders["LocationValidator"] = "Validate Location";
        ValidatorProviders["PrayerSettingsValidator"] = "Validate Prayer Settings";
        ValidatorProviders["ConfigValidator"] = "Config Settings Validators";
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
        async genericValidator(validateFn) {
            let result, err, iErr;
            [err, result] = await to(validateFn());
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
            return await super.genericValidator(() => Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true }));
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
                startDate: Joi.date().max(Joi.ref('endDate')).required(),
                endDate: Joi.date().required(),
                method: Joi.object().required(),
                school: Joi.object().required(),
                adjustmentMethod: Joi.object().required()
            });
        }
        async validate(validateObject) {
            return await super.genericValidator(() => Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true }));
        }
        static createValidator() {
            return new PrayerSettingsValidator();
        }
    }
    validators.PrayerSettingsValidator = PrayerSettingsValidator;
    class ConfigValidator extends Validator {
        constructor() {
            super(ValidatorProviders.ConfigValidator);
            this._adjustmentsSchema = Joi.object().keys({
                prayerName: Joi.string().valid(ramda_1.default.values(prayer.PrayersName)),
                adjustments: Joi.number().required()
            });
            this._configSchema = Joi.object().keys({
                startDate: Joi.date().max(Joi.ref('endDate')).required(),
                endDate: Joi.date().required(),
                method: Joi.number().required().valid(ramda_1.default.values(prayer.Methods)),
                school: Joi.number().required().valid(ramda_1.default.values(prayer.Schools)),
                latitudeAdjustment: Joi.number().required().valid(ramda_1.default.values(prayer.LatitudeMethod)),
                adjustmentMethod: Joi.number().required().valid(ramda_1.default.values(prayer.AdjsutmentMethod)),
                adjustments: Joi.array().items(this._adjustmentsSchema)
            });
        }
        async validate(validateObject) {
            return await super.genericValidator(() => Joi.validate(validateObject, this._configSchema, { abortEarly: false, allowUnknown: true }));
        }
        static createValidator() {
            return new ConfigValidator();
        }
    }
    validators.ConfigValidator = ConfigValidator;
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
//# sourceMappingURL=validator.js.map