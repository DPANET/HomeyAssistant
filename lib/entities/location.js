"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
const provider = __importStar(require("../providers/location-provider"));
const validator = __importStar(require("../validators/validator"));
const util_1 = require("util");
var LocationTypeName;
(function (LocationTypeName) {
    LocationTypeName["LocationBuilder"] = "Location Builder";
})(LocationTypeName = exports.LocationTypeName || (exports.LocationTypeName = {}));
class Location {
    constructor(location, timeZone) {
        if (!util_1.isNullOrUndefined(location)) {
            this._latitude = location.latitude;
            this._longtitude - location.longtitude;
            this._countryCode = location.countryCode;
            this._countryName = location.countryName;
            this._address = location.address;
        }
        if (!util_1.isNullOrUndefined(timeZone)) {
            this._timeZoneId = timeZone.timeZoneId;
            this._timeZoneName = timeZone.timeZoneName;
            this._dstOffset = timeZone.dstOffset;
            this._rawOffset = timeZone.rawOffset;
        }
    }
    get latitude() {
        return this._latitude;
    }
    set latitude(value) {
        this._latitude = value;
    }
    get longtitude() {
        return this._longtitude;
    }
    set longtitude(value) {
        this._longtitude = value;
    }
    get city() {
        return this._city;
    }
    set city(value) {
        this._city = value;
    }
    get countryCode() {
        return this._countryCode;
    }
    set countryCode(value) {
        this._countryCode = value;
    }
    get countryName() {
        return this._countryName;
    }
    set countryName(value) {
        this._countryName = value;
    }
    get address() {
        return this._address;
    }
    set address(value) {
        this._address = value;
    }
    get timeZoneId() {
        return this._timeZoneId;
    }
    set timeZoneId(value) {
        this._timeZoneId = value;
    }
    get timeZoneName() {
        return this._timeZoneName;
    }
    set timeZoneName(value) {
        this._timeZoneName = value;
    }
    get rawOffset() {
        return this._rawOffset;
    }
    set rawOffset(value) {
        this._rawOffset = value;
    }
    get dstOffset() {
        return this._dstOffset;
    }
    set dstOffset(value) {
        this._dstOffset = value;
    }
}
class LocationBuilder {
    constructor(locationProvider, validator) {
        this._location = new Location();
        this._validtor = validator;
        this._locationProvider = locationProvider;
    }
    async setLocationCoordinates(lat, lng) {
        this._location.latitude = lat;
        this._location.longtitude = lng;
        return this;
    }
    async setLocationAddress(address, countryCode) {
        this._location.countryCode = countryCode;
        this._location.address = address;
        return this;
    }
    async createLocation() {
        let validationErr, validationResult = false;
        let providerErr, locationResult;
        [validationErr, validationResult] = await to(this._validtor.validate(this._location));
        if (validationErr)
            return Promise.reject(validationErr);
        if (validationResult) {
            if (!util_1.isNullOrUndefined(this._location.latitude))
                [providerErr, locationResult] = await to(this._locationProvider.getLocationByCoordinates(this._location.latitude, this._location.longtitude));
            else if ((!util_1.isNullOrUndefined(this._location.address))) {
                [providerErr, locationResult] = await to(this._locationProvider.getLocationByAddress(this._location.address, this._location.countryCode));
                if (providerErr)
                    return Promise.reject(providerErr);
                this._location = locationResult;
                return Promise.resolve(this._location);
            }
            else {
                return Promise.reject();
            }
        }
    }
}
class LocationBuilderFactory {
    //FACTORY to read from config default location proivder, and validator
    static createBuilderFactory(builderTypeName) {
        switch (builderTypeName) {
            case LocationTypeName.LocationBuilder:
                let providerName = provider.LocationProviderFactory.
                    createLocationProviderFactory(provider.LocationProviderName.GOOGLE);
                let validate = validator.ValidatorProviderFactory.
                    createValidateProvider(validator.ValidatorProviders.LocationValidator);
                return new LocationBuilder(providerName, validate);
        }
    }
}
exports.LocationBuilderFactory = LocationBuilderFactory;
