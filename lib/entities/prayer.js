"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
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
            this._latitudeAdjustment = new PrayerLatitude();
        }
    }
}
exports.PrayersSettings = PrayersSettings;
