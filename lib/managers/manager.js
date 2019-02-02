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
;
class PrayerSettingsBuilder {
    constructor(prayerProvider, validator, prayerConfig) {
        this._prayerProvider = prayerProvider;
        this._validtor = validator;
        this._prayerSettings = new prayer.PrayersSettings();
        this._prayerSettings.midnight.id = util_1.isNullOrUndefined(prayerConfig.midnight) ? prayer.MidnightMode.Standard : prayerConfig.midnight;
        this._prayerSettings.method.id = util_1.isNullOrUndefined(prayerConfig.method) ? prayer.Methods.Mecca : prayerConfig.method;
        this._prayerSettings.adjustments = util_1.isNullOrUndefined(prayerConfig.adjustments) ? this._prayerSettings.adjustments : prayerConfig.adjustments;
        this._prayerSettings.school.id = util_1.isNullOrUndefined(prayerConfig.school) ? prayer.Schools.Shafi : prayerConfig.school;
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
    setPrayerLatitudeAdjustment(latitudeAdjustment) {
        this._prayerSettings.latitudeAdjustment.id = latitudeAdjustment;
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
;
;
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
;
;
class PrayerTimeBuilder {
    constructor(prayerProvider, locationBuilder, prayerSettingsBuilder) {
        this._prayerSettingsBuilder = prayerSettingsBuilder;
        this._locationBuilder = locationBuilder;
        this._prayerProvider = prayerProvider;
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
    setPrayerLatitudeAdjustment(latitudeAdjustment) {
        this._prayerSettingsBuilder.setPrayerLatitudeAdjustment(latitudeAdjustment);
        return this;
    }
    setPrayerPeriod(startDate, endDate) {
        this._prayerSettingsBuilder.setPrayerPeriod(startDate, endDate);
        return this;
    }
    setLocationByCoordinates(lat, lng) {
        this._locationBuilder.setLocationCoordinates(lat, lng);
        return this;
    }
    setLocationByAddress(address, countryCode) {
        this._locationBuilder.setLocationAddress(address, countryCode);
        return this;
    }
    async createPrayerTime() {
        let location, prayerSettings;
        try {
            location = await this._locationBuilder.createLocation();
            prayerSettings = await this._prayerSettingsBuilder.createPrayerSettings();
            this._prayers = await this._prayerProvider.getPrayerTime(prayerSettings, location);
            return Promise.resolve(new prayer.PrayersTime(this._prayers, location, prayerSettings));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    static createPrayerTimeBuilder(locationConfig, prayerConfig) {
        let prayerProvider = pp.PrayerProviderFactory.createPrayerProviderFactory(pp.PrayerProviderName.PRAYER_TIME);
        let locationBuilder = LocationBuilder
            .createLocationBuilder(util_1.isNullOrUndefined(locationConfig) ? null : locationConfig);
        let prayerSettingsBuilder = PrayerSettingsBuilder
            .createPrayerSettingsBuilder(util_1.isNullOrUndefined(prayerConfig) ? null : prayerConfig);
        return new PrayerTimeBuilder(prayerProvider, locationBuilder, prayerSettingsBuilder);
    }
}
exports.PrayerTimeBuilder = PrayerTimeBuilder;
;
var PrayerEvents;
(function (PrayerEvents) {
    PrayerEvents["IMSAK"] = "Imsak";
    PrayerEvents["FAJR"] = "Fajr";
    PrayerEvents["SUNRISE"] = "Sunrise";
    PrayerEvents["DHUHR"] = "Dhuhr";
    PrayerEvents["ASR"] = "Asr";
    PrayerEvents["MAGHRIB"] = "Maghrib";
    PrayerEvents["SUNSET"] = "Sunset";
    PrayerEvents["ISHA"] = "Isha";
    PrayerEvents["MIDNIGHT"] = "Midnight";
})(PrayerEvents = exports.PrayerEvents || (exports.PrayerEvents = {}));
(function (PrayerEvents) {
    PrayerEvents[PrayerEvents["OnPrayerTime"] = 0] = "OnPrayerTime";
})(PrayerEvents = exports.PrayerEvents || (exports.PrayerEvents = {}));
class PrayerManager {
    setAutoReferesh(autoRefresh) {
        throw new Error("Method not implemented.");
    }
    getUpcomingPrayerTimeRemaining() {
        throw new Error("Method not implemented.");
    }
    getPrviouesPrayerTimeElapsed() {
        throw new Error("Method not implemented.");
    }
    registerListener(eventName) {
        throw new Error("Method not implemented.");
    }
    removeListener() {
        throw new Error("Method not implemented.");
    }
    getPrayerConfig() {
        throw new Error("Method not implemented.");
    }
    getLocationConfig() {
        throw new Error("Method not implemented.");
    }
    constructor(prayerTime) {
        this._prayerTime = prayerTime;
        this._prayerEvents = new prayer.PrayerEvents();
        this._autoRefresh = true;
    }
    getPrayerTime(prayerName, prayerDate) {
        return;
    }
    startPrayerSchedule() {
        if (!this._cron.running)
            this._cron.start();
    }
    stopPrayerSchedule() {
        if (this._cron.running)
            this._cron.stop();
    }
    getUpcomingPrayer(prayerType) {
        let dateNow = new Date();
        let fnDayMatch = (n) => (dateNow.getFullYear() == n.prayersDate.getFullYear()) &&
            (dateNow.getMonth() === n.prayersDate.getMonth()) &&
            (dateNow.getDay() === n.prayersDate.getDay());
        let orderBy = ramda.sortBy(ramda.prop('prayerTime'));
        let fardhPrayers = prayer.PrayersTypes.filter((n) => n.prayerType === prayer.PrayerType.Fardh);
        let filterPrayer = this._prayerTime.prayers.filter(fnDayMatch);
        if (filterPrayer.length === 1) {
            let prayersToday = filterPrayer.pop();
            let listOfPrayers = orderBy(prayersToday.prayerTime);
            //listOfPrayers.filter()
            //ramda.find()
        }
        return;
    }
    getPreviousPrayer() {
        return;
    }
}
exports.PrayerManager = PrayerManager;
