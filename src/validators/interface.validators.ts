import Joi from '@hapi/joi';
import { isNullOrUndefined } from '../util/isNullOrUndefined';
export type ValidtionTypes =  any;

export enum ValidatorProviders {
    LocationValidator = "Validate Location",
    PrayerSettingsValidator = "Validate Prayer Settings",
    PrayerConfigValidator = "Prayer Config Settings Validators",
    LocationConfigValidator = "Location Config Settings Validators"
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
export interface IValid<T extends ValidtionTypes> {
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
    protected processErrorMessage(errors: any): Error {
        let errorMessage:string
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
    protected customErrorMessage():Record<string,string>{
        return {
           'date.base':`{#label} value is either not a date or could not be cast to a date from a string or a number`,
             "any.empty":
                 `{#label} key value is empty, value should be within the list`
                
            , "date.max":
                 `{#label} should not exceed {#limit}`
                
            , "any.allowOnly":
                 `{#label} should be within the acceptable list of values`
                
            , "any.required":
                 `{#label} is mandatory field`
                
            , "number.base":
                 `{#label} expects integer`
                
            , "string.base":
                 `{#label} expects string`
                
            , "array.includesOne":
                 `{#label} expects a value not in the list`
                
            , "object.child":
                 `{#label} expects a value not in the list`
                
        }
    }
    protected genericValidator(validateFn: Joi.ValidationResult ): boolean {
        let result, err, iErr: IValidationError;
        
        err =  validateFn.error;
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
