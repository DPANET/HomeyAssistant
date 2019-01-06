"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const dotenv = require('dotenv');
dotenv.config();
exports.googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_API_KEY
});
class Location {
    // private _locationValidator: LocationValidator
    constructor(latitude, longitude, city, countryCode) {
        this._location.latitude = latitude;
        this._location.longitude = longitude;
        this._location.city = city;
        this._location.countryCode = countryCode;
        // this._locationValidator.isValid(this,)
    }
    getLocation() {
        return this._location;
    }
    setLocation(location) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield LocationValidator.validateCoordinates(location)) {
                this._location = location;
                return Promise.resolve(true);
            }
            else
                return Promise.reject(util_1.error);
        });
    }
}
exports.Location = Location;
class LocationValidator {
    static validateCoordinates(location) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(true);
        });
    }
}
class LocationFactory {
    //create location object from config
    static createLocationFactory(location) {
        return __awaiter(this, void 0, void 0, function* () {
            let locationObject;
            if (location !== null) {
                locationObject = new Location(location.latitude, location.longitude);
            }
            return Promise.resolve(locationObject); // return Promise.resolve(new lo);
        });
    }
}
exports.LocationFactory = LocationFactory;
