const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import Joi = require('joi');
import { ILocationEntity } from './location';
import { join } from 'path';
interface IError
{
    err: Error,
    message:string,
    objectName:string,
    value:object,
}
export interface IValid<T>
{
    validate(validateObject:Validator<T>): Promise<Array<IError>> ;
    isValid():boolean;

}
class ValidationError implements IError
{
    constructor(err:Error,message:string,value:object,objectName:string)
    {
        this._err = err;
        this._message= message;
        this._value= value;
        this._objectName= objectName;

    }
    private _err: Error
    public get err(): Error {
        return this._err;
    }
    public set err(value: Error) {
        this._err = value;
    }
    private _message: string;
    public get message(): string {
        return this._message;
    }
    public set message(value: string) {
        this._message = value;
    }
    private _objectName: string;
    public get objectName(): string {
        return this._objectName;
    }
    public set objectName(value: string) {
        this._objectName = value;
    }
    private _value: object;
    public get value(): object {
        return this._value;
    }
    public set value(value: object) {
        this._value = value;
    }

}

export abstract class Validator<T> implements IValid<T>
{

    private _validatorName: string;
    private _valdationErrors: Array<IError>;
    private _isValid:boolean;
    constructor(validatorName:string)
    {
        this._validatorName= validatorName;
        this._valdationErrors = new Array<ValidationError>();
        this._isValid = false;
    }
    public  isValid(): boolean {
        return this._isValid;
        }
    protected setIsValid(state:boolean)
    {
        this._isValid= state;
    }
    abstract validate(validateObject:Validator<T>): Promise<Array<IError>>;
    public get validatorName(): string {
        return this._validatorName;
    }
    public set validatorName(value: string) {
        this._validatorName = value;
    }
    public  getValdationErrors(): Array<IError> {
        return this._valdationErrors;
    }
    protected setValidatonErrors(errors:IError): Array<IError>
    {
         this._valdationErrors.push(errors);
         return this._valdationErrors;
    }
}

export class LocationValidator<ILocationEntity> extends Validator<ILocationEntity> 
{
    private _joiSchema:object ;
    constructor()
    {
        super('Location Validator');
        this._joiSchema = Joi.object().keys({
            countryCode:Joi.string().allow("")
        });
        
    }
    public async validate(validateObject: Validator<ILocationEntity>):  Promise<Array<IError>> {
        let result,err; 
        [err,result] = to(await Joi.validate(validateObject,this._joiSchema));
        if (!err && result.error)
        {    this.setIsValid(false);
            // return this.setValidatonErrors(new ValidationError(result.error,result.error.message,""));
            return;
        }
        

    }

}