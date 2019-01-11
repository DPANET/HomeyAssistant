const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import Joi from "joi";
import ramda = require('ramda');
var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY,
  Promise: Promise
});

export interface ILocation {
  latitude?: number,
  longtitude?: number,
  city?: string,
  countryCode?: string
  address?: string
}
export interface ITimeZone {
  timeZoneId: string,
  timeZoneName: string,
  dstOffset: number,
  rawOffset: number

}
export class Location {
  private _location: ILocation;
  private _timeZone: ITimeZone;
  // private _locationValidator: LocationValidator
  constructor(location: ILocation, timeZone: ITimeZone) {
    this._location = location;
    this._timeZone = timeZone;
    // this._locationValidator.isValid(this,)

  }
  public getLocation(): ILocation {
    return this._location
  }
  public getTimeZone(): ITimeZone
  {
    return this._timeZone;
  }
  public async setLocation(location: ILocation): Promise<boolean> {
    if (await LocationValidator.validateLocation(location)) {

      return Promise.resolve(true);

    }
    else
      return Promise.reject('err');
  }

}
class LocationValidator {
  static async validateLocation(location: ILocation): Promise<boolean> {

    return true;
  }
}
export class LocationFactory {
  //create location object from config
  public static async createLocationFactory(location?: ILocation): Promise<Location> {
    let timeZoneObject;
    let googleLocation, googleTimeZone, locationCoordinates, locationAddress, locationCountry, err;
    let filterbycountry = n => ramda.contains('country', n.types);
    let filterbyaddress = n => ramda.contains('locality', n.types);
    if (location !== null && LocationValidator.validateLocation(location)) {
      if (location.address != null) {
        [err, googleLocation] = await to(googleMapsClient.geocode({ address: location.address, components: { country: location.countryCode } }).asPromise());
      }
      else if (location.latitude != null) {
        [err, googleLocation] = await to(googleMapsClient.reverseGeocode({
          latlng: [location.latitude, location.longtitude],
          result_type: ['locality', 'country']
        }).asPromise());
      }
      else
        throw new Error('Input provided is invalid');
      if (!err && googleLocation !== null && googleLocation.json.results.length > 0) {

        locationCoordinates = ramda.path(['results', '0', 'geometry', 'location'], googleLocation.json);
        locationAddress = ramda.find(filterbyaddress)(googleLocation.json.results[0].address_components);
        locationCountry = ramda.find(filterbycountry)(googleLocation.json.results[0].address_components);

        if (locationCoordinates !== null && locationAddress !== null) {
          [err, googleTimeZone] = await to(googleMapsClient.timezone({ location: [locationCoordinates.lat, locationCoordinates.lng] }).asPromise());
          timeZoneObject = googleTimeZone.json;
          if (!err) {
            return new Location({
              address: locationAddress.long_name,
              countryCode: locationCountry.short_name,
              latitude: locationCoordinates.lat,
              longtitude: locationCoordinates.lng
            },
              {
                timeZoneId: timeZoneObject.timeZoneId,
                timeZoneName: timeZoneObject.timeZoneName,
                dstOffset : timeZoneObject.dstOffset,
                rawOffset : timeZoneObject.rawOffset

              }
            );
          }
        }
      }
      else
        throw new Error('Location cannot be found');
    }
    else {
      throw new Error('Location Input provided are not valid, please try again with different locations \n');
    }


  }

} 
