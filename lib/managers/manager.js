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
const ramda = require("ramda");
const location = __importStar(require("../entities/location"));
const prayer = __importStar(require("../entities/prayer"));
const pp = __importStar(require("../providers/prayer-provider"));
const lp = __importStar(require("../providers/location-provider"));
const val = require("../validators/validator");
var validators = val.validators;
const util_1 = require("util");
class PrayerSettingsBuilder {
    constructor(prayerProvider, validator, prayerConfig) {
        this._prayerProvider = prayerProvider;
        this._validtor = validator;
        this._prayerSettings = new prayer.PrayersSettings();
        this._prayerSettings.midnight.id = util_1.isNullOrUndefined(prayerConfig.midnight) ? prayer.MidnightMode.Standard : prayerConfig.midnight;
        this._prayerSettings.method.id = util_1.isNullOrUndefined(prayerConfig.method) ? prayer.Methods.Gulf : prayerConfig.method;
        this._prayerSettings.adjustments = util_1.isNullOrUndefined(prayerConfig.adjustments) ? this._prayerSettings.adjustments : prayerConfig.adjustments;
        this._prayerSettings.school.id = util_1.isNullOrUndefined(prayerConfig.school) ? prayer.Schools.Hanafi : prayerConfig.school;
        this._prayerSettings.latitudeAdjustment.id = util_1.isNullOrUndefined(prayerConfig.latitudeAdjustment) ? prayer.LatitudeMethod.Angle : prayerConfig.latitudeAdjustment;
        this._prayerSettings.startDate = util_1.isNullOrUndefined(prayerConfig.startDate) ? this._prayerSettings.startDate : prayerConfig.startDate;
        this._prayerSettings.endDate = util_1.isNullOrUndefined(prayerConfig.endDate) ? this._prayerSettings.endDate : prayerConfig.endDate;
    }
    setPrayerMethod(methodId) {
        this._prayerSettings.method.id = methodId;
        return this;
    }
    setPrayerSchool(schoolId) {
        this._prayerSettings.school.id = schoolId;
        return this;
    }
    setPrayerAdjustments(adjustments) {
        this._prayerSettings.adjustments = adjustments;
        return this;
    }
    setPrayerMidnight(midnightId) {
        this._prayerSettings.midnight.id = midnightId;
        return this;
    }
    setPrayerPeriod(startDate, endDate) {
        this._prayerSettings.startDate = startDate;
        this._prayerSettings.endDate = endDate;
        return this;
    }
    async createPrayerSettings() {
        let validationErr;
        let validationResult = false;
        [validationErr, validationResult] = await to(this._validtor.validate(this._prayerSettings));
        if (validationErr)
            return Promise.reject(validationErr);
        if (validationResult) {
            try {
                console.log(this._prayerSettings.method.id);
                this._prayerSettings.method = await this._prayerProvider.getPrayerMethodsById(this._prayerSettings.method.id);
                this._prayerSettings.latitudeAdjustment = await this._prayerProvider.getPrayerLatitudeById(this._prayerSettings.latitudeAdjustment.id);
                this._prayerSettings.midnight = await this._prayerProvider.getPrayerMidnightById(this._prayerSettings.midnight.id);
                this._prayerSettings.school = await this._prayerProvider.getPrayerSchoolsById(this._prayerSettings.school.id);
                return this._prayerSettings;
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
    }
    static createPrayerSettingsBuilder(prayerConfig, prayerProvider) {
        let prayerProviderName = pp.PrayerProviderFactory
            .createPrayerProviderFactory(pp.PrayerProviderName.PRAYER_TIME);
        let validate = validators.PrayerSettingsValidator.createValidator();
        return new PrayerSettingsBuilder(prayerProviderName, validate, prayerConfig);
    }
}
exports.PrayerSettingsBuilder = PrayerSettingsBuilder;
class LocationBuilder {
    constructor(locationProvider, validator) {
        this._locationProvider = locationProvider;
        this._validtor = validator;
        this._location = new location.Location();
    }
    setLocationCoordinates(lat, lng) {
        this._location.latitude = lat;
        this._location.longtitude = lng;
        return this;
    }
    setLocationAddress(address, countryCode) {
        this._location.countryCode = countryCode;
        this._location.address = address;
        return this;
    }
    async createLocation() {
        let validationErr, validationResult = false;
        let providerErr, locationResult, timezoneResult;
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
                [providerErr, timezoneResult] = await to(this._locationProvider.getTimeZoneByCoordinates(locationResult.latitude, locationResult.longtitude));
                if (providerErr)
                    return Promise.reject(providerErr);
                this._location = ramda.mergeWith(ramda.concat, locationResult, timezoneResult);
                return Promise.resolve(this._location);
            }
            else {
                return Promise.reject();
            }
        }
    }
    static createLocationBuilder(locationConfig, ILocationProvider) {
        let providerName = lp.LocationProviderFactory.
            createLocationProviderFactory(lp.LocationProviderName.GOOGLE);
        let validate = validators.LocationValidator.createValidator();
        return new LocationBuilder(providerName, validate);
    }
}
exports.LocationBuilder = LocationBuilder;
class PrayerTimeBuilder {
    constructor(locationBuilder, prayerSettingsBuilder) {
        this._prayerSettingsBuilder = prayerSettingsBuilder;
        this._locationBuilder = locationBuilder;
        this._prayers = new Array();
    }
    setPrayerMethod(methodId) {
        this._prayerSettingsBuilder.setPrayerMethod(methodId);
        return this;
    }
    setPrayerSchool(schoolId) {
        this._prayerSettingsBuilder.setPrayerSchool(schoolId);
        return this;
    }
    setPrayerAdjustments(adjustments) {
        this._prayerSettingsBuilder.setPrayerAdjustments(adjustments);
        return this;
    }
    setPrayerMidnight(midnightId) {
        this._prayerSettingsBuilder.setPrayerMidnight(midnightId);
        return this;
    }
    setPrayerPeriod(startDate, endDate) {
        this._prayerSettingsBuilder.setPrayerPeriod(startDate, endDate);
        return this;
    }
    setLocationCoordinates(lat, lng) {
        this._locationBuilder.setLocationCoordinates(lat, lng);
        return this;
    }
    setLocationAddress(address, countryCode) {
        this._locationBuilder.setLocationAddress(address, countryCode);
        return this;
    }
    createPrayerTime() {
        let location, prayerSettings;
        try {
            return Promise.resolve(new prayer.PrayersTime(this._prayers, location, prayerSettings));
        }
        catch (err) {
            Promise.reject(err);
        }
    }
    static createLocationBuilder(locationConfig, prayerConfig) {
        let locationBuilder = LocationBuilder
            .createLocationBuilder(util_1.isNullOrUndefined(locationConfig) ? null : locationConfig);
        let prayerSettingsBuilder = PrayerSettingsBuilder
            .createPrayerSettingsBuilder(util_1.isNullOrUndefined(prayerConfig) ? null : prayerConfig);
        return new PrayerTimeBuilder(locationBuilder, prayerSettingsBuilder);
    }
}
