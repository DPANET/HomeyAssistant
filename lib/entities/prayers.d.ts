import { ILocation } from './location';
export declare enum Prayers {
    FAJR = "Fajr",
    SUNRISE = "Sunrise",
    DHUHR = "Dhuhr",
    ASR = "Asr",
    MAGHRIB = "Maghrib",
    SUNSET = "Sunset",
    ISHA = "Isha",
    MIDNIGHT = "Midnight"
}
export interface IPrayerTime {
    prayerName: Prayers;
    time: string;
}
export interface IPrayerAdjustments {
    prayerName: Prayers;
    adjustments: number;
}
export interface IPrayerMidnight {
    id: number;
    midnight: string;
}
export interface IPrayerLatitude {
    id: number;
    latitudeMethod: string;
}
export interface IPrayersSettings {
    adjustments: IPrayerAdjustments[];
    method: IPrayerMethods;
    school: IPrayerSchools;
    midnight: IPrayerMidnight;
    latitudeAdjustment: IPrayerLatitude;
}
export interface IPrayerSchools {
    id: number;
    school: string;
}
export interface IPrayerMethods {
    id: number;
    methodName: string;
}
export declare class PrayersTime {
    private _prayers;
    private _prayersDate;
    constructor(prayersDate: Date, prayers: Array<IPrayerTime>);
}
export declare class PrayersSettings {
    private _prayersSettings;
    constructor(prayersSettings: IPrayersSettings);
}
export declare class PrayersTimeFactory {
    static createPrayersTimeFactory(location?: ILocation, prayerSettings?: IPrayersSettings): Promise<Array<PrayersTime>>;
    static createPrayersSettingFactory(prayerSettings?: IPrayersSettings): Promise<PrayersSettings>;
}
