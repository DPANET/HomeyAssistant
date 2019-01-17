const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import {LocationProvider,LocationProviderFactory,LocationProviderName,ILocationProvider} from './providers';

export interface ILocation {
  latitude?: number,
  longtitude?: number,
  city?: string,
  countryCode?: string,
  countryName?: string,
  address?: string
}
export interface ITimeZone {
  timeZoneId: string,
  timeZoneName: string,
  dstOffset: number,
  rawOffset: number

}
export interface ILocationEntity extends ILocation,ITimeZone
{

}


export class Location implements ILocationEntity {
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
    if (location !== null) {
      this._latitude = location.latitude;
      this.longtitude - location.longtitude;
      this._countryCode = location.countryCode;
      this._countryName = location.countryName;
      this._address= location.address;
    }
    if (timeZone!== null)
    {
      this._timeZoneId= timeZone.timeZoneId;
      this._timeZoneName= timeZone.timeZoneName;
      this._dstOffset= timeZone.dstOffset;
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


interface ILocationBuilder<T> {
  setLocationCoordinates(lat: number, lng: number): Promise<T>
  setLocationAddress(address: string, countryCode: string): Promise<T>
  setLocationTimeZone(lat: number, lng: number): Promise<T>
  createLocation(): Promise<ILocationEntity>

}

 export class LocationBuilder implements ILocationBuilder<LocationBuilder>
{
  private _location: ILocationEntity
  private _locationProvider: ILocationProvider;
  constructor(locationProvider:ILocationProvider) {
    this._location = new Location();
    
  }
  async setLocationCoordinates(lat: number, lng: number): Promise<LocationBuilder> {
    return this
  }
  async setLocationAddress(address: string, countryCode: string): Promise<LocationBuilder> {
    return this;
  }
  async setLocationTimeZone(lat: number, lng: number): Promise<LocationBuilder> {
    return this;
  }
  async createLocation(): Promise<ILocationEntity> {
    return this._location;
  }

}
