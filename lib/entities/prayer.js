"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const location_1 = require("./location");
const isNullOrUndefined_1 = require("../util/isNullOrUndefined");
const serializr_1 = require("serializr");
var PrayersName;
(function (PrayersName) {
    PrayersName["IMSAK"] = "Imsak";
    PrayersName["FAJR"] = "Fajr";
    PrayersName["SUNRISE"] = "Sunrise";
    PrayersName["DHUHR"] = "Dhuhr";
    PrayersName["ASR"] = "Asr";
    PrayersName["MAGHRIB"] = "Maghrib";
    PrayersName["SUNSET"] = "Sunset";
    PrayersName["ISHA"] = "Isha";
    PrayersName["MIDNIGHT"] = "Midnight";
})(PrayersName = exports.PrayersName || (exports.PrayersName = {}));
;
var Schools;
(function (Schools) {
    Schools[Schools["Shafi"] = 0] = "Shafi";
    Schools[Schools["Hanafi"] = 1] = "Hanafi";
})(Schools = exports.Schools || (exports.Schools = {}));
;
var MidnightMode;
(function (MidnightMode) {
    MidnightMode[MidnightMode["Standard"] = 0] = "Standard";
    MidnightMode[MidnightMode["Jafari"] = 1] = "Jafari";
})(MidnightMode = exports.MidnightMode || (exports.MidnightMode = {}));
;
var AdjsutmentMethod;
(function (AdjsutmentMethod) {
    AdjsutmentMethod[AdjsutmentMethod["Provider"] = 0] = "Provider";
    AdjsutmentMethod[AdjsutmentMethod["Server"] = 1] = "Server";
    AdjsutmentMethod[AdjsutmentMethod["Client"] = 2] = "Client";
})(AdjsutmentMethod = exports.AdjsutmentMethod || (exports.AdjsutmentMethod = {}));
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
    Methods[Methods["Karachi"] = 1] = "Karachi";
    Methods[Methods["America"] = 2] = "America";
    Methods[Methods["MuslimLeague"] = 3] = "MuslimLeague";
    Methods[Methods["Mecca"] = 4] = "Mecca";
    Methods[Methods["Egypt"] = 5] = "Egypt";
    Methods[Methods["Iran"] = 7] = "Iran";
    Methods[Methods["Gulf"] = 8] = "Gulf";
    Methods[Methods["Kuwait"] = 9] = "Kuwait";
    Methods[Methods["Qatar"] = 10] = "Qatar";
    Methods[Methods["Singapore"] = 11] = "Singapore";
    Methods[Methods["France"] = 12] = "France";
    Methods[Methods["Turkey"] = 13] = "Turkey";
    Methods[Methods["Custom"] = 99] = "Custom";
})(Methods = exports.Methods || (exports.Methods = {}));
;
var PrayerType;
(function (PrayerType) {
    PrayerType["Fardh"] = "Fardh";
    PrayerType["Sunna"] = "Sunna";
})(PrayerType = exports.PrayerType || (exports.PrayerType = {}));
exports.PrayersTypes = [
    { prayerName: PrayersName.FAJR, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.DHUHR, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.ASR, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.MAGHRIB, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.ISHA, prayerType: PrayerType.Fardh },
    { prayerName: PrayersName.SUNRISE, prayerType: PrayerType.Sunna },
    { prayerName: PrayersName.SUNSET, prayerType: PrayerType.Sunna },
    { prayerName: PrayersName.IMSAK, prayerType: PrayerType.Sunna },
    { prayerName: PrayersName.MIDNIGHT, prayerType: PrayerType.Sunna },
];
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
__decorate([
    serializr_1.serializable(serializr_1.identifier())
], PrayerAdjustment.prototype, "prayerName", null);
__decorate([
    serializr_1.serializable
], PrayerAdjustment.prototype, "adjustments", null);
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
__decorate([
    serializr_1.serializable(serializr_1.identifier())
], PrayersMidnight.prototype, "id", null);
__decorate([
    serializr_1.serializable
], PrayersMidnight.prototype, "midnight", null);
class PrayerAdjustmentMethod {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get adjustmentMethod() {
        return this._adjustmentMethod;
    }
    set adjustmentMethod(value) {
        this._adjustmentMethod = value;
    }
}
__decorate([
    serializr_1.serializable(serializr_1.identifier())
], PrayerAdjustmentMethod.prototype, "id", null);
__decorate([
    serializr_1.serializable
], PrayerAdjustmentMethod.prototype, "adjustmentMethod", null);
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
__decorate([
    serializr_1.serializable(serializr_1.identifier())
], PrayerLatitude.prototype, "id", null);
__decorate([
    serializr_1.serializable
], PrayerLatitude.prototype, "latitudeMethod", null);
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
__decorate([
    serializr_1.serializable(serializr_1.identifier())
], PrayerSchools.prototype, "id", null);
__decorate([
    serializr_1.serializable
], PrayerSchools.prototype, "school", null);
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
__decorate([
    serializr_1.serializable(serializr_1.identifier())
], PrayersMethods.prototype, "id", null);
__decorate([
    serializr_1.serializable
], PrayersMethods.prototype, "methodName", null);
class PrayersTiming {
    get prayerName() {
        return this._prayerName;
    }
    set prayerName(value) {
        this._prayerName = value;
    }
    get prayerTime() {
        return this._prayerTime;
    }
    set prayerTime(value) {
        this._prayerTime = value;
    }
}
__decorate([
    serializr_1.serializable(serializr_1.identifier())
], PrayersTiming.prototype, "prayerName", null);
__decorate([
    serializr_1.serializable(serializr_1.date())
], PrayersTiming.prototype, "prayerTime", null);
exports.PrayersTiming = PrayersTiming;
class Prayers {
    constructor(prayerTime) {
        if (!isNullOrUndefined_1.isNullOrUndefined(prayerTime))
            this._prayerTime = prayerTime;
        else
            this._prayerTime = new Array();
    }
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
    toJSON() {
        return {
            prayerTime: this._prayerTime,
            prayersDate: this._prayersDate
        };
    }
}
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.object(PrayersTiming)))
], Prayers.prototype, "prayerTime", null);
__decorate([
    serializr_1.serializable(serializr_1.date())
], Prayers.prototype, "prayersDate", null);
exports.Prayers = Prayers;
class PrayersSettings {
    constructor(prayersSettings) {
        if (!isNullOrUndefined_1.isNullOrUndefined(prayersSettings))
            this._prayersSettings = prayersSettings;
        else {
            this._method = new PrayersMethods();
            this._adjustments = new Array();
            this._midnight = new PrayersMidnight();
            this._school = new PrayerSchools();
            this._adjustmentMethod = new PrayerAdjustmentMethod();
            this._latitudeAdjustment = new PrayerLatitude();
        }
    }
    get adjustmentMethod() {
        return this._adjustmentMethod;
    }
    set adjustmentMethod(value) {
        this._adjustmentMethod = value;
    }
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
    toJSON() {
        return {
            midnight: this._midnight,
            school: this._school,
            latitudeAdjustment: this._latitudeAdjustment,
            method: this._method,
            startDate: this._startDate,
            adjustmentMethod: this._adjustmentMethod,
            endDate: this._endDate,
            adjustments: this._adjustments
        };
    }
}
__decorate([
    serializr_1.serializable(serializr_1.object(PrayerAdjustmentMethod))
], PrayersSettings.prototype, "adjustmentMethod", null);
__decorate([
    serializr_1.serializable(serializr_1.date())
], PrayersSettings.prototype, "startDate", null);
__decorate([
    serializr_1.serializable(serializr_1.date())
], PrayersSettings.prototype, "endDate", null);
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.object(PrayerAdjustment)))
], PrayersSettings.prototype, "adjustments", null);
__decorate([
    serializr_1.serializable(serializr_1.object(PrayersMethods))
], PrayersSettings.prototype, "method", null);
__decorate([
    serializr_1.serializable(serializr_1.object(PrayerSchools))
], PrayersSettings.prototype, "school", null);
__decorate([
    serializr_1.serializable(serializr_1.object(PrayersMidnight))
], PrayersSettings.prototype, "midnight", null);
__decorate([
    serializr_1.serializable(serializr_1.object(PrayerLatitude))
], PrayersSettings.prototype, "latitudeAdjustment", null);
exports.PrayersSettings = PrayersSettings;
class PrayersTime {
    //prayer constructors, with timing,
    constructor(prayers, locationSettings, prayerConfig) {
        this._location = locationSettings;
        this._prayers = prayers;
        this._pareyerSettings = prayerConfig;
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
__decorate([
    serializr_1.serializable(serializr_1.object(location_1.Location))
], PrayersTime.prototype, "location", null);
__decorate([
    serializr_1.serializable(serializr_1.object(PrayersSettings))
], PrayersTime.prototype, "pareyerSettings", null);
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.object(Prayers)))
], PrayersTime.prototype, "prayers", null);
exports.PrayersTime = PrayersTime;
