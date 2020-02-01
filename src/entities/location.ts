
import { isNullOrUndefined } from '../util/isNullOrUndefined';
import {
  serializable,
} from 'serializr';
export enum LocationTypeName {
  LocationBuilder = "Location Builder"
};
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
export interface ILocationSettings extends ILocation, ITimeZone {

}
export class Location implements ILocationSettings {
  private _latitude?: number;
  private _longtitude?: number;
  private _countryCode?: string;
  private _city?: string;
  private _countryName?: string;
  private _address?: string;
  private _timeZoneId?: string;

  private _timeZoneName?: string;
  private _dstOffset?: number;
  private _rawOffset?: number;

  constructor(location?: ILocation, timeZone?: ITimeZone) {
    if (!isNullOrUndefined(location)) {
      this._latitude = location.latitude;
      this._longtitude = location.longtitude;
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
  @serializable
  public get latitude(): number {


    return this._latitude;
  }
  public set latitude(value: number) {
    this._latitude = value;
  }
  @serializable
  public get longtitude(): number {
    return this._longtitude;
  }
  public set longtitude(value: number) {
    this._longtitude = value;
  }
  @serializable
  public get city(): string {
    return this._city;
  }
  public set city(value: string) {
    this._city = value;
  }
  @serializable
  public get countryCode(): string {
    return this._countryCode;
  }
  public set countryCode(value: string) {
    this._countryCode = value;
  }
  @serializable
  public get countryName(): string {
    return this._countryName;
  }
  public set countryName(value: string) {
    this._countryName = value;
  }
  @serializable
  public get address(): string {
    return this._address;
  }
  public set address(value: string) {
    this._address = value;
  }
  @serializable
  public get timeZoneId(): string {
    return this._timeZoneId;
  }
  public set timeZoneId(value: string) {
    this._timeZoneId = value;
  }
  @serializable
  public get timeZoneName(): string {
    return this._timeZoneName;
  }
  public set timeZoneName(value: string) {
    this._timeZoneName = value;
  }
  @serializable
  public get rawOffset(): number {
    return this._rawOffset;
  }
  public set rawOffset(value: number) {
    this._rawOffset = value;
  }
  @serializable
  public get dstOffset(): number {
    return this._dstOffset;
  }
  public set dstOffset(value: number) {
    this._dstOffset = value;
  }
}
