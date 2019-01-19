const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import Joi = require('joi');
import * as location from './location';

export enum ValidatorProviders {
    LocationValidator = "Validate Location"

}
interface IError {
    message: string,
    objectName: string,
    value: object

}
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
export interface IValid<T> {
    validate(validateObject: T): Promise<boolean>;
    isValid(): boolean;
    getValidationError(): IValidationError;

}
 abstract class Validator<T> implements IValid<T>
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
    abstract validate(validateObject: T): Promise<boolean>;
    public get validatorName(): string {
        return this._validatorName;
    }
    public set validatorName(value: string) {
        this._validatorName = value;
    }
    public getValidationError(): IValidationError {
        if(!this.isValid())
        return this._valdationErrors;
        else return null;
    }
    protected setValidatonError(error: IValidationError) {
        this._valdationErrors = error;

    }
}

 class LocationValidator extends Validator<location.ILocationEntity>
{
    private _joiSchema: object;
    constructor() {
        super(ValidatorProviders.LocationValidator);
        this._joiSchema = Joi.object().keys({
            countryCode: Joi.string().regex(/^[A-Z]{2}$/i),
            address: Joi.string(),
            latitude: Joi.number().min(-90).max(90),
            longtitude: Joi.number().min(-180).max(180),
            countryName: Joi.any()
        })
            .with('address', 'countryCode')
            .with('latitude', 'longtitude');

    }
    public async validate(validateObject: location.ILocationEntity): Promise<boolean> {
        
        let result, err: Joi.ValidationError, iErr:IValidationError;
        [err, result] = to(await Joi.validate(validateObject, this._joiSchema));
        if (err) {
            iErr= this.processErrorMessages(err);
            this.setIsValid(false);
            this.setValidatonError(iErr);
            Promise.reject(iErr);
        }
        else{
            this.setIsValid(true);
            return Promise.resolve( true);
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
type validtionTypes = location.ILocationEntity| location.ILocation;
export class ValidatorProviderFactory {
    static createValidateProvider(validatorProviderName:ValidatorProviders): IValid<validtionTypes> {
    
        switch (validatorProviderName) {
            case ValidatorProviders.LocationValidator:
            let validation:IValid<location.ILocation> = new LocationValidator();
                return validation;
        }
    }
}