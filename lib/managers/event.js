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
            if (util_1.isNullOrUndefined(error))
                i.onNext(value);
            else
                i.onError(error);
        }
    }
}
exports.EventProvider = EventProvider;
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
        if (util_1.isNullOrUndefined(this._upcomingPrayerEvent) || !this._upcomingPrayerEvent.running) {
            this.runNextPrayerSchedule();
        }
    }
    stopPrayerSchedule() {
        if (this._upcomingPrayerEvent.running)
            this._upcomingPrayerEvent.stop();
    }
    runNextPrayerSchedule() {
        let prayerTiming = this._prayerManager.getUpcomingPrayer();
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
// export class PrayersRefreshEventProvider extends EventProvider<manager.IPrayerManager>
// {
//     private _prayerManager: manager.IPrayerManager;
//     private _refreshPrayersEvent: cron.CronJob;
//     constructor(prayerManager: manager.IPrayerManager) {
//         super();
//         this._prayerManager = prayerManager;
//     }
//     public registerListener(observer: IObserver<manager.IPrayerManager>): void {
//         super.registerListener(observer);
//     }
//     public removeListener(observer: IObserver<manager.IPrayerManager>): void {
//         super.removeListener(observer);
//     }
//     public notifyObservers(prayersTime: manager.IPrayerManager,error?:Error): void {
//         super.notifyObservers(prayersTime,error);
//     }
//     public startPrayerSchedule(): void 
//     {
//         if (isNullOrUndefined(this._refreshPrayersEvent) || !this._refreshPrayersEvent.start) {
//             this.runNextPrayerSchedule();
//         }
//     }
//     public stopPrayerSchedule(): void {
//         if (this._refreshPrayersEvent.running)
//             this._refreshPrayersEvent.stop();
//     }
//     private  runNextPrayerSchedule(): void {
//         this._refreshPrayersEvent = new cron.CronJob(this._prayerManager.getPrayerEndPeriond(), async () => { 
//            await this.scheduleRefresh() },
//             null, true);
//         this._refreshPrayersEvent.addCallback(() => { setTimeout(() => this.runNextPrayerSchedule(), 3000); });
//     }
//     private async scheduleRefresh():Promise<void>
//     {
//         let startDate:Date = this._prayerManager.getPrayerStartPeriod();
//         let endDate:Date = this._prayerManager.getPrayerEndPeriond();
//         startDate = DateUtil.addDay(1,startDate);
//         endDate = DateUtil.addMonth(1,endDate);
//         try{
//            this._prayerManager =  await this._prayerManager.updatePrayersDate(startDate,endDate);
//            this.notifyObservers(this._prayerManager);
//         }
//         catch(err)
//         {
//             this.notifyObservers(null,err);
//         }
//     }
// }
// export class PrayerRefreshEventListener implements IObserver<manager.IPrayerManager>
// {
//     constructor()
//     {
//     }
//     onCompleted(): void {
//     }
//     onError(error: Error): void {
//         debug(error);
//     }
//     onNext(value: manager.IPrayerManager): void {
//         debug(value);
//     }
// }
