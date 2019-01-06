import { string, number } from "joi";
import { error } from "util";

const dotenv = require('dotenv');
dotenv.config();

export var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY
});

export interface ILocation {
  latitude: number,
  longitude: number,
  city?: string,
  countryCode?: string
}
export class Location {
  private _location: ILocation
  // private _locationValidator: LocationValidator
  constructor(latitude: number, longitude: number, city?: string, countryCode?: string) {
    this._location.latitude = latitude;
    this._location.longitude = longitude;
    this._location.city = city;
    this._location.countryCode = countryCode;
    // this._locationValidator.isValid(this,)

  }
  public  getLocation(): ILocation {
    return this._location
  }
  public async setLocation(location: ILocation): Promise<boolean> {
    if (await LocationValidator.validateCoordinates(location)) {
      this._location = location;
      return Promise.resolve(true);

    }
    else
      return Promise.reject(error);
  }

}
class LocationValidator {
  static async validateCoordinates(location: ILocation): Promise<boolean> {

    return Promise.resolve(true);
  }
}
export class LocationFactory
{
  //create location object from config
   public static async createLocationFactory(location?: ILocation): Promise<Location> {
    let locationObject :Location;
    if(location !== null)
     {
        locationObject  = new Location(location.latitude,location.longitude);
        
     }
    return Promise.resolve(locationObject);// return Promise.resolve(new lo);
  }
} 
