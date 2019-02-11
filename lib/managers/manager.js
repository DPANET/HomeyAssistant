"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const utility_1 = require("../util/utility");
;
class PrayerSettingsBuilder {
    constructor(prayerProvider, validator, prayerConfig) {
        this._prayerProvider = prayerProvider;
        this._validtor = validator;
        this._prayerSettings = new prayer.PrayersSettings();
        if (!util_1.isNullOrUndefined(prayerConfig)) {
            this._prayerSettings.midnight.id = util_1.isNullOrUndefined(prayerConfig.midnight) ? prayer.MidnightMode.Standard : prayerConfig.midnight;
            this._prayerSettings.method.id = util_1.isNullOrUndefined(prayerConfig.method) ? prayer.Methods.Mecca : prayerConfig.method;
            this._prayerSettings.adjustments = util_1.isNullOrUndefined(prayerConfig.adjustments) ? this._prayerSettings.adjustments : prayerConfig.adjustments;
            this._prayerSettings.school.id = util_1.isNullOrUndefined(prayerConfig.school) ? prayer.Schools.Shafi : prayerConfig.school;
            this._prayerSettings.latitudeAdjustment.id = util_1.isNullOrUndefined(prayerConfig.latitudeAdjustment) ? prayer.LatitudeMethod.Angle : prayerConfig.latitudeAdjustment;
            this._prayerSettings.startDate = util_1.isNullOrUndefined(prayerConfig.startDate) ? utility_1.DateUtil.getNowDate() : prayerConfig.startDate;
            this._prayerSettings.endDate = util_1.isNullOrUndefined(prayerConfig.endDate) ? utility_1.DateUtil.addMonth(1, utility_1.DateUtil.getNowDate()) : prayerConfig.endDate;
        }
        else {
            this._prayerSettings.midnight.id = prayer.MidnightMode.Standard;
            this._prayerSettings.method.id = prayer.Methods.Mecca;
            this._prayerSettings.adjustments = this._prayerSettings.adjustments;
            this._prayerSettings.school.id = prayer.Schools.Shafi;
            this._prayerSettings.latitudeAdjustment.id = prayer.LatitudeMethod.Angle;
            this._prayerSettings.startDate = utility_1.DateUtil.getNowDate();
            this._prayerSettings.endDate = utility_1.DateUtil.addMonth(1, utility_1.DateUtil.getNowDate());
        }
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
    createPrayerSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            let validationErr;
            let validationResult = false;
            [validationErr, validationResult] = yield to(this._validtor.validate(this._prayerSettings));
            if (validationErr)
                return Promise.reject(validationErr);
            if (validationResult) {
                try {
                    this._prayerSettings.method = yield this._prayerProvider.getPrayerMethodsById(this._prayerSettings.method.id);
                    this._prayerSettings.latitudeAdjustment = yield this._prayerProvider.getPrayerLatitudeById(this._prayerSettings.latitudeAdjustment.id);
                    this._prayerSettings.midnight = yield this._prayerProvider.getPrayerMidnightById(this._prayerSettings.midnight.id);
                    this._prayerSettings.school = yield this._prayerProvider.getPrayerSchoolsById(this._prayerSettings.school.id);
                    return this._prayerSettings;
                }
                catch (error) {
                    return Promise.reject(error);
                }
            }
        });
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
    createLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            let validationErr, validationResult = false;
            let providerErr, locationResult, timezoneResult;
            [validationErr, validationResult] = yield to(this._validtor.validate(this._location));
            if (validationErr)
                return Promise.reject(validationErr);
            if (validationResult) {
                if (!util_1.isNullOrUndefined(this._location.latitude))
                    [providerErr, locationResult] = yield to(this._locationProvider.getLocationByCoordinates(this._location.latitude, this._location.longtitude));
                else if ((!util_1.isNullOrUndefined(this._location.address))) {
                    [providerErr, locationResult] = yield to(this._locationProvider.getLocationByAddress(this._location.address, this._location.countryCode));
                    if (providerErr)
                        return Promise.reject(providerErr);
                }
                [providerErr, timezoneResult] = yield to(this._locationProvider.getTimeZoneByCoordinates(locationResult.latitude, locationResult.longtitude));
                if (providerErr)
                    return Promise.reject(providerErr);
                this._location = ramda.mergeWith(ramda.concat, locationResult, timezoneResult);
                return Promise.resolve(this._location);
            }
            else {
                return Promise.reject();
            }
        });
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
    createPrayerTime() {
        return __awaiter(this, void 0, void 0, function* () {
            let location, prayerSettings;
            try {
                location = yield this._locationBuilder.createLocation();
                prayerSettings = yield this._prayerSettingsBuilder.createPrayerSettings();
                this._prayers = yield this._prayerProvider.getPrayerTime(prayerSettings, location);
                return Promise.resolve(new prayer.PrayersTime(this._prayers, location, prayerSettings));
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    createPrayerTimeManager() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let prayersTime = yield this.createPrayerTime();
                let prayerManager = new PrayerManager(prayersTime, this);
                return Promise.resolve(prayerManager);
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
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
class PrayerManager {
    constructor(prayerTime, prayerTimeBuilder) {
        this._prayerTime = prayerTime;
        this._prayerEvents = new prayer.PrayerEvents();
        this._prayerTimeBuilder = prayerTimeBuilder;
    }
    getPrayerTimeZone() {
        return {
            timeZoneId: this._prayerTime.location.timeZoneId,
            timeZoneName: this._prayerTime.location.timeZoneName,
            dstOffset: this._prayerTime.location.dstOffset,
            rawOffset: this._prayerTime.location.rawOffset
        };
    }
    getPrayerLocation() {
        return {
            latitude: this._prayerTime.location.latitude,
            longtitude: this._prayerTime.location.longtitude,
            city: this._prayerTime.location.city,
            countryCode: this._prayerTime.location.countryCode,
            countryName: this._prayerTime.location.countryName,
            address: this._prayerTime.location.address
        };
    }
    getPrayerStartPeriod() {
        return this._prayerTime.pareyerSettings.startDate;
    }
    getPrayerEndPeriond() {
        return utility_1.DateUtil.getEndofDate(this._prayerTime.pareyerSettings.endDate);
    }
    getUpcomingPrayerTimeRemaining() {
        throw new Error("Method not implemented.");
    }
    getPrviouesPrayerTimeElapsed() {
        throw new Error("Method not implemented.");
    }
    getPrayerConfig() {
        return {
            method: this._prayerTime.pareyerSettings.method.id,
            midnight: this._prayerTime.pareyerSettings.midnight.id,
            school: this._prayerTime.pareyerSettings.school.id,
            latitudeAdjustment: this._prayerTime.pareyerSettings.latitudeAdjustment.id,
            startDate: this.getPrayerStartPeriod(),
            endDate: this.getPrayerEndPeriond(),
            adjustments: this._prayerTime.pareyerSettings.adjustments
        };
    }
    getLocationConfig() {
        throw new Error("Method not implemented.");
    }
    getPrayerTime(prayerName, prayerDate) {
        let prayersByDate = this.getPrayersByDate(prayerDate);
        if (!util_1.isNullOrUndefined(prayersByDate)) {
            return ramda.find(n => n.prayerName === prayerName, prayersByDate.prayerTime);
        }
        return null;
    }
    getPrayersByDate(date) {
        let fnDayMatch = (n) => utility_1.DateUtil.dayMatch(date, n.prayersDate);
        return ramda.find(fnDayMatch, this._prayerTime.prayers);
    }
    getUpcomingPrayer(date, prayerType) {
        let dateNow;
        if (util_1.isNullOrUndefined(date))
            dateNow = utility_1.DateUtil.getNowDate();
        else
            dateNow = date;
        if (dateNow > this.getPrayerEndPeriond() || dateNow < this.getPrayerStartPeriod())
            return null;
        let orderByFn = ramda.sortBy(ramda.prop('prayerTime'));
        let upcomingPrayer = null;
        let fardhPrayers = prayer.PrayersTypes.filter((n) => n.prayerType === prayer.PrayerType.Fardh);
        let todayPrayers = this.getPrayersByDate(dateNow);
        if (!util_1.isNullOrUndefined(todayPrayers)) {
            let listOfPrayers = orderByFn(todayPrayers.prayerTime);
            //filter on fardh prayers.
            listOfPrayers = ramda.innerJoin((prayerLeft, prayerRight) => prayerLeft.prayerName === prayerRight.prayerName, listOfPrayers, fardhPrayers);
            //find next prayer based on prayertype
            for (let i = 0, prev, curr; i < listOfPrayers.length; i++) {
                prev = listOfPrayers[i], curr = listOfPrayers[i + 1];
                upcomingPrayer = this.processUpcomingPrayer(prev, curr, i + 1, listOfPrayers, dateNow);
                if (!util_1.isNullOrUndefined(upcomingPrayer))
                    return upcomingPrayer;
            }
        }
        return upcomingPrayer;
    }
    processUpcomingPrayer(prev, curr, index, array, dateNow) {
        if (prev.prayerTime >= dateNow)
            return array[index - 1];
        else if (!util_1.isNullOrUndefined(curr) && prev.prayerTime <= dateNow && curr.prayerTime >= dateNow)
            return array[index];
        else if (util_1.isNullOrUndefined(curr) && array.length === index) {
            let nextDay = utility_1.DateUtil.addDay(1, dateNow);
            if (nextDay > this.getPrayerEndPeriond())
                return null;
            return this.getPrayerTime(prayer.PrayersName.FAJR, nextDay);
        }
        return null;
    }
    getPreviousPrayer() {
        return;
    }
    updatePrayersDate(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._prayerTime = yield this._prayerTimeBuilder
                    .setPrayerPeriod(startDate, endDate)
                    .createPrayerTime();
                return this;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
}
exports.PrayerManager = PrayerManager;
