import { ILocationSettings } from './location';
export declare enum PrayersName {
    IMSAK = "Imsak",
    FAJR = "Fajr",
    SUNRISE = "Sunrise",
    DHUHR = "Dhuhr",
    ASR = "Asr",
    MAGHRIB = "Maghrib",
    SUNSET = "Sunset",
    ISHA = "Isha",
    MIDNIGHT = "Midnight"
}
export declare enum Schools {
    Shafi = 0,
    Hanafi = 1
}
export declare enum MidnightMode {
    Standard = 0,
    Jafari = 1
}
export declare enum AdjsutmentMethod {
    Provider = 0,
    Server = 1,
    Client = 2
}
export declare enum LatitudeMethod {
    MidNight = 1,
    Seventh = 2,
    Angle = 3
}
export declare enum Methods {
    Shia = 0,
    Karachi = 1,
    America = 2,
    MuslimLeague = 3,
    Mecca = 4,
    Egypt = 5,
    Iran = 7,
    Gulf = 8,
    Kuwait = 9,
    Qatar = 10,
    Singapore = 11,
    France = 12,
    Turkey = 13,
    Custom = 99
}
export declare enum PrayerType {
    Fardh = "Fardh",
    Sunna = "Sunna"
}
export interface IPrayerType {
    prayerName: PrayersName;
    prayerType: PrayerType;
}
export declare const PrayersTypes: Array<IPrayerType>;
export interface IPrayersTiming {
    prayerName: PrayersName;
    prayerTime: Date;
}
export interface IPrayers {
    prayerTime: IPrayersTiming[];
    prayersDate: Date;
}
export interface IPrayerAdjustments {
    prayerName: PrayersName;
    adjustments: number;
}
export interface IPrayerAdjustmentMethod {
    id: AdjsutmentMethod;
    adjustmentMethod: string;
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
    adjustmentMethod: IPrayerAdjustmentMethod;
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
export declare class PrayersTiming implements IPrayersTiming {
    private _prayerName;
    get prayerName(): PrayersName;
    set prayerName(value: PrayersName);
    private _prayerTime;
    get prayerTime(): Date;
    set prayerTime(value: Date);
}
export declare class Prayers implements IPrayers {
    private _prayerTime;
    constructor(prayerTime?: Array<IPrayersTiming>);
    get prayerTime(): IPrayersTiming[];
    set prayerTime(value: IPrayersTiming[]);
    private _prayersDate;
    get prayersDate(): Date;
    set prayersDate(value: Date);
    toJSON(): IPrayers;
}
export declare class PrayersSettings implements IPrayersSettings {
    private _adjustmentMethod;
    get adjustmentMethod(): IPrayerAdjustmentMethod;
    set adjustmentMethod(value: IPrayerAdjustmentMethod);
    private _startDate;
    get startDate(): Date;
    set startDate(value: Date);
    private _endDate;
    get endDate(): Date;
    set endDate(value: Date);
    private _adjustments;
    get adjustments(): IPrayerAdjustments[];
    set adjustments(value: IPrayerAdjustments[]);
    private _method;
    get method(): IPrayerMethods;
    set method(value: IPrayerMethods);
    private _school;
    get school(): IPrayerSchools;
    set school(value: IPrayerSchools);
    private _midnight;
    get midnight(): IPrayerMidnight;
    set midnight(value: IPrayerMidnight);
    private _latitudeAdjustment;
    get latitudeAdjustment(): IPrayerLatitude;
    set latitudeAdjustment(value: IPrayerLatitude);
    toJSON(): IPrayersSettings;
    private _prayersSettings;
    constructor(prayersSettings?: IPrayersSettings);
}
export declare class PrayersTime implements IPrayersTime {
    constructor(prayers: Array<IPrayers>, locationSettings: ILocationSettings, prayerConfig: IPrayersSettings);
    private _location;
    get location(): ILocationSettings;
    set location(value: ILocationSettings);
    private _pareyerSettings;
    get pareyerSettings(): IPrayersSettings;
    set pareyerSettings(value: IPrayersSettings);
    private _prayers;
    get prayers(): IPrayers[];
    set prayers(value: IPrayers[]);
}
