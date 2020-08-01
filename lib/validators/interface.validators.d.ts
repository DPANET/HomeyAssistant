/// <reference types="hapi__joi" />
import Joi from '@hapi/joi';
export declare type ValidtionTypes = any;
export declare enum ValidatorProviders {
    LocationValidator = "Validate Location",
    PrayerSettingsValidator = "Validate Prayer Settings",
    PrayerConfigValidator = "Prayer Config Settings Validators",
    LocationConfigValidator = "Location Config Settings Validators"
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
    get validatorName(): string;
    set validatorName(value: string);
    getValidationError(): IValidationError;
    protected setValidatonError(error: IValidationError): void;
    protected processErrorMessage(errors: any): Error;
    protected customErrorMessage(): Record<string, string>;
    protected genericValidator(validateFn: Joi.ValidationResult): boolean;
    private processErrorMessages;
}
export {};
