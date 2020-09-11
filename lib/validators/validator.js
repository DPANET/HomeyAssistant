"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const prayer = __importStar(require("../entities/prayer"));
const interface_validators_1 = require("./interface.validators");
class LocationValidator extends interface_validators_1.Validator {
    constructor() {
        super(interface_validators_1.ValidatorProviders.LocationValidator);
        this._joiSchema = joi_1.default.object().keys({
            countryCode: joi_1.default.string().optional().regex(/^[A-Z]{2}$/i).allow(null),
            address: joi_1.default.string().optional().allow(null),
            latitude: joi_1.default.number().min(-90).max(90).optional(),
            longtitude: joi_1.default.number().min(-180).max(180).optional(),
            countryName: joi_1.default.any().optional().allow(null)
        })
            .and('address')
            .and('latitude', 'longtitude');
    }
    validate(validateObject) {
        return super.genericValidator(this._joiSchema.validate(validateObject, { abortEarly: false, allowUnknown: true }));
    }
    static createValidator() {
        return new LocationValidator();
    }
}
exports.LocationValidator = LocationValidator;
class PrayerSettingsValidator extends interface_validators_1.Validator {
    constructor() {
        super(interface_validators_1.ValidatorProviders.PrayerSettingsValidator);
        this._adjustmentsSchema = joi_1.default.object().keys({
            prayerName: joi_1.default.string()
                .label('Prayer Name')
                .valid(...Object.values(prayer.PrayersName))
                .required()
                .messages(this.customErrorMessage()),
            adjustments: joi_1.default.number()
                .required()
                .label('Adjustments')
                .messages(this.customErrorMessage())
        });
        this._joiSchema = joi_1.default.object().keys({
            startDate: joi_1.default.date()
                .max(joi_1.default.ref('endDate'))
                .required()
                .label('Start Date')
                .messages(this.customErrorMessage()),
            endDate: joi_1.default.date()
                .required()
                .label('End Date')
                .messages(this.customErrorMessage()),
            method: joi_1.default.object().keys({
                id: joi_1.default.number()
                    .required()
                    .valid(...Object.values(prayer.Methods))
                    .label('Prayer Method')
                    .messages(this.customErrorMessage())
            }),
            school: joi_1.default.object().keys({
                id: joi_1.default.number()
                    .required()
                    .label('Prayer School')
                    .valid(...Object.values(prayer.Schools))
                    .messages(this.customErrorMessage())
            }),
            latitudeAdjustment: joi_1.default.object().keys({
                id: joi_1.default.number()
                    .required()
                    .label('Prayer Latitude')
                    .valid(...Object.values(prayer.LatitudeMethod))
                    .messages(this.customErrorMessage())
            }),
            midnight: joi_1.default.object().keys({
                id: joi_1.default.number()
                    .required()
                    .label('Prayer Midnight')
                    .valid(...Object.values(prayer.MidnightMode))
                    .messages(this.customErrorMessage())
            }),
            adjustmentMethod: joi_1.default.object().keys({
                id: joi_1.default.number()
                    .required()
                    .label('Adjustment Method')
                    .valid(...Object.values(prayer.AdjsutmentMethod))
                    .messages(this.customErrorMessage())
            }),
            adjustments: joi_1.default.array()
                .items(this._adjustmentsSchema)
                .unique()
                .label('Adjustments')
                .messages(this.customErrorMessage())
        });
    }
    validate(validateObject) {
        return super.genericValidator(this._joiSchema.validate(validateObject, { abortEarly: false, allowUnknown: true }));
    }
    static createValidator() {
        return new PrayerSettingsValidator();
    }
}
exports.PrayerSettingsValidator = PrayerSettingsValidator;
class PrayerConfigValidator extends interface_validators_1.Validator {
    constructor() {
        super(interface_validators_1.ValidatorProviders.PrayerConfigValidator);
        this.setSchema();
    }
    setSchema() {
        this._adjustmentsSchema = joi_1.default.object().keys({
            prayerName: joi_1.default.string()
                .label('Prayer Name')
                .valid(...Object.values(prayer.PrayersName))
                .required()
                .messages(this.customErrorMessage()),
            adjustments: joi_1.default.number()
                .required()
                .label('Adjustments')
                .messages(this.customErrorMessage())
            // .error((errors) => errors.map((err) => this.processErrorMessage(err)))
        }).required().messages(this.customErrorMessage());
        this._configSchema = joi_1.default.object().keys({
            startDate: joi_1.default
                .date()
                .max(joi_1.default.ref('endDate')) //.error(() => "End Date should be less than Start Date")
                .required()
                .label('Start Date')
                .messages(this.customErrorMessage()),
            endDate: joi_1.default.date()
                .required()
                .label('End Date')
                .messages(this.customErrorMessage()),
            method: joi_1.default
                .number()
                .valid(...Object.values(prayer.Methods))
                .label('Prayer Method')
                .required()
                .messages(this.customErrorMessage()),
            school: joi_1.default.number()
                .required()
                .label('School')
                .valid(...Object.values(prayer.Schools))
                .messages(this.customErrorMessage()),
            latitudeAdjustment: joi_1.default.number()
                .required()
                .label('Latitude Adjustment')
                .valid(...Object.values(prayer.LatitudeMethod))
                .messages(this.customErrorMessage()),
            adjustmentMethod: joi_1.default.number().required()
                .valid(...Object.values(prayer.AdjsutmentMethod))
                .label('Adjust Method')
                .messages(this.customErrorMessage()),
            adjustments: joi_1.default.array()
                .required()
                .items(this._adjustmentsSchema)
                .unique()
                .label('Adjustments')
                .messages(this.customErrorMessage())
        }).required().label('Prayers Config').messages(this.customErrorMessage());
    }
    validate(validateObject) {
        return super.genericValidator(this._configSchema.validate(validateObject, { abortEarly: false, allowUnknown: true }));
    }
    static createValidator() {
        return new PrayerConfigValidator();
    }
}
exports.PrayerConfigValidator = PrayerConfigValidator;
class LocationConfigValidator extends interface_validators_1.Validator {
    constructor() {
        super(interface_validators_1.ValidatorProviders.LocationConfigValidator);
        this.setSchema();
    }
    setSchema() {
        this._locationSchema = joi_1.default.object().keys({
            countryCode: joi_1.default.string()
                .required()
                .regex(/^[A-Z]{2}$/i)
                .label('Country Code')
                .messages(this.customErrorMessage()),
            address: joi_1.default.string()
                .required()
                .label('Address')
                .messages(this.customErrorMessage()),
            latitude: joi_1.default.number()
                .min(-90)
                .max(90)
                .required()
                .label('Latitude')
                .messages(this.customErrorMessage()),
            longtitude: joi_1.default.number()
                .min(-180)
                .max(180)
                .required()
                .label('Longtitude')
                .messages(this.customErrorMessage()),
            countryName: joi_1.default.string()
                .required()
                .label('Country Name')
                .messages(this.customErrorMessage()),
            city: joi_1.default.string()
                .required()
                .label('City')
                .messages(this.customErrorMessage())
        }).required()
            .label('Location')
            .and('address', 'countryCode')
            .and('latitude', 'longtitude');
        this._timeZoneSchema = joi_1.default.object().keys({
            timeZoneId: joi_1.default
                .string()
                .required()
                .label('Time Zone ID')
                .messages(this.customErrorMessage()),
            timeZoneName: joi_1.default
                .string()
                .required()
                .label('Time Zone Name')
                .messages(this.customErrorMessage()),
            dstOffset: joi_1.default
                .number()
                .required()
                .label('DSTOffset')
                .messages(this.customErrorMessage()),
            rawOffset: joi_1.default.number()
                .required()
                .label('Rawoffset')
                .messages(this.customErrorMessage())
        })
            .required()
            .label('Timezone');
        this._configSchema = joi_1.default.object().keys({
            location: this._locationSchema,
            timezone: this._timeZoneSchema
        })
            .required()
            .and("location", "timezone")
            .label('Location Config')
            .messages(this.customErrorMessage());
    }
    validate(validateObject) {
        return super.genericValidator(this._configSchema.validate(validateObject, { abortEarly: false, allowUnknown: true }));
    }
    static createValidator() {
        return new LocationConfigValidator();
    }
}
exports.LocationConfigValidator = LocationConfigValidator;
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
