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
const Joi = require("@hapi/joi");
const prayer = __importStar(require("../entities/prayer"));
const ramda_1 = __importDefault(require("ramda"));
const interface_validators_1 = require("./interface.validators");
class LocationValidator extends interface_validators_1.Validator {
    constructor() {
        super(interface_validators_1.ValidatorProviders.LocationValidator);
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
        return super.genericValidator(Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true }));
    }
    static createValidator() {
        return new LocationValidator();
    }
}
exports.LocationValidator = LocationValidator;
class PrayerSettingsValidator extends interface_validators_1.Validator {
    constructor() {
        super(interface_validators_1.ValidatorProviders.PrayerSettingsValidator);
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
        return super.genericValidator(Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true }));
    }
    static createValidator() {
        return new PrayerSettingsValidator();
    }
}
exports.PrayerSettingsValidator = PrayerSettingsValidator;
class ConfigValidator extends interface_validators_1.Validator {
    constructor() {
        super(interface_validators_1.ValidatorProviders.ConfigValidator);
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
        return super.genericValidator(Joi.validate(validateObject, this._configSchema, { abortEarly: false, allowUnknown: true }));
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