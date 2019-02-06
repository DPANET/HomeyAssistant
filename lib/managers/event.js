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
const util_1 = require("util");
const cron = __importStar(require("cron"));
const utility_1 = require("../util/utility");
class EventProvider {
    constructor() {
        this._observers = new Array();
    }
    registerListener(observer) {
        this._observers.push(observer);
    }
    removeListener(observer) {
        this._observers.splice(this._observers.indexOf(observer, 1));
    }
    notifyObservers(value, error) {
        for (let i of this._observers) {
            if (!util_1.isNullOrUndefined(error))
                i.onNext(value);
            else
                i.onError(error);
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
    notifyObservers(prayersTime, error) {
        super.notifyObservers(prayersTime, error);
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
        let prayerTiming = this._prayerManager.getUpcomingPrayer();
        debug(prayerTiming);
        this._upcomingPrayerEvent = new cron.CronJob(prayerTiming.prayerTime, () => {
            this.notifyObservers(prayerTiming, null);
        }, null, true);
        this._upcomingPrayerEvent.addCallback(() => { setTimeout(() => this.runNextPrayerSchedule(), 60000); });
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
    notifyObservers(prayersTime, error) {
        super.notifyObservers(prayersTime, error);
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
        this._refreshPrayersEvent = new cron.CronJob(this._prayerManager.getPrayerEndPeriond(), async () => {
            await this.scheduleRefresh();
        }, null, true);
        this._refreshPrayersEvent.addCallback(() => { setTimeout(() => this.runNextPrayerSchedule(), 3000); });
    }
    async scheduleRefresh() {
        let startDate = this._prayerManager.getPrayerStartPeriod();
        let endDate = this._prayerManager.getPrayerEndPeriond();
        startDate = utility_1.DateUtil.addDay(1, startDate);
        endDate = utility_1.DateUtil.addMonth(1, endDate);
        try {
            this._prayerManager = await this._prayerManager.updatePrayersDate(startDate, endDate);
            this.notifyObservers(this._prayerManager);
        }
        catch (err) {
            this.notifyObservers(null, err);
        }
    }
}
exports.PrayersRefreshEventProvider = PrayersRefreshEventProvider;
class PrayerRefreshEventListener {
    constructor() {
    }
    onCompleted() {
    }
    onError(error) {
        debug(error);
    }
    onNext(value) {
        debug(value);
    }
}
exports.PrayerRefreshEventListener = PrayerRefreshEventListener;
