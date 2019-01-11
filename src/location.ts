const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import Joi from "joi";
import ramda = require('ramda');
export var googleMapsClient = require('@google/maps').createClient({
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
export class Location {
  private _location: ILocation
  // private _locationValidator: LocationValidator
  constructor(location: ILocation) {
    this._location = location;
    // this._locationValidator.isValid(this,)

  }
  public getLocation(): ILocation {
    return this._location
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
    let locationObject: Location;
    let googleResults, locationCoordinates, locationAddress,locationCountry, err;
    let filterbycountry = n => ramda.contains('country',n.types);
    let filterbyaddress = n => ramda.contains('locality',n.types);
    if (location !== null && LocationValidator.validateLocation(location)) {
      if (location.address != null) {
        [err, googleResults] = await to(googleMapsClient.geocode({ address: location.address, components: { country: location.countryCode } }).asPromise());
      }
      else if (location.latitude != null) {
        [err, googleResults] = await to(googleMapsClient.reverseGeocode({
          latlng: [location.latitude, location.longtitude],
          result_type: ['locality','country']
        }).asPromise());
      }
      else
        throw new Error('Input provided is invalid');
      if (!err && googleResults !== null && googleResults.json.results.length > 0) {

        locationCoordinates = ramda.path(['results', '0', 'geometry', 'location'], googleResults.json);
        locationAddress =ramda.find(filterbyaddress)(googleResults.json.results[0].address_components);
        locationCountry =ramda.find(filterbycountry)( googleResults.json.results[0].address_components);
        if (locationCoordinates !== null && locationAddress!== null) {
          return new Location({
            address: locationAddress.long_name,
            countryCode: locationCountry.short_name,
            latitude: locationCoordinates.lat,
            longtitude: locationCoordinates.lng
          });
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
