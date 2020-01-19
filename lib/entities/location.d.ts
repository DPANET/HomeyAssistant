export declare enum LocationTypeName {
    LocationBuilder = "Location Builder"
}
export interface ILocation {
    latitude?: number;
    longtitude?: number;
    city?: string;
    countryCode?: string;
    countryName?: string;
    address?: string;
}
export interface ITimeZone {
    timeZoneId?: string;
    timeZoneName?: string;
    dstOffset?: number;
    rawOffset?: number;
}
export interface ILocationSettings extends ILocation, ITimeZone {
}
export declare class Location implements ILocationSettings {
    private _latitude?;
    private _longtitude?;
    private _countryCode?;
    private _city?;
    private _countryName?;
    private _address?;
    private _timeZoneId?;
    private _timeZoneName?;
    private _dstOffset?;
    private _rawOffset?;
    constructor(location?: ILocation, timeZone?: ITimeZone);
    get latitude(): number;
    set latitude(value: number);
    get longtitude(): number;
    set longtitude(value: number);
    get city(): string;
    set city(value: string);
    get countryCode(): string;
    set countryCode(value: string);
    get countryName(): string;
    set countryName(value: string);
    get address(): string;
    set address(value: string);
    get timeZoneId(): string;
    set timeZoneId(value: string);
    get timeZoneName(): string;
    set timeZoneName(value: string);
    get rawOffset(): number;
    set rawOffset(value: number);
    get dstOffset(): number;
    set dstOffset(value: number);
}
