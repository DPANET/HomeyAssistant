const dotenv = require('dotenv');
dotenv.config();
const Joi = require("joi"); 
export var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY,
  Promise: Promise
});

export interface ILocation {
  latitude ?: number,
  longitude?: number,
  city?: string,
  countryCode?: string
  address?:string
}
export class Location {
  private _location: ILocation
  // private _locationValidator: LocationValidator
  constructor(location:ILocation) {
    this._location= location;
    // this._locationValidator.isValid(this,)

  }
  public  getLocation(): ILocation {
    return this._location
  }
  public async setLocation(location: ILocation): Promise<boolean> {
    if (await LocationValidator.validateCoordinates(location)) {
      
      return Promise.resolve(true);

    }
    else
      return Promise.reject('err');
  }

}
class LocationValidator {
  static async validateCoordinates(location: ILocation): Promise<boolean> {
    googleMapsClient
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
       LocationValidator.validateCoordinates(location);
        locationObject  = new Location(location);
        
        
     }
    return Promise.resolve(locationObject);// return Promise.resolve(new lo);
  }
} 
