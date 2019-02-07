import { ILocationSettings } from './location';
import { EventEmitter } from 'events';
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
export declare enum LatitudeMethod {
    MidNight = 1,
    Seventh = 2,
    Angle = 3
}
export declare enum Methods {
    Shia = 0,
    Karchi = 1,
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
    location: ILocationSettings;
    pareyerSettings: IPrayersSettings;
    prayers: Array<IPrayers>;
}
export declare class Prayers implements IPrayers {
    private _prayerTime;
    constructor();
    prayerTime: IPrayersTiming[];
    private _prayersDate;
    prayersDate: Date;
}
export declare class PrayersTime implements IPrayersTime {
    constructor(prayers: Array<IPrayers>, locationSettings: ILocationSettings, prayerConfig: IPrayersSettings);
    private _location;
    location: ILocationSettings;
    private _pareyerSettings;
    pareyerSettings: IPrayersSettings;
    private _prayers;
    prayers: IPrayers[];
}
export declare class PrayersSettings implements IPrayersSettings {
    private _startDate;
    startDate: Date;
    private _endDate;
    endDate: Date;
    private _adjustments;
    adjustments: IPrayerAdjustments[];
    private _method;
    method: IPrayerMethods;
    private _school;
    school: IPrayerSchools;
    private _midnight;
    midnight: IPrayerMidnight;
    private _latitudeAdjustment;
    latitudeAdjustment: IPrayerLatitude;
    private _prayersSettings;
    constructor(prayersSettings?: IPrayersSettings);
}
export declare class PrayerEvents extends EventEmitter {
}
