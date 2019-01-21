const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import { isNullOrUndefined } from 'util';
import { ITimeZone, ILocation, ILocationEntity } from './location';

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
 abstract class LocationProvider implements ILocationProvider {

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
        if (!isNullOrUndefined(lat) && !isNullOrUndefined(lng)) {
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
        if (!isNullOrUndefined(lat)  && !isNullOrUndefined(lng)) {
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
        if (!isNullOrUndefined(address)  && !isNullOrUndefined(countryCode)) {
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
        if (!isNullOrUndefined(googleLocation) && googleLocation.json.results.length > 0) {

            locationCoordinates = ramda.path(['results', '0', 'geometry', 'location'], googleLocation.json);
            locationAddress = ramda.find(filterbyaddress)(googleLocation.json.results[0].address_components);
            locationCountry = ramda.find(filterbycountry)(googleLocation.json.results[0].address_components);
            if (isNullOrUndefined(locationCoordinates)  || isNullOrUndefined(locationAddress) || isNullOrUndefined(locationCountry))
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
