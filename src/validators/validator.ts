const to = require('await-to-js').default;
import Joi = require('@hapi/joi');
import * as location from '../entities/location';
import { isNullOrUndefined } from 'util';
import * as prayer from '../entities/prayer';
import * as config from '../configurators/inteface.configuration';
import ramda from "ramda";

    export type ValidtionTypes = prayer.IPrayersSettings | location.ILocationSettings | config.IPrayersConfig |any;
    
    export enum ValidatorProviders {
        LocationValidator = "Validate Location",
        PrayerSettingsValidator = "Validate Prayer Settings",
        ConfigValidator = "Config Settings Validators"
    };
    interface IError {
        message: string,
        objectName: string,
        value: object

    };
    export interface IValidationError extends Error {
        err: Error,
        details: Array<IError>
        value: object
    }

    class ValidationError implements IValidationError {

        constructor(err: Error) {
            this._err = err;
            this._name = err.name;
            this._message = err.message;

        }
        private _name: string;
        public get name(): string {
            return this._name;
        }
        public set name(value: string) {
            this._name = value;
        }
        private _err: Error;
        public get err(): Error {
            return this._err;
        }
        public set err(value: Error) {
            this._err = value;
        }
        private _message: string;
        public get message(): string {
            return this._message
        }
        public set message(value: string) {
            this._message = value;
        }

        private _details: Array<IError>;
        public get details(): Array<IError> {
            return this._details;
        }
        public set details(value: Array<IError>) {
            this._details = value;
        }
        private _value: object;
        public get value(): object {
            return this._value;
        }
        public set value(value: object) {
            this._value = value;
        }

    }
    export interface IValid< T extends ValidtionTypes> {
        validate(validateObject: T): boolean;
        isValid(): boolean;
        getValidationError(): IValidationError;

    }
   export abstract class Validator<T> implements IValid<T>
    {

        private _validatorName: string;
        private _valdationErrors: IValidationError;
        private _isValid: boolean;
        constructor(validatorName: string) {
            this._validatorName = validatorName;
            this._isValid = false;
        }
        public isValid(): boolean {
            return this._isValid;
        }
        protected setIsValid(state: boolean) {
            this._isValid = state;
        }
        abstract validate(validateObject: T): boolean;
        //   abstract  createValidator(): IValid<ValidtionTypes>;
        public get validatorName(): string {
            return this._validatorName;
        }
        public set validatorName(value: string) {
            this._validatorName = value;
        }
        public getValidationError(): IValidationError {
            if (!this.isValid())
                return this._valdationErrors;
            else return null;
        }
        protected setValidatonError(error: IValidationError) {
            this._valdationErrors = error;

        }
        protected processErrorMessage(errors: any): Joi.ValidationErrorItem[] {
            errors.map((err: any) => {
                switch (err.type) {
                    case "date.base":
                        err.message = `${err.context.label} value is either not a date or could not be cast to a date from a string or a number`
                        break;
                    case "any.empty":
                        err.message = `${err.context.label} key value is empty, value should be within the list`
                        break;
                    case "date.max":
                        err.message = `${err.context.label} should not exceed ${err.context.limit}`
                        break;
                    case "any.allowOnly":
                        err.message = `${err.context.label} should be within the acceptable list of values`;
                        break;
                    case "any.required":
                        err.message = `${err.context.label} is mandatory field`
                        break;
                    case "number.base":
                        err.message = `${err.context.label} expects integer`
                        break;
                    case "string.base":
                        err.message = `${err.context.label} expects string`
                        break;
                    case "array.includesOne":
                        err.message = `${err.context.label} expects a value not in the list`
                        break;
                    case "object.child":
                        err.message = `${err.context.label} expects a value not in the list`
                        break;
                    default:
                        err.message = `${err.type}: ${err.context.label} ${err.message} with value ${err.context}`
                }

            });
            // console.log(errors);
            return errors;
        }
        protected  genericValidator(validateFn: Function): boolean {
            let result, err, iErr: IValidationError;
            err= validateFn().error;
            if (!isNullOrUndefined(err)) {
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
        private processErrorMessages(err: Joi.ValidationError): IValidationError {
            let validationError: IValidationError = new ValidationError(err);
            let details = new Array<IError>();
            validationError.value = err._object;
            err.details.forEach(element => {
                details.push({ message: element.message, objectName: element.type, value: element.context });
            });
            validationError.details = details;
            return validationError;
        }
    }

    export class LocationValidator extends Validator<location.ILocationSettings>
    {
        private _joiSchema: object;
        private constructor() {
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
        public  validate(validateObject: location.ILocationSettings): boolean {
            return super.genericValidator(() => Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true }));

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
                    .valid(ramda.values(prayer.PrayersName))
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
                        .valid(ramda.values(prayer.Methods))
                        .label('Prayer Method')
                        .error(this.processErrorMessage)
                }),
                school: Joi.object().keys({
                    id: Joi.number()
                        .required()
                        .label('Prayer School')
                        .valid(ramda.values(prayer.Schools))
                        .error(this.processErrorMessage)
                }),
                latitudeAdjustment: Joi.object().keys({
                    id: Joi.number()
                        .required()
                        .label('Prayer Latitude')
                        .valid(ramda.values(prayer.LatitudeMethod))
                        .error(this.processErrorMessage)
                }),
                midnight: Joi.object().keys({
                    id: Joi.number()
                        .required()
                        .label('Prayer Midnight')
                        .valid(ramda.values(prayer.MidnightMode))
                        .error(this.processErrorMessage)
                }),
                adjustmentMethod: Joi.object().keys({
                    id: Joi.number()
                        .required()
                        .label('Adjustment Method')
                        .valid(ramda.values(prayer.AdjsutmentMethod))
                        .error(this.processErrorMessage)
                }),
                adjustments: Joi.array()
                .items(this._adjustmentsSchema)
                .unique()
                .label('Adjustments')
                .error(this.processErrorMessage, { self: true })
            });

        }
        public  validate(validateObject: prayer.IPrayersSettings):boolean {
            return  super.genericValidator(() => Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true }));
        }
        public static createValidator(): IValid<prayer.IPrayersSettings> {
            return new PrayerSettingsValidator();
        }
    }
    export class ConfigValidator extends Validator<config.IPrayersConfig>
    {

        private _configSchema: object;
        private _adjustmentsSchema: object;
        private constructor() {
            super(ValidatorProviders.ConfigValidator);
            this.setSchema();

        }
        private setSchema(): void {
            this._adjustmentsSchema = Joi.object().keys({
                prayerName: Joi.string()
                    .label('Prayer Name')
                    .valid(ramda.values(prayer.PrayersName))
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
                    .valid(ramda.values(prayer.Methods))
                    .label('Prayer Method')
                    .required()
                    .error(this.processErrorMessage),
                school: Joi.number()
                    .required()
                    .label('School')
                    .valid(ramda.values(prayer.Schools))
                    .error(this.processErrorMessage),
                latitudeAdjustment: Joi.number()
                    .required()
                    .label('Latitude Adjustment')
                    .valid(ramda.values(prayer.LatitudeMethod))
                    .error(this.processErrorMessage),
                adjustmentMethod: Joi.number().required()
                    .valid(ramda.values(prayer.AdjsutmentMethod))
                    .label('Adjust Method')
                    .error(this.processErrorMessage),
                adjustments: Joi.array()
                    .items(this._adjustmentsSchema)
                    .unique()
                    .label('Adjustments')
                    .error(this.processErrorMessage, { self: true })
            }).error(this.processErrorMessage, { self: true })

        }
        public  validate(validateObject: config.IPrayersConfig): boolean {
            return  super.genericValidator(() => Joi.validate(validateObject, this._configSchema, { abortEarly: false, allowUnknown: true }));
        }
        public static createValidator(): IValid<config.IPrayersConfig> {
            return new ConfigValidator();
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
