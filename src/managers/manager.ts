
const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import { ILocation, ILocationEntity } from '../entities/location';
import * as pp from '../providers/prayer-provider';
import * as lp from '../providers/location-provider';
import { ILocationConfig, IPrayersConfig } from "../configurators/configuration";
import val = require('../validators/validator');
import validators = val.validators;
import { isNullOrUndefined } from 'util';
export interface IPrayerSettingsBuilder {
    setPrayerMethod(methodId: Methods): IPrayerSettingsBuilder;
    setPrayerSchool(schoolId: Schools): IPrayerSettingsBuilder;
    setPrayerAdjustments(adjustments: IPrayerAdjustments[]): IPrayerSettingsBuilder;
    setPrayerMidnight(midnightId: MidnightMode): IPrayerSettingsBuilder;
    setPrayerPeriod(startDate: Date, endDate: Date): IPrayerSettingsBuilder;
    createPrayerSettings(): Promise<IPrayersSettings>;
}
export class PrayerSettingsBuilder implements IPrayerSettingsBuilder {
    private _prayerSettings: IPrayersSettings;
    private _prayerProvider: pp.IPrayerProvider;
    private _validtor: validators.IValid<IPrayersSettings>;
    private constructor(prayerProvider: pp.IPrayerProvider, validator: validators.IValid<IPrayersSettings>, prayerConfig?: IPrayersConfig, ) {
        this._prayerProvider = prayerProvider;
        this._validtor = validator;
        this._prayerSettings = new PrayersSettings();
        this._prayerSettings.midnight.id = prayerConfig.midnight;
        this._prayerSettings.adjustments = isNullOrUndefined(prayerConfig.adjustments) ? this._prayerSettings.adjustments : prayerConfig.adjustments;
        this._prayerSettings.school.id = isNullOrUndefined(prayerConfig.school) ? Schools.Hanafi : prayerConfig.school;
        this._prayerSettings.latitudeAdjustment.id = isNullOrUndefined(prayerConfig.latitudeAdjustment) ? LatitudeMethod.Angle : prayerConfig.latitudeAdjustment;
        this._prayerSettings.startDate = isNullOrUndefined(prayerConfig.startDate) ? this._prayerSettings.startDate : prayerConfig.startDate;
        this._prayerSettings.endDate = isNullOrUndefined(prayerConfig.endDate) ? this._prayerSettings.endDate : prayerConfig.startDate;

    }
    public setPrayerMethod(methodId: Methods): IPrayerSettingsBuilder {
        this._prayerSettings.method.id = methodId;
        return this;
    }
    public setPrayerSchool(schoolId: Schools): IPrayerSettingsBuilder {
        this._prayerSettings.school.id = schoolId;
        return this;
    }
    public setPrayerAdjustments(adjustments: IPrayerAdjustments[]): IPrayerSettingsBuilder {
        this._prayerSettings.adjustments = adjustments;
        return this;
    }
    public setPrayerMidnight(midnightId: MidnightMode): IPrayerSettingsBuilder {
        this._prayerSettings.midnight.id = midnightId;
        return this;
    }
    public setPrayerPeriod(startDate: Date, endDate: Date): IPrayerSettingsBuilder {
        this._prayerSettings.startDate = startDate;
        this._prayerSettings.endDate = endDate;
        return this;
    }
    public async createPrayerSettings(): Promise<IPrayersSettings> {
        let validationErr: validators.IValidationError;
        let validationResult: boolean = false;
        [validationErr, validationResult] = await to(this._validtor.validate(this._prayerSettings));
        if (validationErr)
            return Promise.reject(validationErr);
        if (validationResult) {
            try {
                this._prayerSettings.method = await this._prayerProvider.getPrayerMethodsById(this._prayerSettings.method.id);
                this._prayerSettings.latitudeAdjustment = await this._prayerProvider.getPrayerLatitudeById(this._prayerSettings.latitudeAdjustment.id);
                this._prayerSettings.midnight = await this._prayerProvider.getPrayerMidnightById(this._prayerSettings.midnight.id);
                this._prayerSettings.school = await this._prayerProvider.getPrayerSchoolsById(this._prayerSettings.school.id);
                return this._prayerSettings;
            } catch (error) {
                return Promise.reject(error);
            }

        }
    }
    public static createPrayerSettingsBuilder(prayerConfig?: IPrayersConfig, prayerProvider?: pp.IPrayerProvider): IPrayerSettingsBuilder {
        let prayerProviderName: pp.IPrayerProvider = pp.PrayerProviderFactory
            .createPrayerProviderFactory(pp.PrayerProviderName.PRAYER_TIME);
        let validate: validators.IValid<validators.ValidtionTypes> = validators.PrayerSettingsValidator.createValidator();
        return new PrayerSettingsBuilder(prayerProviderName, validate, prayerConfig);
    }


}
export interface ILocationBuilder {
    setLocationCoordinates(lat: number, lng: number): ILocationBuilder
    setLocationAddress(address: string, countryCode: string): ILocationBuilder
    createLocation(): Promise<ILocationEntity>

}
export class LocationBuilder implements ILocationBuilder {
    private _location: ILocationEntity
    private _locationProvider: provider.ILocationProvider;
    private _validtor: validators.IValid<ILocationEntity>;
    private constructor(locationProvider: provider.ILocationProvider, validator: validators.IValid<ILocationEntity>) {
        this._locationProvider = locationProvider;
        this._validtor = validator;
        this._location = new Location();
    }
    public setLocationCoordinates(lat: number, lng: number): LocationBuilder {
        this._location.latitude = lat;
        this._location.longtitude = lng;
        return this
    }
    public setLocationAddress(address: string, countryCode: string): LocationBuilder {
        this._location.countryCode = countryCode;
        this._location.address = address;
        return this;
    }
    public async createLocation(): Promise<ILocationEntity> {
        let validationErr: validators.IValidationError, validationResult: boolean = false;
        let providerErr: Error, locationResult: ILocation, timezoneResult: ITimeZone;
        [validationErr, validationResult] = await to(this._validtor.validate(this._location));
        if (validationErr)
            return Promise.reject(validationErr);
        if (validationResult) {
            if (!isNullOrUndefined(this._location.latitude))
                [providerErr, locationResult] = await to(this._locationProvider.getLocationByCoordinates(this._location.latitude, this._location.longtitude));
            else if ((!isNullOrUndefined(this._location.address))) {
                [providerErr, locationResult] = await to(this._locationProvider.getLocationByAddress(this._location.address, this._location.countryCode));
                if (providerErr)
                    return Promise.reject(providerErr);
                [providerErr, timezoneResult] = await to(this._locationProvider.getTimeZoneByCoordinates(locationResult.latitude, locationResult.longtitude));
                if (providerErr)
                    return Promise.reject(providerErr);
                this._location = ramda.mergeWith(ramda.concat, locationResult, timezoneResult);
                return Promise.resolve(this._location);
            }
            else {
                return Promise.reject()
            }
        }
    }
    public static createLocationBuilder(locationConfig?: ILocationConfig, ILocationProvider?: provider.ILocationProvider): LocationBuilder {
        let providerName: provider.ILocationProvider = provider.LocationProviderFactory.
            createLocationProviderFactory(provider.LocationProviderName.GOOGLE);
        let validate: validators.IValid<validators.ValidtionTypes> = validators.LocationValidator.createValidator();
        return new LocationBuilder(providerName, validate);
    }

}
