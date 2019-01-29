
const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import { ILocation, ILocationEntity } from './location';
import * as pp from '../providers/prayer-provider';
import * as lp from '../providers/location-provider';
import { ILocationConfig, IPrayersConfig } from "../configurators/configuration";
import val = require('../validators/validator');
import validators = val.validators;
import { isNullOrUndefined } from 'util';
import * as util from '../util/utility';
import { realpathSync } from 'fs';
export enum PrayersName {
    FAJR = "Fajr",
    SUNRISE = "Sunrise",
    DHUHR = "Dhuhr",
    ASR = "Asr",
    SUNSET = "Sunset",
    MAGHRIB = "Maghrib",
    ISHA = "Isha",
    IMSAK = "Imsak",
    MIDNIGHT = "Midnight"

};
export enum Schools {
    Hanafi = 0,
    Shafi
};
export enum MidnightMode {
    Standard = 0,
    Jafari
};
export enum LatitudeMethod {
    MidNight = 1,
    Seventh,
    Angle
};
export enum Methods {
    Shia = 0,
    Karchi,
    America,
    MuslimLeague,
    Makka,
    Egypt,
    Iran,
    Gulf,
    Kuwait,
    Qatar,
    Singapore,
    France,
    Turkey,
    Custom = 99
};
export interface IPrayersTiming {
    prayerName: PrayersName;
    prayerTime: string;
}
export interface IPrayers {
    prayerTime: IPrayersTiming[];
    prayersDate: Date;
    //    adjustment: number
}
export interface IPrayerAdjustments {
    prayerName: PrayersName;
    adjustments: number;
}
export interface IPrayerMidnight {
    id: MidnightMode;
    midnight: string;
}
export interface IPrayerLatitude {
    id: LatitudeMethod;
    latitudeMethod: string;
}
export interface IPrayersSettings {
    adjustments: IPrayerAdjustments[];
    method: IPrayerMethods;
    school: IPrayerSchools;
    midnight: IPrayerMidnight;
    latitudeAdjustment: IPrayerLatitude;
    startDate: Date;
    endDate: Date;
}
export interface IPrayerSchools {
    id: Schools;
    school: string;
}
export interface IPrayerMethods {
    id: Methods;
    methodName: string;

}
export interface IPrayersTime {
    location: ILocationEntity;
    pareyerSettings: IPrayersSettings;
    prayers: Array<IPrayers>;


}
class PrayerAdjustment implements IPrayerAdjustments {
    private _prayerName: PrayersName;
    public get prayerName(): PrayersName {
        return this._prayerName;
    }
    public set prayerName(value: PrayersName) {
        this._prayerName = value;
    }
    private _adjustments: number;
    public get adjustments(): number {
        return this._adjustments;
    }
    public set adjustments(value: number) {
        this._adjustments = value;
    }


}
class PrayersMidnight implements IPrayerMidnight {
    private _id: MidnightMode;
    public get id(): MidnightMode {
        return this._id;
    }
    public set id(value: MidnightMode) {
        this._id = value;
    }
    private _midnight: string;
    public get midnight(): string {
        return this._midnight;
    }
    public set midnight(value: string) {
        this._midnight = value;
    }

}
class PrayerLatitude implements IPrayerLatitude {
    private _id: LatitudeMethod;
    public get id(): LatitudeMethod {
        return this._id;
    }
    public set id(value: LatitudeMethod) {
        this._id = value;
    }
    private _latitudeMethod: string;
    public get latitudeMethod(): string {
        return this._latitudeMethod;
    }
    public set latitudeMethod(value: string) {
        this._latitudeMethod = value;
    }


}
class PrayerSchools implements IPrayerSchools {
    private _id: Schools;
    public get id(): Schools {
        return this._id;
    }
    public set id(value: Schools) {
        this._id = value;
    }
    private _school: string;
    public get school(): string {
        return this._school;
    }
    public set school(value: string) {
        this._school = value;
    }


}
class PrayersMethods implements IPrayerMethods {
    private _id: Methods;
    public get id(): Methods {
        return this._id;
    }
    public set id(value: Methods) {
        this._id = value;
    }
    private _methodName: string;
    public get methodName(): string {
        return this._methodName;
    }
    public set methodName(value: string) {
        this._methodName = value;
    }



}
class Prayers implements IPrayers {
    private _prayerTime: IPrayersTiming[];
    public get prayerTime(): IPrayersTiming[] {
        return this._prayerTime;
    }
    public set prayerTime(value: IPrayersTiming[]) {
        this._prayerTime = value;
    }

    private _prayersDate: Date;
    public get prayersDate(): Date {
        return this._prayersDate;
    }
    public set prayersDate(value: Date) {
        this._prayersDate = value;
    }


}
class PrayersTime implements IPrayersTime {

    //prayer constructors, with timing,
    constructor(prayers: Array<IPrayers>) {

        this._prayers = prayers;
        // this._prayersTimings = new Array();
    }
    private _location: ILocationEntity;
    public get location(): ILocationEntity {
        return this._location;
    }
    public set location(value: ILocationEntity) {
        this._location = value;
    }
    private _pareyerSettings: IPrayersSettings;
    public get pareyerSettings(): IPrayersSettings {
        return this._pareyerSettings;
    }
    public set pareyerSettings(value: IPrayersSettings) {
        this._pareyerSettings = value;
    }
    private _prayers: IPrayers[];
    public get prayers(): IPrayers[] {
        return this._prayers;
    }
    public set prayers(value: IPrayers[]) {
        this._prayers = value;
    }


}
class PrayersSettings implements IPrayersSettings {

    private _startDate: Date;
    public get startDate(): Date {
        return this._startDate;
    }
    public set startDate(value: Date) {
        this._startDate = value;
    }
    private _endDate: Date;
    public get endDate(): Date {
        return this._endDate;
    }
    public set endDate(value: Date) {
        this._endDate = value;
    }
    private _adjustments: IPrayerAdjustments[];
    public get adjustments(): IPrayerAdjustments[] {
        return this._adjustments;
    }
    public set adjustments(value: IPrayerAdjustments[]) {
        this._adjustments = value;
    }
    private _method: IPrayerMethods;
    public get method(): IPrayerMethods {
        return this._method;
    }
    public set method(value: IPrayerMethods) {
        this._method = value;
    }
    private _school: IPrayerSchools;
    public get school(): IPrayerSchools {
        return this._school;
    }
    public set school(value: IPrayerSchools) {
        this._school = value;
    }
    private _midnight: IPrayerMidnight;
    public get midnight(): IPrayerMidnight {
        return this._midnight;
    }
    public set midnight(value: IPrayerMidnight) {
        this._midnight = value;
    }
    private _latitudeAdjustment: IPrayerLatitude;
    public get latitudeAdjustment(): IPrayerLatitude {
        return this._latitudeAdjustment;
    }
    public set latitudeAdjustment(value: IPrayerLatitude) {
        this._latitudeAdjustment = value;
    }
    private _prayersSettings: IPrayersSettings;
    constructor(prayersSettings?: IPrayersSettings) {
        if (!isNullOrUndefined(prayersSettings))
            this._prayersSettings = prayersSettings;
        else {
            this._method = new PrayersMethods();
            this._adjustments = new Array<PrayerAdjustment>();
            this._midnight = new PrayersMidnight();
            this._school = new PrayerSchools();
        }
    }


}
class PrayersTimeFactory {

    public static async createPrayersTimeFactory(location?: ILocation, prayerSettings?: IPrayersSettings): Promise<Array<PrayersTime>> {

        return;
    }
    public static async createPrayersSettingFactory(prayerSettings?: IPrayersSettings): Promise<PrayersSettings> {
        //ifPrayersSettings are not passed, read it from config
        return;
    }

}

class PrayerTimeBuilder {
    private _prayerTime: IPrayersTime;
    constructor(prayerConfig: IPrayersConfig, locationConfig: ILocationConfig) {
    }

}
export interface IPrayerSettingsBuilder {
    setPrayerMethod(methodId: Methods): IPrayerSettingsBuilder;
    setPrayerSchool(schoolId: Schools): IPrayerSettingsBuilder;
    setPrayerAdjustments(adjustments: IPrayerAdjustments[]): IPrayerSettingsBuilder;
    setPrayerMidnight(midnightId: MidnightMode): IPrayerSettingsBuilder;
    setPrayerPeriod(startDate: Date, endDate: Date): IPrayerSettingsBuilder;
    createPrayerSettings(): Promise<IPrayersSettings>;
}
class PrayerSettingsBuilder implements IPrayerSettingsBuilder {
    private _prayerSettings: IPrayersSettings;
    private _prayerProvider: pp.IPrayerProvider;
    private _validtor: validators.IValid<IPrayersSettings>;
    private constructor(prayerProvider: pp.IPrayerProvider, validator: validators.IValid<IPrayersSettings>, prayerConfig?: IPrayersConfig, ) {
        this._prayerProvider = prayerProvider;
        this._validtor = validator;
        this._prayerSettings = new PrayersSettings();
        this._prayerSettings.midnight.id = prayerConfig.midnight;
        this._prayerSettings.adjustments = isNullOrUndefined(prayerConfig.adjustments) ? this._prayerSettings.adjustments : prayerConfig.adjustments;
        this._prayerSettings.school.id = isNullOrUndefined(prayerConfig.school) ? Schools.Hanafi: prayerConfig.school;
        this._prayerSettings.latitudeAdjustment.id =isNullOrUndefined(prayerConfig.latitudeAdjustment) ? LatitudeMethod.Angle:prayerConfig.school;
        this._prayerSettings.startDate = prayerConfig.startDate;
        this._prayerSettings.endDate = prayerConfig.endDate;

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
        let validationErr: validators.IValidationError, validationResult: boolean = false;
        let providerErr: Error, prayerSettingsResult: IPrayersSettings;
        [validationErr, validationResult] = await to(this._validtor.validate(this._prayerSettings));
        if (validationErr)
            return Promise.reject(validationErr);
        if (validationResult) {

        }
    }
    public static createPrayerSettingsBuilder(prayerConfig?: IPrayersConfig, prayerProvider?: pp.IPrayerProvider): IPrayerSettingsBuilder {
        let prayerProviderName: pp.IPrayerProvider = pp.PrayerProviderFactory
            .createPrayerProviderFactory(pp.PrayerProviderName.PRAYER_TIME);
        let validate: validators.IValid<validators.ValidtionTypes> = validators.LocationValidator.createValidator();
        return new PrayerSettingsBuilder(prayerProviderName, validate, prayerConfig);
    }


}