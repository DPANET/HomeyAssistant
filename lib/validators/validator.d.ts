import Joi = require('@hapi/joi');
import * as location from '../entities/location';
import * as prayer from '../entities/prayer';
import * as config from '../configurators/inteface.configuration';
export declare type ValidtionTypes = prayer.IPrayersSettings | location.ILocationSettings | config.IPrayersConfig | any;
export declare enum ValidatorProviders {
    LocationValidator = "Validate Location",
    PrayerSettingsValidator = "Validate Prayer Settings",
    ConfigValidator = "Config Settings Validators"
}
interface IError {
    message: string;
    objectName: string;
    value: object;
}
export interface IValidationError extends Error {
    err: Error;
    details: Array<IError>;
    value: object;
}
export interface IValid<T extends ValidtionTypes> {
    validate(validateObject: T): boolean;
    isValid(): boolean;
    getValidationError(): IValidationError;
}
export declare abstract class Validator<T> implements IValid<T> {
    private _validatorName;
    private _valdationErrors;
    private _isValid;
    constructor(validatorName: string);
    isValid(): boolean;
    protected setIsValid(state: boolean): void;
    abstract validate(validateObject: T): boolean;
    validatorName: string;
    getValidationError(): IValidationError;
    protected setValidatonError(error: IValidationError): void;
    protected processErrorMessage(errors: any): Joi.ValidationErrorItem[];
    protected genericValidator(validateFn: Function): boolean;
    private processErrorMessages;
}
export declare class LocationValidator extends Validator<location.ILocationSettings> {
    private _joiSchema;
    private constructor();
    validate(validateObject: location.ILocationSettings): boolean;
    static createValidator(): IValid<location.ILocationSettings>;
}
export declare class PrayerSettingsValidator extends Validator<prayer.IPrayersSettings> {
    private readonly _merger;
    private _joiSchema;
    _adjustmentsSchema: Joi.ObjectSchema;
    private constructor();
    validate(validateObject: prayer.IPrayersSettings): boolean;
    static createValidator(): IValid<prayer.IPrayersSettings>;
}
export declare class ConfigValidator extends Validator<config.IPrayersConfig> {
    private _configSchema;
    private _adjustmentsSchema;
    private constructor();
    private setSchema;
    validate(validateObject: config.IPrayersConfig): boolean;
    static createValidator(): IValid<config.IPrayersConfig>;
}
export {};
