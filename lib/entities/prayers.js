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
const pp = __importStar(require("../providers/prayer-provider"));
const val = require("../validators/validator");
var validators = val.validators;
const util_1 = require("util");
var PrayersName;
(function (PrayersName) {
    PrayersName["FAJR"] = "Fajr";
    PrayersName["SUNRISE"] = "Sunrise";
    PrayersName["DHUHR"] = "Dhuhr";
    PrayersName["ASR"] = "Asr";
    PrayersName["SUNSET"] = "Sunset";
    PrayersName["MAGHRIB"] = "Maghrib";
    PrayersName["ISHA"] = "Isha";
    PrayersName["IMSAK"] = "Imsak";
    PrayersName["MIDNIGHT"] = "Midnight";
})(PrayersName = exports.PrayersName || (exports.PrayersName = {}));
;
var Schools;
(function (Schools) {
    Schools[Schools["Hanafi"] = 0] = "Hanafi";
    Schools[Schools["Shafi"] = 1] = "Shafi";
})(Schools = exports.Schools || (exports.Schools = {}));
;
var MidnightMode;
(function (MidnightMode) {
    MidnightMode[MidnightMode["Standard"] = 0] = "Standard";
    MidnightMode[MidnightMode["Jafari"] = 1] = "Jafari";
})(MidnightMode = exports.MidnightMode || (exports.MidnightMode = {}));
;
var LatitudeMethod;
(function (LatitudeMethod) {
    LatitudeMethod[LatitudeMethod["MidNight"] = 1] = "MidNight";
    LatitudeMethod[LatitudeMethod["Seventh"] = 2] = "Seventh";
    LatitudeMethod[LatitudeMethod["Angle"] = 3] = "Angle";
})(LatitudeMethod = exports.LatitudeMethod || (exports.LatitudeMethod = {}));
;
var Methods;
(function (Methods) {
    Methods[Methods["Shia"] = 0] = "Shia";
    Methods[Methods["Karchi"] = 1] = "Karchi";
    Methods[Methods["America"] = 2] = "America";
    Methods[Methods["MuslimLeague"] = 3] = "MuslimLeague";
    Methods[Methods["Makka"] = 4] = "Makka";
    Methods[Methods["Egypt"] = 5] = "Egypt";
    Methods[Methods["Iran"] = 6] = "Iran";
    Methods[Methods["Gulf"] = 7] = "Gulf";
    Methods[Methods["Kuwait"] = 8] = "Kuwait";
    Methods[Methods["Qatar"] = 9] = "Qatar";
    Methods[Methods["Singapore"] = 10] = "Singapore";
    Methods[Methods["France"] = 11] = "France";
    Methods[Methods["Turkey"] = 12] = "Turkey";
    Methods[Methods["Custom"] = 99] = "Custom";
})(Methods = exports.Methods || (exports.Methods = {}));
;
class PrayerAdjustment {
    get prayerName() {
        return this._prayerName;
    }
    set prayerName(value) {
        this._prayerName = value;
    }
    get adjustments() {
        return this._adjustments;
    }
    set adjustments(value) {
        this._adjustments = value;
    }
}
class PrayersMidnight {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get midnight() {
        return this._midnight;
    }
    set midnight(value) {
        this._midnight = value;
    }
}
class PrayerLatitude {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get latitudeMethod() {
        return this._latitudeMethod;
    }
    set latitudeMethod(value) {
        this._latitudeMethod = value;
    }
}
class PrayerSchools {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get school() {
        return this._school;
    }
    set school(value) {
        this._school = value;
    }
}
class PrayersMethods {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get methodName() {
        return this._methodName;
    }
    set methodName(value) {
        this._methodName = value;
    }
}
class Prayers {
    get prayerTime() {
        return this._prayerTime;
    }
    set prayerTime(value) {
        this._prayerTime = value;
    }
    get prayersDate() {
        return this._prayersDate;
    }
    set prayersDate(value) {
        this._prayersDate = value;
    }
}
class PrayersTime {
    //prayer constructors, with timing,
    constructor(prayers) {
        this._prayers = prayers;
        // this._prayersTimings = new Array();
    }
    get location() {
        return this._location;
    }
    set location(value) {
        this._location = value;
    }
    get pareyerSettings() {
        return this._pareyerSettings;
    }
    set pareyerSettings(value) {
        this._pareyerSettings = value;
    }
    get prayers() {
        return this._prayers;
    }
    set prayers(value) {
        this._prayers = value;
    }
}
class PrayersSettings {
    get startDate() {
        return this._startDate;
    }
    set startDate(value) {
        this._startDate = value;
    }
    get endDate() {
        return this._endDate;
    }
    set endDate(value) {
        this._endDate = value;
    }
    get adjustments() {
        return this._adjustments;
    }
    set adjustments(value) {
        this._adjustments = value;
    }
    get method() {
        return this._method;
    }
    set method(value) {
        this._method = value;
    }
    get school() {
        return this._school;
    }
    set school(value) {
        this._school = value;
    }
    get midnight() {
        return this._midnight;
    }
    set midnight(value) {
        this._midnight = value;
    }
    get latitudeAdjustment() {
        return this._latitudeAdjustment;
    }
    set latitudeAdjustment(value) {
        this._latitudeAdjustment = value;
    }
    constructor(prayersSettings) {
        if (!util_1.isNullOrUndefined(prayersSettings))
            this._prayersSettings = prayersSettings;
        else {
            this._method = new PrayersMethods();
            this._adjustments = new Array();
            this._midnight = new PrayersMidnight();
            this._school = new PrayerSchools();
        }
    }
}
class PrayerTimeBuilder {
    constructor(prayerConfig, locationConfig) {
    }
}
class PrayerSettingsBuilder {
    constructor(prayerProvider, validator, prayerConfig) {
        this._prayerProvider = prayerProvider;
        this._validtor = validator;
        this._prayerSettings = new PrayersSettings();
        this._prayerSettings.midnight.id = prayerConfig.midnight;
        this._prayerSettings.adjustments = util_1.isNullOrUndefined(prayerConfig.adjustments) ? this._prayerSettings.adjustments : prayerConfig.adjustments;
        this._prayerSettings.school.id = util_1.isNullOrUndefined(prayerConfig.school) ? Schools.Hanafi : prayerConfig.school;
        this._prayerSettings.latitudeAdjustment.id = util_1.isNullOrUndefined(prayerConfig.latitudeAdjustment) ? LatitudeMethod.Angle : prayerConfig.latitudeAdjustment;
        this._prayerSettings.startDate = util_1.isNullOrUndefined(prayerConfig.startDate) ? this._prayerSettings.startDate : prayerConfig.startDate;
        this._prayerSettings.endDate = util_1.isNullOrUndefined(prayerConfig.endDate) ? this._prayerSettings.endDate : prayerConfig.startDate;
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
