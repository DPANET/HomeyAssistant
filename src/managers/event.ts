
const dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
const to = require('await-to-js').default;
import ramda = require('ramda');
import * as location from '../entities/location';
import * as prayer from '../entities/prayer';
import * as pp from '../providers/prayer-provider';
import * as lp from '../providers/location-provider';
import { ILocationConfig, IPrayersConfig } from "../configurators/configuration";
import val = require('../validators/validator');
import validators = val.validators;
import { isNullOrUndefined } from 'util';
import * as cron from 'cron';
import { DateUtil } from '../util/utility';
import * as manager from './manager'

export interface IObserver<T> {
    onCompleted(): void;
    onError(error: Error): void;
    onNext(value: T): void;
}

export interface IObservable<T> {
    registerListener(observer: IObserver<T>): void;
    removeListener(observer: IObserver<T>): void;
    notifyObservers(value: T): void;
}
abstract class EventProvider<T> implements IObservable<T>
{
    protected _observers: Array<IObserver<T>>;
    constructor()
    {
        this._observers =  new Array<IObserver<T>>();
    }
    registerListener(observer: IObserver<T>): void {
      this._observers.push(observer);
    }   
     removeListener(observer: IObserver<T>): void {
        this._observers.splice(this._observers.indexOf(observer, 1));
    }
    notifyObservers(value: T): void {

        for (let i of this._observers)
        {
            i.onNext(value);
        }    
    }

}

export class PrayersEventProvider extends EventProvider<prayer.IPrayersTiming>
{
    private _prayerManager: manager.IPrayerManager;
    private _upcomingPrayerEvent: cron.CronJob;
    constructor(prayerManager: manager.IPrayerManager) {
        super();
        this._prayerManager = prayerManager; 
    }
    public registerListener(observer: IObserver<prayer.IPrayersTiming>): void {
        super.registerListener(observer);
    }
    public removeListener(observer: IObserver<prayer.IPrayersTiming>): void {
        super.removeListener(observer);
    }
    public notifyObservers(prayersTime: prayer.IPrayersTiming): void {
        super.notifyObservers(prayersTime);
    }
    public startPrayerSchedule(): void 
    {
        if (isNullOrUndefined(this._upcomingPrayerEvent) || !this._upcomingPrayerEvent.start) {
            this.runNextPrayerSchedule();
        }
    }
    public stopPrayerSchedule(): void {
        if (this._upcomingPrayerEvent.running)
            this._upcomingPrayerEvent.stop();
    }
    private runNextPrayerSchedule(): void {
        let prayerTiming: prayer.IPrayersTiming = this._prayerManager.getUpcomingPrayer();
        this._upcomingPrayerEvent = new cron.CronJob(prayerTiming.prayerTime, () => { 
            this.notifyObservers(prayerTiming) },
            null, true);
        this._upcomingPrayerEvent.addCallback(() => { setTimeout(() => this.runNextPrayerSchedule(), 60000); });
    }
}

export class PrayersEventListener implements IObserver<prayer.IPrayersTiming>
{
    constructor()
    {
    }
    onCompleted(): void {
        throw new Error("Method not implemented.");
    }
    onError(error: Error): void {
        throw new Error("Method not implemented.");
    }
    onNext(value: prayer.IPrayersTiming): void {
        console.log(value);
    }
}

export class PrayersRefreshEventProvider extends  EventProvider<manager.IPrayerManager>
{
    private _prayerManager: manager.IPrayerManager;
    private _refreshPrayersEvent: cron.CronJob;
    constructor(prayerManager: manager.IPrayerManager) {
        super();
        this._prayerManager = prayerManager;
    }
    public registerListener(observer: IObserver<manager.IPrayerManager>): void {
        super.registerListener(observer);
    }
    public removeListener(observer: IObserver<manager.IPrayerManager>): void {
        super.removeListener(observer);
    }
    public notifyObservers(prayersTime: manager.IPrayerManager): void {
        super.notifyObservers(prayersTime);
    }
    public startPrayerSchedule(): void 
    {
        if (isNullOrUndefined(this._refreshPrayersEvent) || !this._refreshPrayersEvent.start) {
            this.runNextPrayerSchedule();
        }
    }
    public stopPrayerSchedule(): void {
        if (this._refreshPrayersEvent.running)
            this._refreshPrayersEvent.stop();
    }
    private runNextPrayerSchedule(): void {
        let dateNow: Date = new Date();
        dateNow.setSeconds(dateNow.getUTCSeconds() + 10);
        this._refreshPrayersEvent = new cron.CronJob(dateNow, () => { 
            this.notifyObservers(this._prayerManager) },
            null, true);
        this._refreshPrayersEvent.addCallback(() => { setTimeout(() => this.runNextPrayerSchedule(), 3000); });
    }
}

export class PrayerRefreshEventListener implements IObserver<manager.IPrayerManager>
{
    constructor()
    {
    }
    onCompleted(): void {
        throw new Error("Method not implemented.");
    }
    onError(error: Error): void {
        throw new Error("Method not implemented.");
    }
    onNext(value: manager.IPrayerManager): void {
        console.log(value);
    }
}
