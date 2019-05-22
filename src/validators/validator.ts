const to = require('await-to-js').default;
import Joi = require('@hapi/joi');
import * as location from '../entities/location';
import { isNullOrUndefined } from 'util';
import * as prayer from '../entities/prayer';
import * as config from '../configurators/inteface.configuration';
import ramda from "ramda";
export namespace validators {
    export type ValidtionTypes = prayer.IPrayersSettings | location.ILocationSettings | config.IPrayersConfig;
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
    export interface IValid<ValidtionTypes> {
        validate(validateObject: ValidtionTypes): Promise<boolean>;
        isValid(): boolean;
        getValidationError(): IValidationError;

    }
    abstract class Validator<ValidtionTypes> implements IValid<ValidtionTypes>
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
        abstract validate(validateObject: ValidtionTypes): Promise<boolean>;
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
        protected async genericValidator(validateFn: Function): Promise<boolean> {
            let result, err, iErr: IValidationError;
            [err, result] = await to(validateFn());
            if (!isNullOrUndefined(err)) {
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
        public async validate(validateObject: location.ILocationSettings): Promise<boolean> {
            return await
                super.genericValidator(() => Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true }));

        }

        public static createValidator(): IValid<location.ILocationSettings> {
            return new LocationValidator();
        }

    }

    export class PrayerSettingsValidator extends Validator<prayer.IPrayersSettings>
    {
        private _joiSchema: object;
        private constructor() {
            super(ValidatorProviders.PrayerSettingsValidator);
            this._joiSchema = Joi.object().keys({
                startDate: Joi.date().max(Joi.ref('endDate')).required().label('Date is required and should be within range'),
                endDate: Joi.date().required().label('Date is required and should be within range'),
                method: Joi.object().required().label('Method is required and should be within value list'),
                school: Joi.object().required().label('School c is required and should be within value list'),
                adjustmentMethod: Joi.object().required()
            });

        }
        public async validate(validateObject: prayer.IPrayersSettings): Promise<boolean> {
            return await
                super.genericValidator(() => Joi.validate(validateObject, this._joiSchema, { abortEarly: false, allowUnknown: true }));
        }
        public static createValidator(): IValid<prayer.IPrayersSettings> {
            return new PrayerSettingsValidator();
        }
    }
    export class ConfigValidator extends Validator<config.IPrayersConfig>
    {
        private processErrorMessage(err: Joi.ValidationErrorItem): any {
            switch (err.type) {
                case "any.allowOnly":
                    err.message = ` ${err.context.label} should be within the acceptable list of values`;
                    break;
                case "any.required":
                    err.message = ` ${err.context.label} is mandatory field`
                    break;
                case "number.base":
                    err.message = `${err.context.label} expects integer`
                    break;
                case "string.base":
                    err.message = `${err.context.label} expects string`
                    break;
                case "array.includesOne":
                    err.message =  `${err.context.label} expects a value not in the list`
                    break;
                default:
                    err.message = `${err.type}: ${err.context.label} ${err.message} with value ${err.context}`
            }
            return err
        }
        private _configSchema: object;
        private _adjustmentsSchema: object;
        private constructor() {
            super(ValidatorProviders.ConfigValidator);
            this._adjustmentsSchema = Joi.object().keys({
                prayerName: Joi.string()
                .label('Prayer Name')
                .valid(ramda.values(prayer.PrayersName))
                .required()
                .error((errors) => errors.map((err) => this.processErrorMessage(err))),
                adjustments: Joi.number()
                .required()
                .label('Adjustments')
                .error((errors) => errors.map((err) => this.processErrorMessage(err)))
            });
            this._configSchema = Joi.object().keys({
                startDate: Joi
                    .date()
                    .max(Joi.ref('endDate')).error(() => "End Date should be less than Start Date")
                    .required()
                    .label('Start Date'),
                endDate: Joi.date()
                    .required()
                    .label('End Date')
                    .error((errors) => errors.map((err) => this.processErrorMessage(err))),
                method: Joi
                    .number()
                    .valid(ramda.values(prayer.Methods))
                    .label('Prayer Method')
                    .required()
                    .error((errors) => errors.map((err) => this.processErrorMessage(err))),
                school: Joi.number()
                    .required()
                    .label('School')
                    .valid(ramda.values(prayer.Schools))
                    .error((errors) => errors.map((err) => this.processErrorMessage(err))),
                latitudeAdjustment: Joi.number()
                    .required()
                    .label('Latitude Adjustment')
                    .valid(ramda.values(prayer.LatitudeMethod))
                    .error((errors) => errors.map((err) => this.processErrorMessage(err))),
                adjustmentMethod: Joi.number().required()
                    .valid(ramda.values(prayer.AdjsutmentMethod))
                    .label('Adjust Method')
                    .error((errors) => errors.map((err) => this.processErrorMessage(err))),
                adjustments: Joi.array()
                    .items(this._adjustmentsSchema)
                    .unique()
                    .label('Adjustments')
                    //.error((errors) => errors.map((err) => this.processErrorMessage(err))),
            })//.requiredKeys();


        }

        public async validate(validateObject: config.IPrayersConfig): Promise<boolean> {
            return await
                super.genericValidator(() => Joi.validate(validateObject, this._configSchema, { abortEarly: false, allowUnknown: true }));
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
}