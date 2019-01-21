const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import * as provider from '../providers/location-provider';
import * as validator from "../validators/validator";
import { isNullOrUndefined } from 'util';
export enum LocationTypeName {
  LocationBuilder = "Location Builder"

}
export interface ILocation {
  latitude?: number,
  longtitude?: number,
  city?: string,
  countryCode?: string,
  countryName?: string,
  address?: string
}
export interface ITimeZone {
  timeZoneId?: string,
  timeZoneName?: string,
  dstOffset?: number,
  rawOffset?: number

}
export interface ILocationEntity extends ILocation, ITimeZone {

}
class Location implements ILocationEntity {
  private _latitude?: number;
  private _longtitude?: number;
  private _countryCode?: string;
  private _city?: string;
  private _countryName?: string;
  private _address?: string;
  private _timeZoneId: string;

  private _timeZoneName: string;
  private _dstOffset: number;
  private _rawOffset: number;

  constructor(location?: ILocation, timeZone?: ITimeZone) {
    if (!isNullOrUndefined(location)) {
      this._latitude = location.latitude;
      this._longtitude - location.longtitude;
      this._countryCode = location.countryCode;
      this._countryName = location.countryName;
      this._address = location.address;
    }
    if (!isNullOrUndefined(timeZone)) {
      this._timeZoneId = timeZone.timeZoneId;
      this._timeZoneName = timeZone.timeZoneName;
      this._dstOffset = timeZone.dstOffset;
      this._rawOffset = timeZone.rawOffset;
    }
  }

  public get latitude(): number {
    return this._latitude;
  }
  public set latitude(value: number) {
    this._latitude = value;
  }

  public get longtitude(): number {
    return this._longtitude;
  }
  public set longtitude(value: number) {
    this._longtitude = value;
  }

  public get city(): string {
    return this._city;
  }
  public set city(value: string) {
    this._city = value;
  }

  public get countryCode(): string {
    return this._countryCode;
  }
  public set countryCode(value: string) {
    this._countryCode = value;
  }

  public get countryName(): string {
    return this._countryName;
  }
  public set countryName(value: string) {
    this._countryName = value;
  }
  public get address(): string {
    return this._address;
  }
  public set address(value: string) {
    this._address = value;
  }
  public get timeZoneId(): string {
    return this._timeZoneId;
  }
  public set timeZoneId(value: string) {
    this._timeZoneId = value;
  }
  public get timeZoneName(): string {
    return this._timeZoneName;
  }
  public set timeZoneName(value: string) {
    this._timeZoneName = value;
  }
  public get rawOffset(): number {
    return this._rawOffset;
  }
  public set rawOffset(value: number) {
    this._rawOffset = value;
  }
  public get dstOffset(): number {
    return this._dstOffset;
  }
  public set dstOffset(value: number) {
    this._dstOffset = value;
  }
}


export interface ILocationBuilder {
  setLocationCoordinates(lat: number, lng: number): Promise<ILocationBuilder>
  setLocationAddress(address: string, countryCode: string): Promise<ILocationBuilder>
  createLocation(): Promise<ILocationEntity>

}

class LocationBuilder implements ILocationBuilder {
  private _location: ILocationEntity
  private _locationProvider: provider.ILocationProvider;
  private _validtor: validator.IValid<ILocationEntity>;
  constructor(locationProvider: provider.ILocationProvider, validator: validator.IValid<ILocationEntity>) {
    this._location = new Location();
    this._validtor = validator;
    this._locationProvider=locationProvider;

  }
  public async setLocationCoordinates(lat: number, lng: number): Promise<LocationBuilder> {

    this._location.latitude = lat;
    this._location.longtitude = lng;


    return this
  }
  public async setLocationAddress(address: string, countryCode: string): Promise<LocationBuilder> {
    this._location.countryCode = countryCode;
    this._location.address = address;
    return this;
  }
  public async createLocation(): Promise<ILocationEntity> {
    let validationErr: validator.IValidationError, validationResult: boolean = false;
    let providerErr: Error, locationResult: ILocationEntity;
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
        this._location = locationResult;
        return Promise.resolve(this._location);
      }
      else {
        return Promise.reject()
      }
    }
  }

}

export class LocationBuilderFactory {
  //FACTORY to read from config default location proivder, and validator
  static createBuilderFactory(builderTypeName: LocationTypeName) {
    switch (builderTypeName) {
      case LocationTypeName.LocationBuilder:
        let providerName: provider.ILocationProvider = provider.LocationProviderFactory.
          createLocationProviderFactory(provider.LocationProviderName.GOOGLE);
        let validate: validator.IValid<validator.ValidtionTypes> = validator.ValidatorProviderFactory.
          createValidateProvider(validator.ValidatorProviders.LocationValidator);
        return new LocationBuilder(providerName, validate);
    }

  }
}