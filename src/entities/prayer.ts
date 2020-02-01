
import { ILocationSettings, Location } from './location';
import { isNullOrUndefined } from '../util/isNullOrUndefined';

import {
    list,
    object,
    identifier,
    date,
    serializable,
} from 'serializr';
export enum PrayersName {
    IMSAK = "Imsak",
    FAJR = "Fajr",
    SUNRISE = "Sunrise",
    DHUHR = "Dhuhr",
    ASR = "Asr",
    MAGHRIB = "Maghrib",
    SUNSET = "Sunset",
    ISHA = "Isha",
    MIDNIGHT = "Midnight"

};
export enum Schools {
    Shafi = 0,
    Hanafi
};
export enum MidnightMode {
    Standard = 0,
    Jafari
};
export  enum AdjsutmentMethod
{
    Provider=0,
    Server,
    Client
}
export enum LatitudeMethod {
    MidNight = 1,
    Seventh,
    Angle
};
export enum Methods {
    Shia = 0,
    Karachi,
    America,
    MuslimLeague,
    Mecca,
    Egypt = 5,
    Iran = 7,
    Gulf,
    Kuwait,
    Qatar,
    Singapore,
    France,
    Turkey,
    Custom = 99
};
export enum PrayerType {
    Fardh = "Fardh",
    Sunna = "Sunna"

}
export interface IPrayerType {
    prayerName: PrayersName,
    prayerType: PrayerType
}
export const PrayersTypes: Array<IPrayerType> = [
    { prayerName: PrayersName.FAJR, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.DHUHR, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.ASR, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.MAGHRIB, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.ISHA, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.SUNRISE, prayerType: PrayerType.Sunna },
    { prayerName: PrayersName.SUNSET, prayerType: PrayerType.Sunna },
    { prayerName: PrayersName.IMSAK, prayerType: PrayerType.Sunna },
    { prayerName: PrayersName.MIDNIGHT, prayerType: PrayerType.Sunna },
];



export interface IPrayersTiming {
    prayerName: PrayersName;
    prayerTime: Date;
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
export interface IPrayerAdjustmentMethod
{
    id: AdjsutmentMethod;
    adjustmentMethod:string;
    
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
    adjustmentMethod:IPrayerAdjustmentMethod,
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
    location: ILocationSettings;
    pareyerSettings: IPrayersSettings;
    prayers: Array<IPrayers>;

}
 class PrayerAdjustment implements IPrayerAdjustments {
    private _prayerName: PrayersName;
    @serializable(identifier())
    public get prayerName(): PrayersName {
        return this._prayerName;
    }
    public set prayerName(value: PrayersName) {
        this._prayerName = value;
    }
    private _adjustments: number;
    @serializable
    public get adjustments(): number {
        return this._adjustments;
    }
    public set adjustments(value: number) {
        this._adjustments = value;
    }

}
 class PrayersMidnight implements IPrayerMidnight {
    private _id: MidnightMode;
    @serializable(identifier())
    public get id(): MidnightMode {
        return this._id;
    }
    public set id(value: MidnightMode) {
        this._id = value;
    }
    private _midnight: string;
    @serializable   
    public get midnight(): string {
        return this._midnight;
    }
    public set midnight(value: string) {
        this._midnight = value;
    }

}
 class PrayerAdjustmentMethod implements IPrayerAdjustmentMethod
{
    private _id: AdjsutmentMethod;
    @serializable(identifier())
    public get id(): AdjsutmentMethod {
        return this._id;
    }
    public set id(value: AdjsutmentMethod) {
        this._id = value;
    }
    private _adjustmentMethod: string;
    @serializable
    public get adjustmentMethod(): string {
        return this._adjustmentMethod;
    }
    public set adjustmentMethod(value: string) {
        this._adjustmentMethod = value;
    }

    
}
 class PrayerLatitude implements IPrayerLatitude {
    private _id: LatitudeMethod;
    @serializable(identifier())
    public get id(): LatitudeMethod {
        return this._id;
    }
    public set id(value: LatitudeMethod) {
        this._id = value;
    }
    private _latitudeMethod: string;
    @serializable
    public get latitudeMethod(): string {
        return this._latitudeMethod;
    }
    public set latitudeMethod(value: string) {
        this._latitudeMethod = value;
    }


}
 class PrayerSchools implements IPrayerSchools {
    private _id: Schools;
    @serializable(identifier())
    public get id(): Schools {
        return this._id;
    }
    public set id(value: Schools) {
        this._id = value;
    }
    private _school: string;
    @serializable
    public get school(): string {
        return this._school;
    }
    public set school(value: string) {
        this._school = value;
    }
}
 class PrayersMethods implements IPrayerMethods { 
    private _id: Methods;
    @serializable(identifier())
    public get id(): Methods {
        return this._id;
    }
    public set id(value: Methods) {
        this._id = value;
    }
    private _methodName: string;
    @serializable
    public get methodName(): string {
        return this._methodName;
    }
    public set methodName(value: string) {
        this._methodName = value;
    }
}
export class PrayersTiming implements IPrayersTiming
{
    private _prayerName: PrayersName;
    @serializable(identifier())
    public get prayerName(): PrayersName {
        return this._prayerName;
    }
    public set prayerName(value: PrayersName) {
        this._prayerName = value;
    }
    private _prayerTime: Date;
    @serializable(date())
    public get prayerTime(): Date {
        return this._prayerTime;
    }
    public set prayerTime(value: Date) {
        this._prayerTime = value;
    }


}
export class Prayers implements IPrayers {
    private _prayerTime: IPrayersTiming[];
    public constructor(prayerTime?: Array<IPrayersTiming>) {
        if (!isNullOrUndefined(prayerTime))
            this._prayerTime = prayerTime;
        else
        this._prayerTime = new Array<IPrayersTiming>();
    }
    @serializable(list(object(PrayersTiming)))
    public get prayerTime(): IPrayersTiming[] {
        return this._prayerTime;
    }
    public set prayerTime(value: IPrayersTiming[]) {
        this._prayerTime = value;
    }
    private _prayersDate: Date;
    @serializable(date())
    public get prayersDate(): Date {
        return this._prayersDate;
    }
    public set prayersDate(value: Date) {
        this._prayersDate = value;
    }
    public toJSON():IPrayers
    {
        return {
            prayerTime: this._prayerTime,
            prayersDate: this._prayersDate
        };
    }
}
export class PrayersSettings implements IPrayersSettings {
 
    private _adjustmentMethod: IPrayerAdjustmentMethod;
    @serializable(object(PrayerAdjustmentMethod))
    public get adjustmentMethod(): IPrayerAdjustmentMethod {
        return this._adjustmentMethod;
    }
    public set adjustmentMethod(value: IPrayerAdjustmentMethod) {
        this._adjustmentMethod = value;
    }
    private _startDate: Date;
    @serializable(date())
    public get startDate(): Date {
        return this._startDate;
    }
    public set startDate(value: Date) {
        this._startDate = value;
    }
    private _endDate: Date;
    @serializable(date())
    public get endDate(): Date {
        return this._endDate;
    }
    public set endDate(value: Date) {
        this._endDate = value;
    }
    private _adjustments: IPrayerAdjustments[];
    @serializable(list(object(PrayerAdjustment)))
    public get adjustments(): IPrayerAdjustments[] {
        return this._adjustments;
    }
    public set adjustments(value: IPrayerAdjustments[]) {
        this._adjustments = value;
    }
    private _method: IPrayerMethods;
    @serializable(object(PrayersMethods))
    public get method(): IPrayerMethods {
        return this._method;
    }
    public set method(value: IPrayerMethods) {
        this._method = value;
    }
    private _school: IPrayerSchools;
    @serializable(object(PrayerSchools))
    public get school(): IPrayerSchools {
        return this._school;
    }
    public set school(value: IPrayerSchools) {
        this._school = value;
    }
    private _midnight: IPrayerMidnight;
    @serializable(object(PrayersMidnight))
    public get midnight(): IPrayerMidnight {
        return this._midnight;
    }
    public set midnight(value: IPrayerMidnight) {
        this._midnight = value;
    }
    private _latitudeAdjustment: IPrayerLatitude;
    @serializable(object(PrayerLatitude))
    public get latitudeAdjustment(): IPrayerLatitude {
        return this._latitudeAdjustment;
    }
    public set latitudeAdjustment(value: IPrayerLatitude) {
        this._latitudeAdjustment = value;
    }
    public toJSON():IPrayersSettings
    {
        return {
            midnight: this._midnight,
            school: this._school,
            latitudeAdjustment: this._latitudeAdjustment,
            method:this._method,
            startDate: this._startDate,
            adjustmentMethod: this._adjustmentMethod,
            endDate: this._endDate,
            adjustments: this._adjustments
        };
    }
    private _prayersSettings: IPrayersSettings;
    public constructor(prayersSettings?: IPrayersSettings) {
        if (!isNullOrUndefined(prayersSettings))
            this._prayersSettings = prayersSettings;
        else {
            this._method = new PrayersMethods();
            this._adjustments = new Array<PrayerAdjustment>();
            this._midnight = new PrayersMidnight();
            this._school = new PrayerSchools();
            this._adjustmentMethod= new PrayerAdjustmentMethod();
            this._latitudeAdjustment = new PrayerLatitude();
        }
    }


}
export class PrayersTime implements IPrayersTime {

    //prayer constructors, with timing,
    constructor(prayers: Array<IPrayers>, locationSettings: ILocationSettings, prayerConfig: IPrayersSettings) {
        this._location = locationSettings;
        this._prayers = prayers;
        this._pareyerSettings = prayerConfig;
    }
    private _location: ILocationSettings;
    @serializable(object(Location))
    public get location(): ILocationSettings {
        return this._location;
    }
    public set location(value: ILocationSettings) {
        this._location = value;
    }

    private _pareyerSettings: IPrayersSettings;
    @serializable(object(PrayersSettings))
    public get pareyerSettings(): IPrayersSettings {
        return this._pareyerSettings;
    }
    public set pareyerSettings(value: IPrayersSettings) {
        this._pareyerSettings = value;
    }
    private _prayers: IPrayers[];
    @serializable(list(object(Prayers)))
    public get prayers(): IPrayers[] {
        return this._prayers;
    }
    public set prayers(value: IPrayers[]) {
        this._prayers = value;
    }

    
}

