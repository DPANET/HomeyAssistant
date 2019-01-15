const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import Joi from "joi";
import ramda = require('ramda');


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
export enum LocationProviderName {
  GOOGLE = "Google",
  APPLE = "Apple",
  PRAYERTIME = "Prayer Time"

}
const LocationErrorMessages =
{
  BAD_INPUT: 'Location input provided are not valid',
  NOT_FOUND: 'Location provided cannot be found, try again with different input',
  BAD_RESULT: 'Location provided results have caused unexpected error, please try different input',
  TIME_OUT: 'Connection cannot be made to location provider, please try again after a while'
}
export interface ILocationProvider {
  getProviderName(): LocationProviderName
  getLocationByCoordinates(lng: number, lat: number): Promise<ILocation>
  getTimeZoneByCoordinates(lng: number, lat: number): Promise<ITimeZone>
  getLocationByAddress(address: string, countryCode?: string): Promise<ILocation>

}
//add validation later as a seperate class
export abstract class LocationProvider implements ILocationProvider {

  private _providerName;
  constructor(providerName: LocationProviderName) {
    this._providerName = providerName;
  }
  getProviderName(): LocationProviderName {
    return this._providerName;
  }
  abstract async getLocationByCoordinates(lat: number, lng: number): Promise<ILocation>;
  abstract async getTimeZoneByCoordinates(lat: number, lng: number): Promise<ITimeZone>;
  abstract async getLocationByAddress(address: string, countryCode: string): Promise<ILocation>;

}

class GoogleLocationProvider extends LocationProvider {
  private _googleMapClient;
  private _location: ILocation;
  constructor() {
    super(LocationProviderName.GOOGLE);
    this._googleMapClient = require('@google/maps').createClient({
      key: process.env.GOOGLE_API_KEY,
      Promise: Promise
    });

  }
  public async getLocationByCoordinates(lat: number, lng: number): Promise<ILocation> {
    let googleLocation, err;
    if (lat !== null && lng !== null) {
      [err, googleLocation] = await to(this._googleMapClient.reverseGeocode({
        latlng: [lat, lng],
        result_type: ['locality', 'country']
      }).asPromise());
      if (err) throw new Error(LocationErrorMessages.NOT_FOUND);
      return this.parseLocation(googleLocation);
    }
    else throw new Error(LocationErrorMessages.BAD_INPUT);
  }
  public async getTimeZoneByCoordinates(lat: number, lng: number): Promise<ITimeZone> {
    let googleTimeZone, err, timezoneObject;
    if (lat !== null && lng !== null) {
      [err, googleTimeZone] = await to(this._googleMapClient
        .timezone({ location: [lat, lng] })
        .asPromise());
      if (err) throw new Error(LocationErrorMessages.NOT_FOUND);
      timezoneObject = googleTimeZone.json;
      return {
        timeZoneId: timezoneObject.timeZoneId,
        timeZoneName: timezoneObject.timeZoneName,
        dstOffset: timezoneObject.dstOffset,
        rawOffset: timezoneObject.rawOffset
      };
    }
    else throw new Error(LocationErrorMessages.BAD_INPUT);
  }
  public async getLocationByAddress(address: string, countryCode: string): Promise<ILocation> {
    let googleLocation, err;
    if (address !== null && countryCode !== null) {
      [err, googleLocation] = await to(this._googleMapClient.
        geocode({ address: address, components: { country: countryCode } })
        .asPromise());
      if (err) throw new Error(LocationErrorMessages.NOT_FOUND);
      return this.parseLocation(googleLocation);
    }
    else throw new Error(LocationErrorMessages.BAD_INPUT);


  }
  private parseLocation(googleLocation: any): ILocation {
    let locationCoordinates, locationAddress, locationCountry;
    let filterbycountry = n => ramda.contains('country', n.types);
    let filterbyaddress = n => ramda.contains('locality', n.types);
    if (googleLocation !== null && googleLocation.json.results.length > 0) {

      locationCoordinates = ramda.path(['results', '0', 'geometry', 'location'], googleLocation.json);
      locationAddress = ramda.find(filterbyaddress)(googleLocation.json.results[0].address_components);
      locationCountry = ramda.find(filterbycountry)(googleLocation.json.results[0].address_components);
      if (locationCoordinates === null || locationAddress === null || locationCountry === null)
        throw new Error(LocationErrorMessages.BAD_RESULT);
      return {
        address: locationAddress.long_name,
        countryCode: locationCountry.short_name,
        countryName: locationCountry.long_name,
        latitude: locationCoordinates.lat,
        longtitude: locationCoordinates.lng
      };
    }
    else throw new Error(LocationErrorMessages.NOT_FOUND);
  }
}

export class LocationProviderFactory {
  static createLocationProviderFactory(locationProviderName: LocationProviderName): LocationProvider {
    switch (locationProviderName) {
      case LocationProviderName.GOOGLE:
        return new GoogleLocationProvider();
        break;
    }
  }
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
class LocationValidator {
  static async validateLocation(location: ILocation): Promise<boolean> {

    return true;
  }
}

interface ILocationBuilder<T> {
  setLocationCoordinates(lat: number, lng: number): Promise<T>
  setLocationAddress(address: string, countryCode: string): Promise<T>
  setLocationTimeZone(lat: number, lng: number): Promise<T>
  createLocation(): Promise<ILocationEntity>

}

export class PrayerLocationBuider implements ILocationBuilder<PrayerLocationBuider>
{
  private _location: ILocationEntity
  private _locationProvider: LocationProvider;
  constructor() {
    this._location = new Location();
    this._locationProvider = LocationProviderFactory.createLocationProviderFactory(LocationProviderName.GOOGLE);

  }
  async setLocationCoordinates(lat: number, lng: number): Promise<PrayerLocationBuider> {
    return this
  }
  async setLocationAddress(address: string, countryCode: string): Promise<PrayerLocationBuider> {
    return this;
  }
  async setLocationTimeZone(lat: number, lng: number): Promise<PrayerLocationBuider> {
    return this;
  }
  async createLocation(): Promise<ILocationEntity> {
    return this._location;
  }

}

