import * as provider from '../providers/location-provider';
import * as validator from "../validators/validator";
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
export interface ILocationEntity extends ILocation, ITimeZone {
}
export interface ILocationBuilder {
    setLocationCoordinates(lat: number, lng: number): Promise<ILocationBuilder>;
    setLocationAddress(address: string, countryCode: string): Promise<ILocationBuilder>;
    createLocation(): Promise<ILocationEntity>;
}
declare class LocationBuilder implements ILocationBuilder {
    private _location;
    private _locationProvider;
    private _validtor;
    constructor(locationProvider: provider.ILocationProvider, validator: validator.IValid<ILocationEntity>);
    setLocationCoordinates(lat: number, lng: number): Promise<LocationBuilder>;
    setLocationAddress(address: string, countryCode: string): Promise<LocationBuilder>;
    createLocation(): Promise<ILocationEntity>;
}
export declare class LocationBuilderFactory {
    static createBuilderFactory(builderTypeName: LocationTypeName): LocationBuilder;
}
export {};
