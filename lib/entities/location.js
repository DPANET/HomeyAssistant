"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const isNullOrUndefined_1 = require("../util/isNullOrUndefined");
const serializr_1 = require("serializr");
var LocationTypeName;
(function (LocationTypeName) {
    LocationTypeName["LocationBuilder"] = "Location Builder";
})(LocationTypeName = exports.LocationTypeName || (exports.LocationTypeName = {}));
;
class Location {
    constructor(location, timeZone) {
        if (!isNullOrUndefined_1.isNullOrUndefined(location)) {
            this._latitude = location.latitude;
            this._longtitude = location.longtitude;
            this._countryCode = location.countryCode;
            this._countryName = location.countryName;
            this._address = location.address;
        }
        if (!isNullOrUndefined_1.isNullOrUndefined(timeZone)) {
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
__decorate([
    serializr_1.serializable
], Location.prototype, "latitude", null);
__decorate([
    serializr_1.serializable
], Location.prototype, "longtitude", null);
__decorate([
    serializr_1.serializable
], Location.prototype, "city", null);
__decorate([
    serializr_1.serializable
], Location.prototype, "countryCode", null);
__decorate([
    serializr_1.serializable
], Location.prototype, "countryName", null);
__decorate([
    serializr_1.serializable
], Location.prototype, "address", null);
__decorate([
    serializr_1.serializable
], Location.prototype, "timeZoneId", null);
__decorate([
    serializr_1.serializable
], Location.prototype, "timeZoneName", null);
__decorate([
    serializr_1.serializable
], Location.prototype, "rawOffset", null);
__decorate([
    serializr_1.serializable
], Location.prototype, "dstOffset", null);
exports.Location = Location;
