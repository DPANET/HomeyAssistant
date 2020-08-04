import Joi from '@hapi/joi';
import * as location from '../entities/location';
import * as prayer from '../entities/prayer';
import * as config from '../configurators/inteface.configuration';
import {Validator,ValidatorProviders,IValid} from "./interface.validators";


export class LocationValidator extends Validator<location.ILocationSettings>
{
    private _joiSchema: Joi.Schema;
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
        return super.genericValidator(this._joiSchema.validate(validateObject, { abortEarly: false, allowUnknown: true  }));
    }

    public static createValidator(): IValid<location.ILocationSettings> {
        return new LocationValidator();
    }

}

export class PrayerSettingsValidator extends Validator<prayer.IPrayersSettings>
{
    private readonly _merger: any
    private _joiSchema: Joi.Schema;
    _adjustmentsSchema: Joi.ObjectSchema;
    private constructor() {
        super(ValidatorProviders.PrayerSettingsValidator);
        this._adjustmentsSchema = Joi.object().keys({
            prayerName: Joi.string()
                .label('Prayer Name')
                .valid(...Object.values(prayer.PrayersName))
                .required()
               .messages(this.customErrorMessage()),
            adjustments: Joi.number()
                .required()
                .label('Adjustments')
               .messages(this.customErrorMessage())
        });
        this._joiSchema = Joi.object().keys({
            startDate: Joi.date()
                .max(Joi.ref('endDate'))
                .required()
                .label('Start Date')
               .messages(this.customErrorMessage()),
            endDate: Joi.date()
                .required()
                .label('End Date')
                .messages(this.customErrorMessage()),
            method: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .valid(...Object.values(prayer.Methods))
                    .label('Prayer Method')
                   .messages(this.customErrorMessage())
            }),
            school: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Prayer School')
                    .valid(...Object.values(prayer.Schools))
                   .messages(this.customErrorMessage())
            }),
            latitudeAdjustment: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Prayer Latitude')
                    .valid(...Object.values(prayer.LatitudeMethod))
                   .messages(this.customErrorMessage())
            }),
            midnight: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Prayer Midnight')
                    .valid(...Object.values(prayer.MidnightMode))
                   .messages(this.customErrorMessage())
            }),
            adjustmentMethod: Joi.object().keys({
                id: Joi.number()
                    .required()
                    .label('Adjustment Method')
                    .valid(...Object.values(prayer.AdjsutmentMethod))
                   .messages(this.customErrorMessage())
            }),
            adjustments: Joi.array()
                .items(this._adjustmentsSchema)
                .unique()
                .label('Adjustments')
               .messages(this.customErrorMessage())
        });

    }
    public validate(validateObject: prayer.IPrayersSettings): boolean {
        return super.genericValidator(this._joiSchema.validate(validateObject, { abortEarly: false, allowUnknown: true}) );
    }
    public static createValidator(): IValid<prayer.IPrayersSettings> {
        return new PrayerSettingsValidator();
    }
}
export class PrayerConfigValidator extends Validator<config.IPrayersConfig>
{

    private _configSchema: Joi.Schema   ;
    private _adjustmentsSchema: Joi.Schema;
    private constructor() {
        super(ValidatorProviders.PrayerConfigValidator);
        this.setSchema();

    }
    private setSchema(): void {
        this._adjustmentsSchema = Joi.object().keys({
            prayerName: Joi.string()
                .label('Prayer Name')
                .valid(...Object.values(prayer.PrayersName))
                .required()
               .messages(this.customErrorMessage()),
            adjustments: Joi.number()
                .required()
                .label('Adjustments')
               .messages(this.customErrorMessage())
            // .error((errors) => errors.map((err) => this.processErrorMessage(err)))
        }).required().messages(this.customErrorMessage());
        this._configSchema = Joi.object().keys({
            startDate: Joi
                .date()
                .max(Joi.ref('endDate'))//.error(() => "End Date should be less than Start Date")
                .required()
                .label('Start Date')
               .messages(this.customErrorMessage()),
            endDate: Joi.date()
                .required()
                .label('End Date')
               .messages(this.customErrorMessage()),
            method: Joi
                .number()
                .valid(...Object.values(prayer.Methods))
                .label('Prayer Method')
                .required()
               .messages(this.customErrorMessage()),
            school: Joi.number()
                .required()
                .label('School')
                .valid(...Object.values(prayer.Schools))
               .messages(this.customErrorMessage()),
            latitudeAdjustment: Joi.number()
                .required()
                .label('Latitude Adjustment')
                .valid(...Object.values(prayer.LatitudeMethod))
               .messages(this.customErrorMessage()),
            adjustmentMethod: Joi.number().required()
                .valid(...Object.values(prayer.AdjsutmentMethod))
                .label('Adjust Method')
               .messages(this.customErrorMessage()),
            adjustments: Joi.array()
                .required()
                .items(this._adjustmentsSchema)
                .unique()
                .label('Adjustments')
               .messages(this.customErrorMessage())
        }).required().label('Prayers Config').messages(this.customErrorMessage())

    }
    public validate(validateObject: config.IPrayersConfig): boolean {
        return super.genericValidator(this._configSchema.validate(validateObject, { abortEarly: false, allowUnknown: true }));
    }
    public static createValidator(): IValid<config.IPrayersConfig> {
        return new PrayerConfigValidator();
    }
}
export class LocationConfigValidator extends Validator<config.ILocationConfig>
{
    private _configSchema: Joi.Schema;
    private _locationSchema:Joi.Schema
    private _timeZoneSchema: Joi.Schema;
    private constructor() {
        super(ValidatorProviders.LocationConfigValidator);
        this.setSchema();

    }
    private setSchema(): void {
        this._locationSchema =  Joi.object().keys({
            countryCode: Joi.string()
            .required()
            .regex(/^[A-Z]{2}$/i)
            .label('Country Code')
           .messages(this.customErrorMessage())
            ,
            address: Joi.string()
            .required()
            .label('Address')
           .messages(this.customErrorMessage()),
            latitude: Joi.number()
            .min(-90)
            .max(90)
            .required()
            .label('Latitude')
           .messages(this.customErrorMessage()),
            longtitude: Joi.number()
            .min(-180)
            .max(180)
            .required()
            .label('Longtitude')
           .messages(this.customErrorMessage()),
            countryName: Joi.string()
            .required()
            .label('Country Name')
           .messages(this.customErrorMessage()),
            city:Joi.string()
            .required()
            .label('City')
           .messages(this.customErrorMessage())
        }).required()
        .label('Location')
        .and('address','countryCode')
        .and('latitude', 'longtitude');
        this._timeZoneSchema = Joi.object().keys({
            timeZoneId: Joi
                .string()
                .required()
                .label('Time Zone ID')
               .messages(this.customErrorMessage()),
                timeZoneName: Joi
                .string()
                .required()
                .label('Time Zone Name')
               .messages(this.customErrorMessage()),
                dstOffset: Joi
                .number()
                .required()
                .label('DSTOffset')
               .messages(this.customErrorMessage()),
                rawOffset: Joi.number()
                .required()
                .label('Rawoffset')
               .messages(this.customErrorMessage())
        })
        .required()
        .label('Timezone');
        this._configSchema= Joi.object().keys({
            location:this._locationSchema,
            timezone:this._timeZoneSchema
        })
        .required()
        .and("location","timezone")
        .label('Location Config')
        .messages(this.customErrorMessage())
    }
    public validate(validateObject: config.ILocationConfig): boolean {
        return super.genericValidator(this._configSchema.validate(validateObject, { abortEarly: false, allowUnknown: true }));
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
