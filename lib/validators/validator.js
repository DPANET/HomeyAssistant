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
var ValidatorProviders;
(function (ValidatorProviders) {
    ValidatorProviders["LocationValidator"] = "Validate Location";
    ValidatorProviders["PrayerSettingsValidator"] = "Validate Prayer Settings";
    ValidatorProviders["ConfigValidator"] = "Config Settings Validators";
})(ValidatorProviders = exports.ValidatorProviders || (exports.ValidatorProviders = {}));
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
    processErrorMessage(errors) {
        errors.map((err) => {
            switch (err.type) {
                case "date.base":
                    err.message = `${err.context.label} value is either not a date or could not be cast to a date from a string or a number`;
                    break;
                case "any.empty":
                    err.message = `${err.context.label} key value is empty, value should be within the list`;
                    break;
                case "date.max":
                    err.message = `${err.context.label} should not exceed ${err.context.limit}`;
                    break;
                case "any.allowOnly":
                    err.message = `${err.context.label} should be within the acceptable list of values`;
                    break;
                case "any.required":
                    err.message = `${err.context.label} is mandatory field`;
                    break;
                case "number.base":
                    err.message = `${err.context.label} expects integer`;
                    break;
                case "string.base":
                    err.message = `${err.context.label} expects string`;
                    break;
                case "array.includesOne":
                    err.message = `${err.context.label} expects a value not in the list`;
                    break;
                case "object.child":
                    err.message = `${err.context.label} expects a value not in the list`;
                    break;
                default:
                    err.message = `${err.type}: ${err.context.label} ${err.message} with value ${err.context}`;
            }
        });
        // console.log(errors);
        return errors;
    }
    genericValidator(validateFn) {
        let result, err, iErr;
        err = validateFn().error;
        if (!util_1.isNullOrUndefined(err)) {
            iErr = this.processErrorMessages(err);
            this.setIsValid(false);
            this.setValidatonError(iErr);
            return false;
        }
        else {
            this.setIsValid(true);
            return true;
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
exports.Validator = Validator;
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
    validate(validateObject) {
        return super.genericValidator(() => Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true }));
    }
    static createValidator() {
        return new LocationValidator();
    }
}
exports.LocationValidator = LocationValidator;
class PrayerSettingsValidator extends Validator {
    constructor() {
        super(ValidatorProviders.PrayerSettingsValidator);
        this._adjustmentsSchema = Joi.object().keys({
            prayerName: Joi.string()
                .label('Prayer Name')
                .valid(ramda_1.default.values(prayer.PrayersName))
                .required()
                .error(this.processErrorMessage),
            adjustments: Joi.number()
                .required()
                .label('Adjustments')
                .error(this.processErrorMessage)
        });
        this._joiSchema = Joi.object().keys({
            startDate: Joi.date()
                .max(Joi.ref('endDate'))
                .required()
                .label('Start Date')
                .error(this.processErrorMessage),
            endDate: Joi.date()
                .required()
                .label('End Date')
                .error(this.processErrorMessage),
            method: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .valid(ramda_1.default.values(prayer.Methods))
                    .label('Prayer Method')
                    .error(this.processErrorMessage)
            }),
            school: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Prayer School')
                    .valid(ramda_1.default.values(prayer.Schools))
                    .error(this.processErrorMessage)
            }),
            latitudeAdjustment: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Prayer Latitude')
                    .valid(ramda_1.default.values(prayer.LatitudeMethod))
                    .error(this.processErrorMessage)
            }),
            midnight: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Prayer Midnight')
                    .valid(ramda_1.default.values(prayer.MidnightMode))
                    .error(this.processErrorMessage)
            }),
            adjustmentMethod: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Adjustment Method')
                    .valid(ramda_1.default.values(prayer.AdjsutmentMethod))
                    .error(this.processErrorMessage)
            }),
            adjustments: Joi.array()
                .items(this._adjustmentsSchema)
                .unique()
                .label('Adjustments')
                .error(this.processErrorMessage, { self: true })
        });
    }
    validate(validateObject) {
        return super.genericValidator(() => Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true }));
    }
    static createValidator() {
        return new PrayerSettingsValidator();
    }
}
exports.PrayerSettingsValidator = PrayerSettingsValidator;
class ConfigValidator extends Validator {
    constructor() {
        super(ValidatorProviders.ConfigValidator);
        this.setSchema();
    }
    setSchema() {
        this._adjustmentsSchema = Joi.object().keys({
            prayerName: Joi.string()
                .label('Prayer Name')
                .valid(ramda_1.default.values(prayer.PrayersName))
                .required()
                .error(this.processErrorMessage),
            adjustments: Joi.number()
                .required()
                .label('Adjustments')
                .error(this.processErrorMessage)
            // .error((errors) => errors.map((err) => this.processErrorMessage(err)))
        });
        this._configSchema = Joi.object().keys({
            startDate: Joi
                .date()
                .max(Joi.ref('endDate')).error(() => "End Date should be less than Start Date")
                .required()
                .label('Start Date')
                .error(this.processErrorMessage),
            endDate: Joi.date()
                .required()
                .label('End Date')
                .error(this.processErrorMessage),
            method: Joi
                .number()
                .valid(ramda_1.default.values(prayer.Methods))
                .label('Prayer Method')
                .required()
                .error(this.processErrorMessage),
            school: Joi.number()
                .required()
                .label('School')
                .valid(ramda_1.default.values(prayer.Schools))
                .error(this.processErrorMessage),
            latitudeAdjustment: Joi.number()
                .required()
                .label('Latitude Adjustment')
                .valid(ramda_1.default.values(prayer.LatitudeMethod))
                .error(this.processErrorMessage),
            adjustmentMethod: Joi.number().required()
                .valid(ramda_1.default.values(prayer.AdjsutmentMethod))
                .label('Adjust Method')
                .error(this.processErrorMessage),
            adjustments: Joi.array()
                .items(this._adjustmentsSchema)
                .unique()
                .label('Adjustments')
                .error(this.processErrorMessage, { self: true })
        }).error(this.processErrorMessage, { self: true });
    }
    validate(validateObject) {
        return super.genericValidator(() => Joi.validate(validateObject, this._configSchema, { abortEarly: false, allowUnknown: true }));
    }
    static createValidator() {
        return new ConfigValidator();
    }
}
exports.ConfigValidator = ConfigValidator;
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
//# sourceMappingURL=validator.js.map