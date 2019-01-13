"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
const ramda = require("ramda");
var LocationProviderName;
(function (LocationProviderName) {
    LocationProviderName["GOOGLE"] = "Google";
    LocationProviderName["APPLE"] = "Apple";
    LocationProviderName["PRAYERTIME"] = "Prayer Time";
})(LocationProviderName = exports.LocationProviderName || (exports.LocationProviderName = {}));
const LocationErrorMessages = {
    BAD_INPUT: 'Location input provided are not valid',
    NOT_FOUND: 'Location provided cannot be found, try again with different input',
    BAD_RESULT: 'Location provided results have caused unexpected error, please try different input',
    TIME_OUT: 'Connection cannot be made to location provider, please try again after a while'
};
//add validation later as a seperate class
class LocationProvider {
    constructor(providerName) {
        this._providerName = providerName;
    }
    getProviderName() {
        return this._providerName;
    }
}
exports.LocationProvider = LocationProvider;
class GoogleLocationProvider extends LocationProvider {
    constructor() {
        super(LocationProviderName.GOOGLE);
        this._googleMapClient = require('@google/maps').createClient({
            key: process.env.GOOGLE_API_KEY,
            Promise: Promise
        });
    }
    async getLocationByCoordinates(lat, lng) {
        let googleLocation, err;
        if (lat !== null && lng !== null) {
            [err, googleLocation] = await to(this._googleMapClient.reverseGeocode({
                latlng: [lat, lng],
                result_type: ['locality', 'country']
            }).asPromise());
            if (err)
                throw new Error(LocationErrorMessages.NOT_FOUND);
            return this.parseLocation(googleLocation);
        }
        else
            throw new Error(LocationErrorMessages.BAD_INPUT);
    }
    async getTimeZoneByCoordinates(lat, lng) {
        return;
    }
    async getLocationByAddress(address, countryCode) {
        return;
    }
    parseLocation(googleLocation) {
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
                latitude: locationCoordinates.lat,
                longtitude: locationCoordinates.lng
            };
        }
        else
            throw new Error(LocationErrorMessages.NOT_FOUND);
    }
}
class LocationProviderFactory {
    static createLocationProviderFactory(locationProviderName) {
        switch (locationProviderName) {
            case LocationProviderName.GOOGLE:
                return new GoogleLocationProvider();
                break;
        }
    }
}
exports.LocationProviderFactory = LocationProviderFactory;