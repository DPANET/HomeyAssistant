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
const prayer = __importStar(require("../entities/prayer"));
const util_1 = require("util");
const cron = __importStar(require("cron"));
class EventProvider {
    constructor() {
        this._observers = new Array();
    }
    registerListener(observer) {
        this._observers.splice(this._observers.indexOf(observer, 1));
    }
    removeListener(observer) {
        throw new Error("Method not implemented.");
    }
    notifyObservers(value) {
        for (let i of this._observers) {
            i.onNext(value);
        }
    }
}
class PrayersEventProvider extends EventProvider {
    constructor(prayerManager) {
        super();
        this._prayerManager = prayerManager;
    }
    registerListener(observer) {
        super.registerListener(observer);
    }
    removeListener(observer) {
        super.removeListener(observer);
    }
    notifyObservers(prayersTime) {
        super.notifyObservers(prayersTime);
    }
    startPrayerSchedule() {
        if (util_1.isNullOrUndefined(this._upcomingPrayerEvent) || !this._upcomingPrayerEvent.start) {
            this.runNextPrayerSchedule();
        }
    }
    stopPrayerSchedule() {
        if (this._upcomingPrayerEvent.running)
            this._upcomingPrayerEvent.stop();
    }
    runNextPrayerSchedule() {
        let dateNow = new Date();
        dateNow.setSeconds(dateNow.getUTCSeconds() + 10);
        this._upcomingPrayerEvent = new cron.CronJob(dateNow, () => {
            this.notifyObservers({ prayerName: prayer.PrayersName.FAJR, prayerTime: dateNow });
        }, null, true);
        this._upcomingPrayerEvent.addCallback(() => { setTimeout(() => this.runNextPrayerSchedule(), 3000); });
    }
}
exports.PrayersEventProvider = PrayersEventProvider;
class PrayersEventListener {
    constructor() {
    }
    onCompleted() {
        throw new Error("Method not implemented.");
    }
    onError(error) {
        throw new Error("Method not implemented.");
    }
    onNext(value) {
        console.log(value);
    }
}
exports.PrayersEventListener = PrayersEventListener;
class PrayersRefreshEventProvider extends EventProvider {
    constructor(prayerManager) {
        super();
        this._prayerManager = prayerManager;
    }
    registerListener(observer) {
        super.registerListener(observer);
    }
    removeListener(observer) {
        super.removeListener(observer);
    }
    notifyObservers(prayersTime) {
        super.notifyObservers(prayersTime);
    }
    startPrayerSchedule() {
        if (util_1.isNullOrUndefined(this._refreshPrayersEvent) || !this._refreshPrayersEvent.start) {
            this.runNextPrayerSchedule();
        }
    }
    stopPrayerSchedule() {
        if (this._refreshPrayersEvent.running)
            this._refreshPrayersEvent.stop();
    }
    runNextPrayerSchedule() {
        let dateNow = new Date();
        dateNow.setSeconds(dateNow.getUTCSeconds() + 10);
        this._refreshPrayersEvent = new cron.CronJob(dateNow, () => {
            this.notifyObservers(this._prayerManager);
        }, null, true);
        this._refreshPrayersEvent.addCallback(() => { setTimeout(() => this.runNextPrayerSchedule(), 3000); });
    }
}
exports.PrayersRefreshEventProvider = PrayersRefreshEventProvider;
class PrayerRefreshEventListener {
    constructor() {
    }
    onCompleted() {
        throw new Error("Method not implemented.");
    }
    onError(error) {
        throw new Error("Method not implemented.");
    }
    onNext(value) {
        console.log(value);
    }
}
exports.PrayerRefreshEventListener = PrayerRefreshEventListener;
