import * as location from '../entities/location';
export declare type ValidtionTypes = location.ILocationEntity;
export declare enum ValidatorProviders {
    LocationValidator = "Validate Location"
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
export interface IValid<ValidtionTypes> {
    validate(validateObject: ValidtionTypes): Promise<boolean>;
    isValid(): boolean;
    getValidationError(): IValidationError;
}
export declare class ValidatorProviderFactory {
    static createValidateProvider(validatorProviderName: ValidatorProviders): IValid<ValidtionTypes>;
}
export {};
