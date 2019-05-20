import * as location from '../entities/location';
import * as prayer from '../entities/prayer';
import * as config from '../configurators/inteface.configuration';
export declare namespace validators {
    type ValidtionTypes = prayer.IPrayersSettings | location.ILocationSettings | config.IPrayersConfig;
    enum ValidatorProviders {
        LocationValidator = "Validate Location",
        PrayerSettingsValidator = "Validate Prayer Settings",
        ConfigValidator = "Config Settings Validators"
    }
    interface IError {
        message: string;
        objectName: string;
        value: object;
    }
    interface IValidationError extends Error {
        err: Error;
        details: Array<IError>;
        value: object;
    }
    interface IValid<ValidtionTypes> {
        validate(validateObject: ValidtionTypes): Promise<boolean>;
        isValid(): boolean;
        getValidationError(): IValidationError;
    }
    abstract class Validator<ValidtionTypes> implements IValid<ValidtionTypes> {
        private _validatorName;
        private _valdationErrors;
        private _isValid;
        constructor(validatorName: string);
        isValid(): boolean;
        protected setIsValid(state: boolean): void;
        abstract validate(validateObject: ValidtionTypes): Promise<boolean>;
        validatorName: string;
        getValidationError(): IValidationError;
        protected setValidatonError(error: IValidationError): void;
        protected genericValidator(validateFn: Function): Promise<boolean>;
        private processErrorMessages;
    }
    class LocationValidator extends Validator<location.ILocationSettings> {
        private _joiSchema;
        private constructor();
        validate(validateObject: location.ILocationSettings): Promise<boolean>;
        static createValidator(): IValid<location.ILocationSettings>;
    }
    class PrayerSettingsValidator extends Validator<prayer.IPrayersSettings> {
        private _joiSchema;
        private constructor();
        validate(validateObject: prayer.IPrayersSettings): Promise<boolean>;
        static createValidator(): IValid<prayer.IPrayersSettings>;
    }
    class ConfigValidator extends Validator<config.IPrayersConfig> {
        private _joiSchema;
        private constructor();
        validate(validateObject: config.IPrayersConfig): Promise<boolean>;
        static createValidator(): IValid<config.IPrayersConfig>;
    }
}
