"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
class Location {
    constructor(location, timeZone) {
        if (location !== null) {
            this._latitude = location.latitude;
            this.longtitude - location.longtitude;
            this._countryCode = location.countryCode;
            this._countryName = location.countryName;
            this._address = location.address;
        }
        if (timeZone !== null) {
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
exports.Location = Location;
class LocationValidator {
    static async validateLocation(location) {
        return true;
    }
}
class LocationBuilder {
    constructor(locationProvider) {
        this._location = new Location();
    }
    async setLocationCoordinates(lat, lng) {
        return this;
    }
    async setLocationAddress(address, countryCode) {
        return this;
    }
    async setLocationTimeZone(lat, lng) {
        return this;
    }
    async createLocation() {
        return this._location;
    }
}
exports.LocationBuilder = LocationBuilder;
