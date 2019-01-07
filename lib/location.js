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
const dotenv = require('dotenv');
dotenv.config();
const Joi = require("joi");
exports.googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_API_KEY,
    Promise: Promise
});
class Location {
    // private _locationValidator: LocationValidator
    constructor(location) {
        this._location = location;
        // this._locationValidator.isValid(this,)
    }
    getLocation() {
        return this._location;
    }
    setLocation(location) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield LocationValidator.validateCoordinates(location)) {
                return Promise.resolve(true);
            }
            else
                return Promise.reject('err');
        });
    }
}
exports.Location = Location;
class LocationValidator {
    static validateCoordinates(location) {
        return __awaiter(this, void 0, void 0, function* () {
            exports.googleMapsClient;
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
                LocationValidator.validateCoordinates(location);
                locationObject = new Location(location);
            }
            return Promise.resolve(locationObject); // return Promise.resolve(new lo);
        });
    }
}
exports.LocationFactory = LocationFactory;
