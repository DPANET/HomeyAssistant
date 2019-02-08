
const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import * as location from '../entities/location';
import * as prayer from '../entities/prayer';
import * as pp from '../providers/prayer-provider';
import * as lp from '../providers/location-provider';
import { ILocationConfig, IPrayersConfig } from "../configurators/configuration";
import val = require('../validators/validator');
import validators = val.validators;
import { isNullOrUndefined } from 'util';
import { DateUtil } from '../util/utility';
export interface IPrayerSettingsBuilder {
    setPrayerMethod(methodId: prayer.Methods): IPrayerSettingsBuilder;
    setPrayerSchool(schoolId: prayer.Schools): IPrayerSettingsBuilder;
    setPrayerAdjustments(adjustments: prayer.IPrayerAdjustments[]): IPrayerSettingsBuilder;
    setPrayerMidnight(midnightId: prayer.MidnightMode): IPrayerSettingsBuilder;
    setPrayerLatitudeAdjustment(latitudeAdjustment: prayer.LatitudeMethod): IPrayerSettingsBuilder;
    setPrayerPeriod(startDate: Date, endDate: Date): IPrayerSettingsBuilder;
    createPrayerSettings(): Promise<prayer.IPrayersSettings>;

};
export class PrayerSettingsBuilder implements IPrayerSettingsBuilder {
    private _prayerSettings: prayer.IPrayersSettings;
    private _prayerProvider: pp.IPrayerProvider;
    private _validtor: validators.IValid<prayer.IPrayersSettings>;
    private constructor(prayerProvider: pp.IPrayerProvider, validator: validators.IValid<prayer.IPrayersSettings>, prayerConfig?: IPrayersConfig, ) {
        this._prayerProvider = prayerProvider;
        this._validtor = validator;
        this._prayerSettings = new prayer.PrayersSettings();
        this._prayerSettings.midnight.id = isNullOrUndefined(prayerConfig.midnight) ? prayer.MidnightMode.Standard : prayerConfig.midnight;
        this._prayerSettings.method.id = isNullOrUndefined(prayerConfig.method) ? prayer.Methods.Mecca : prayerConfig.method;
        this._prayerSettings.adjustments = isNullOrUndefined(prayerConfig.adjustments) ? this._prayerSettings.adjustments : prayerConfig.adjustments;
        this._prayerSettings.school.id = isNullOrUndefined(prayerConfig.school) ? prayer.Schools.Shafi : prayerConfig.school;
        this._prayerSettings.latitudeAdjustment.id = isNullOrUndefined(prayerConfig.latitudeAdjustment) ? prayer.LatitudeMethod.Angle : prayerConfig.latitudeAdjustment;
        this._prayerSettings.startDate = isNullOrUndefined(prayerConfig.startDate) ? DateUtil.getNowDate() : prayerConfig.startDate;
        this._prayerSettings.endDate = isNullOrUndefined(prayerConfig.endDate) ? DateUtil.addMonth(1, DateUtil.getNowDate()) : prayerConfig.endDate;

    }
    public setPrayerMethod(methodId: prayer.Methods): IPrayerSettingsBuilder {
        this._prayerSettings.method.id = methodId;
        return this;
    }
    public setPrayerSchool(schoolId: prayer.Schools): IPrayerSettingsBuilder {
        this._prayerSettings.school.id = schoolId;
        return this;
    }
    public setPrayerAdjustments(adjustments: prayer.IPrayerAdjustments[]): IPrayerSettingsBuilder {
        this._prayerSettings.adjustments = adjustments;
        return this;
    }
    public setPrayerMidnight(midnightId: prayer.MidnightMode): IPrayerSettingsBuilder {
        this._prayerSettings.midnight.id = midnightId;
        return this;
    }
    public setPrayerPeriod(startDate: Date, endDate: Date): IPrayerSettingsBuilder {
        this._prayerSettings.startDate = startDate;
        this._prayerSettings.endDate = endDate;
        return this;
    }
    public setPrayerLatitudeAdjustment(latitudeAdjustment: prayer.LatitudeMethod): IPrayerSettingsBuilder {
        this._prayerSettings.latitudeAdjustment.id = latitudeAdjustment;
        return this;
    }
    public async createPrayerSettings(): Promise<prayer.IPrayersSettings> {
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
            }
            catch (error) {
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

};
export interface ILocationBuilder {
    setLocationCoordinates(lat: number, lng: number): ILocationBuilder
    setLocationAddress(address: string, countryCode: string): ILocationBuilder
    createLocation(): Promise<location.ILocationSettings>

};
export class LocationBuilder implements ILocationBuilder {
    private _location: location.ILocationSettings
    private _locationProvider: lp.ILocationProvider;
    private _validtor: validators.IValid<location.ILocationSettings>;
    private constructor(locationProvider: lp.ILocationProvider, validator: validators.IValid<location.ILocationSettings>) {
        this._locationProvider = locationProvider;
        this._validtor = validator;
        this._location = new location.Location();
    }
    public setLocationCoordinates(lat: number, lng: number): ILocationBuilder {
        this._location.latitude = lat;
        this._location.longtitude = lng;
        return this;
    }
    public setLocationAddress(address: string, countryCode: string): ILocationBuilder {
        this._location.countryCode = countryCode;
        this._location.address = address;
        return this;
    }
    public async createLocation(): Promise<location.ILocationSettings> {
        let validationErr: validators.IValidationError, validationResult: boolean = false;
        let providerErr: Error, locationResult: location.ILocation, timezoneResult: location.ITimeZone;
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
            }
            [providerErr, timezoneResult] = await to(this._locationProvider.getTimeZoneByCoordinates(locationResult.latitude, locationResult.longtitude));
            if (providerErr)
                return Promise.reject(providerErr);
            this._location = ramda.mergeWith(ramda.concat, locationResult, timezoneResult);
            return Promise.resolve(this._location);
        }
        else {
            return Promise.reject();
        }
    }

    public static createLocationBuilder(locationConfig?: ILocationConfig, ILocationProvider?: lp.ILocationProvider): LocationBuilder {
        let providerName: lp.ILocationProvider = lp.LocationProviderFactory.
            createLocationProviderFactory(lp.LocationProviderName.GOOGLE);
        let validate: validators.IValid<validators.ValidtionTypes> = validators.LocationValidator.createValidator();
        return new LocationBuilder(providerName, validate);
    }

};

export interface IPrayerTimeBuilder {
    setPrayerMethod(methodId: prayer.Methods): IPrayerTimeBuilder;
    setPrayerSchool(schoolId: prayer.Schools): IPrayerTimeBuilder;
    setPrayerAdjustments(adjustments: prayer.IPrayerAdjustments[]): IPrayerTimeBuilder;
    setPrayerMidnight(midnightId: prayer.MidnightMode): IPrayerTimeBuilder;
    setPrayerLatitudeAdjustment(latitudeAdjustment: prayer.LatitudeMethod): IPrayerTimeBuilder;
    setPrayerPeriod(startDate: Date, endDate: Date): IPrayerTimeBuilder;
    setLocationByCoordinates(lat: number, lng: number): IPrayerTimeBuilder;
    setLocationByAddress(address: string, countryCode: string): IPrayerTimeBuilder;
    createPrayerTimeManager(): Promise<IPrayerManager>;
    createPrayerTime(): Promise<prayer.IPrayersTime>;
};

export class PrayerTimeBuilder implements IPrayerTimeBuilder {

    private _locationBuilder: ILocationBuilder;
    private _prayerSettingsBuilder: IPrayerSettingsBuilder;
    private _prayers: Array<prayer.IPrayers>;
    private _prayerProvider: pp.IPrayerProvider;
    private constructor(prayerProvider: pp.IPrayerProvider, locationBuilder: ILocationBuilder, prayerSettingsBuilder: IPrayerSettingsBuilder) {
        this._prayerSettingsBuilder = prayerSettingsBuilder;
        this._locationBuilder = locationBuilder;
        this._prayerProvider = prayerProvider;
        this._prayers = new Array<prayer.Prayers>();
    }
    public setPrayerMethod(methodId: prayer.Methods): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerMethod(methodId);

        return this;
    }
    public setPrayerSchool(schoolId: prayer.Schools): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerSchool(schoolId);
        return this;
    }
    public setPrayerAdjustments(adjustments: prayer.IPrayerAdjustments[]): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerAdjustments(adjustments);
        return this;
    }
    public setPrayerMidnight(midnightId: prayer.MidnightMode): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerMidnight(midnightId);
        return this;
    }
    public setPrayerLatitudeAdjustment(latitudeAdjustment: prayer.LatitudeMethod): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerLatitudeAdjustment(latitudeAdjustment);
        return this;
    }
    public setPrayerPeriod(startDate: Date, endDate: Date): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerPeriod(startDate, endDate);
        return this;
    }
    public setLocationByCoordinates(lat: number, lng: number): IPrayerTimeBuilder {
        this._locationBuilder.setLocationCoordinates(lat, lng);
        return this;
    }
    public setLocationByAddress(address: string, countryCode: string): IPrayerTimeBuilder {
        this._locationBuilder.setLocationAddress(address, countryCode);
        return this;
    }
    public async createPrayerTime(): Promise<prayer.IPrayersTime> {
        let location: location.ILocationSettings, prayerSettings: prayer.IPrayersSettings;
        try {
            location = await this._locationBuilder.createLocation();
            prayerSettings = await this._prayerSettingsBuilder.createPrayerSettings();
            this._prayers = await this._prayerProvider.getPrayerTime(prayerSettings, location);
            return Promise.resolve(new prayer.PrayersTime(this._prayers, location, prayerSettings));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    public async createPrayerTimeManager(): Promise<IPrayerManager> {
        try {
            let prayersTime: prayer.IPrayersTime = await this.createPrayerTime();
            let prayerManager: IPrayerManager = new PrayerManager(prayersTime, this);
            return Promise.resolve(prayerManager);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    public static createPrayerTimeBuilder(locationConfig?: ILocationConfig, prayerConfig?: IPrayersConfig): PrayerTimeBuilder {
        let prayerProvider: pp.IPrayerProvider = pp.PrayerProviderFactory.createPrayerProviderFactory(pp.PrayerProviderName.PRAYER_TIME);
        let locationBuilder: ILocationBuilder = LocationBuilder
            .createLocationBuilder(isNullOrUndefined(locationConfig) ? null : locationConfig);
        let prayerSettingsBuilder: IPrayerSettingsBuilder = PrayerSettingsBuilder
            .createPrayerSettingsBuilder(isNullOrUndefined(prayerConfig) ? null : prayerConfig);
        return new PrayerTimeBuilder(prayerProvider, locationBuilder, prayerSettingsBuilder);
    }
};

export interface IPrayerManager {
    getUpcomingPrayer(date?: Date, prayerType?: prayer.PrayerType): prayer.IPrayersTiming;
    getPreviousPrayer(): prayer.IPrayersTime;
    getUpcomingPrayerTimeRemaining(): Date;
    getPrviouesPrayerTimeElapsed(): Date;
    getPrayerTime(prayerName: prayer.PrayersName, prayerDate?: Date): prayer.IPrayersTiming;
    getPrayerConfig(): IPrayersConfig;
    getPrayerTimeZone(): location.ITimeZone;
    getPrayerLocation(): location.ILocation;
    getPrayerStartPeriod(): Date;
    getPrayerEndPeriond(): Date;
    getPrayersByDate(date: Date): prayer.IPrayers;
    updatePrayersDate(startDate: Date, endDate: Date): Promise<IPrayerManager>;
    getLocationConfig(): ILocationConfig;
}

export class PrayerManager implements IPrayerManager {

    private _prayerTime: prayer.IPrayersTime;
    private _prayerTimeBuilder: IPrayerTimeBuilder;
    private _prayerEvents: prayer.PrayerEvents;
    constructor(prayerTime: prayer.IPrayersTime, prayerTimeBuilder: IPrayerTimeBuilder) {
        this._prayerTime = prayerTime;
        this._prayerEvents = new prayer.PrayerEvents();
        this._prayerTimeBuilder = prayerTimeBuilder;
    }
    public getPrayerTimeZone(): location.ITimeZone {
        return {
            timeZoneId: this._prayerTime.location.timeZoneId,
            timeZoneName: this._prayerTime.location.timeZoneName,
            dstOffset: this._prayerTime.location.dstOffset,
            rawOffset: this._prayerTime.location.rawOffset
        };
    }
    public getPrayerLocation(): location.ILocation {
        return {
            latitude: this._prayerTime.location.latitude,
            longtitude: this._prayerTime.location.longtitude,
            city: this._prayerTime.location.city,
            countryCode: this._prayerTime.location.countryCode,
            countryName: this._prayerTime.location.countryName,
            address: this._prayerTime.location.address
        };
    }
    public getPrayerStartPeriod(): Date {
        return this._prayerTime.pareyerSettings.startDate;
    }
    public getPrayerEndPeriond(): Date {
        return DateUtil.getEndofDate(this._prayerTime.pareyerSettings.endDate);
    }
    public getUpcomingPrayerTimeRemaining(): Date {
        throw new Error("Method not implemented.");
    }
    public getPrviouesPrayerTimeElapsed(): Date {
        throw new Error("Method not implemented.");
    }
    public getPrayerConfig(): IPrayersConfig {
        return {
            method: this._prayerTime.pareyerSettings.method.id,
            midnight: this._prayerTime.pareyerSettings.midnight.id,
            school: this._prayerTime.pareyerSettings.school.id,
            latitudeAdjustment: this._prayerTime.pareyerSettings.latitudeAdjustment.id,
            startDate: this.getPrayerStartPeriod(),
            endDate: this.getPrayerEndPeriond(),
            adjustments: this._prayerTime.pareyerSettings.adjustments
        };
    }
    public getLocationConfig(): ILocationConfig {
        throw new Error("Method not implemented.");
    }
    public getPrayerTime(prayerName: prayer.PrayersName, prayerDate?: Date): prayer.IPrayersTiming {
        let prayersByDate: prayer.IPrayers = this.getPrayersByDate(prayerDate);
        if (!isNullOrUndefined(prayersByDate)) {
            return ramda.find<prayer.IPrayersTiming>(n => n.prayerName === prayerName, prayersByDate.prayerTime);
        }
        return null;
    }
    public getPrayersByDate(date: Date): prayer.IPrayers {
        let fnDayMatch = (n: prayer.IPrayers) => DateUtil.dayMatch(date, n.prayersDate);
        return ramda.find(fnDayMatch, this._prayerTime.prayers);
    }
    public getUpcomingPrayer(date?: Date, prayerType?: prayer.PrayerType): prayer.IPrayersTiming {
        let dateNow: Date;
        if (isNullOrUndefined(date))
            dateNow = DateUtil.getNowDate();
        else
            dateNow = date;

        if (dateNow > this.getPrayerEndPeriond() || dateNow < this.getPrayerStartPeriod())
            return null;
        let orderByFn = ramda.sortBy<prayer.IPrayersTiming>(ramda.prop('prayerTime'));
        let upcomingPrayer: prayer.IPrayersTiming = null;
        let fardhPrayers: Array<prayer.IPrayerType> = prayer.PrayersTypes.filter((n) => n.prayerType === prayer.PrayerType.Fardh);
        let todayPrayers: prayer.IPrayers = this.getPrayersByDate(dateNow);
        if (!isNullOrUndefined(todayPrayers)) {
            let listOfPrayers: Array<prayer.IPrayersTiming> = orderByFn(todayPrayers.prayerTime);
            //filter on fardh prayers.
            listOfPrayers = ramda.innerJoin
                ((prayerLeft: prayer.IPrayersTiming, prayerRight: prayer.IPrayerType) => prayerLeft.prayerName === prayerRight.prayerName
                    , listOfPrayers
                    , fardhPrayers);
            //find next prayer based on prayertype
            for (let i: number = 0, prev, curr; i < listOfPrayers.length; i++) {
                prev = listOfPrayers[i], curr = listOfPrayers[i + 1];
                upcomingPrayer = this.processUpcomingPrayer(prev, curr, i + 1, listOfPrayers, dateNow);
                if (!isNullOrUndefined(upcomingPrayer))
                    return upcomingPrayer;
            }
        }
        return upcomingPrayer;
    }
    private processUpcomingPrayer(prev: prayer.IPrayersTiming, curr: prayer.IPrayersTiming, index: number, array: Array<prayer.IPrayersTiming>, dateNow: Date): prayer.IPrayersTiming {

        if (prev.prayerTime >= dateNow)
            return array[index - 1];
        else if (!isNullOrUndefined(curr) && prev.prayerTime <= dateNow && curr.prayerTime >= dateNow)
            return array[index];
        else if (isNullOrUndefined(curr) && array.length === index) {
            let nextDay: Date = DateUtil.addDay(1, dateNow);
            if (nextDay > this.getPrayerEndPeriond())
                return null;
            return this.getPrayerTime(prayer.PrayersName.FAJR, nextDay);
        }
        return null
    }
    public getPreviousPrayer(): prayer.IPrayersTime {
        return;
    }
    public async updatePrayersDate(startDate: Date, endDate: Date): Promise<IPrayerManager> {
        try {
            this._prayerTime = await this._prayerTimeBuilder
                .setPrayerPeriod(startDate, endDate)
                .createPrayerTime();
            return this;
        } catch (err) {
            return Promise.reject(err);
        }
    }

}



