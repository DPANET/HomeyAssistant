import Joi from '@hapi/joi';
import * as location from '../entities/location';
import * as prayer from '../entities/prayer';
import * as config from '../configurators/inteface.configuration';
import {Validator,ValidatorProviders,IValid} from "./interface.validators";


export class LocationValidator extends Validator<location.ILocationSettings>
{
    private _joiSchema: object;
    private constructor() {
        super(ValidatorProviders.LocationValidator);
        this._joiSchema = Joi.object().keys({
            countryCode: Joi.string().optional().regex(/^[A-Z]{2}$/i).allow(null),
            address: Joi.string().optional().allow(null),
            latitude: Joi.number().min(-90).max(90).optional(),
            longtitude: Joi.number().min(-180).max(180).optional(),
            countryName: Joi.any().optional().allow(null)
        })
        .and('address')
        .and('latitude', 'longtitude')
    }
    public validate(validateObject: location.ILocationSettings): boolean {
        return super.genericValidator(Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true  }));
    }

    public static createValidator(): IValid<location.ILocationSettings> {
        return new LocationValidator();
    }

}

export class PrayerSettingsValidator extends Validator<prayer.IPrayersSettings>
{
    private readonly _merger: any
    private _joiSchema: object;
    _adjustmentsSchema: Joi.ObjectSchema;
    private constructor() {
        super(ValidatorProviders.PrayerSettingsValidator);
        this._adjustmentsSchema = Joi.object().keys({
            prayerName: Joi.string()
                .label('Prayer Name')
                .valid(Object.values(prayer.PrayersName))
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
                    .valid(Object.values(prayer.Methods))
                    .label('Prayer Method')
                    .error(this.processErrorMessage)
            }),
            school: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Prayer School')
                    .valid(Object.values(prayer.Schools))
                    .error(this.processErrorMessage)
            }),
            latitudeAdjustment: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Prayer Latitude')
                    .valid(Object.values(prayer.LatitudeMethod))
                    .error(this.processErrorMessage)
            }),
            midnight: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Prayer Midnight')
                    .valid(Object.values(prayer.MidnightMode))
                    .error(this.processErrorMessage)
            }),
            adjustmentMethod: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Adjustment Method')
                    .valid(Object.values(prayer.AdjsutmentMethod))
                    .error(this.processErrorMessage)
            }),
            adjustments: Joi.array()
                .items(this._adjustmentsSchema)
                .unique()
                .label('Adjustments')
                .error(this.processErrorMessage, { self: true })
        });

    }
    public validate(validateObject: prayer.IPrayersSettings): boolean {
        return super.genericValidator(Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true}) );
    }
    public static createValidator(): IValid<prayer.IPrayersSettings> {
        return new PrayerSettingsValidator();
    }
}
export class PrayerConfigValidator extends Validator<config.IPrayersConfig>
{

    private _configSchema: object;
    private _adjustmentsSchema: object;
    private constructor() {
        super(ValidatorProviders.PrayerConfigValidator);
        this.setSchema();

    }
    private setSchema(): void {
        this._adjustmentsSchema = Joi.object().keys({
            prayerName: Joi.string()
                .label('Prayer Name')
                .valid(Object.values(prayer.PrayersName))
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
                .valid(Object.values(prayer.Methods))
                .label('Prayer Method')
                .required()
                .error(this.processErrorMessage),
            school: Joi.number()
                .required()
                .label('School')
                .valid(Object.values(prayer.Schools))
                .error(this.processErrorMessage),
            latitudeAdjustment: Joi.number()
                .required()
                .label('Latitude Adjustment')
                .valid(Object.values(prayer.LatitudeMethod))
                .error(this.processErrorMessage),
            adjustmentMethod: Joi.number().required()
                .valid(Object.values(prayer.AdjsutmentMethod))
                .label('Adjust Method')
                .error(this.processErrorMessage),
            adjustments: Joi.array()
                .items(this._adjustmentsSchema)
                .unique()
                .label('Adjustments')
                .error(this.processErrorMessage, { self: true })
        }).error(this.processErrorMessage, { self: true })

    }
    public validate(validateObject: config.IPrayersConfig): boolean {
        return super.genericValidator(Joi.validate(validateObject, this._configSchema, { abortEarly: false, allowUnknown: true }));
    }
    public static createValidator(): IValid<config.IPrayersConfig> {
        return new PrayerConfigValidator();
    }
}
export class LocationConfigValidator extends Validator<config.ILocationConfig>
{
    private _configSchema: object;
    private _locationSchema:object
    private _timeZoneSchema: object;
    private constructor() {
        super(ValidatorProviders.PrayerConfigValidator);
        this.setSchema();

    }
    private setSchema(): void {
        this._locationSchema =  Joi.object().keys({
            countryCode: Joi.string()
            .required()
            .regex(/^[A-Z]{2}$/i)
            .label('Country Code')
            .error(this.processErrorMessage)
            ,
            address: Joi.string()
            .required()
            .label('Address')
            .error(this.processErrorMessage),
            latitude: Joi.number()
            .min(-90)
            .max(90)
            .required()
            .label('Latitude')
            .error(this.processErrorMessage),
            longtitude: Joi.number()
            .min(-180)
            .max(180)
            .required()
            .label('Longtitude')
            .error(this.processErrorMessage),
            countryName: Joi.string()
            .required()
            .label('Country Name')
            .error(this.processErrorMessage),
            city:Joi.string()
            .required()
            .label('City')
            .error(this.processErrorMessage)
        })
        .and('address','countryCode')
        .and('latitude', 'longtitude');
        this._timeZoneSchema = Joi.object().keys({
            timeZoneId: Joi
                .string()
                .required()
                .label('Time Zone ID')
                .error(this.processErrorMessage),
                timeZoneName: Joi
                .string()
                .required()
                .label('Time Zone Name')
                .error(this.processErrorMessage),
                dstOffset: Joi
                .number()
                .required()
                .label('DSTOffset')
                .error(this.processErrorMessage),
                rawOffset: Joi.number()
                .required()
                .label('Rawoffset')
                .error(this.processErrorMessage)
        });
        this._configSchema= Joi.object().keys({
            location:this._locationSchema,
            timezone:this._timeZoneSchema
        }).error(this.processErrorMessage, { self: true })
    }
    public validate(validateObject: config.ILocationConfig): boolean {
        return super.genericValidator(Joi.validate(validateObject, this._configSchema, { abortEarly: false, allowUnknown: true }));
    }
    public static createValidator(): IValid<config.ILocationConfig> {
        return new LocationConfigValidator();
    }

}
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
