import dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
import prayer = require("./entities/prayer");
import location = require("./entities/location");
import cg = require("./configurators/configuration");
import * as manager from './managers/manager';
import util = require('util')
import * as cron from 'cron';
import { DateUtil } from './util/utility';
import * as mom from 'moment';
import moment = require('moment');
import { EventEmitter } from 'events';
import ramda = require('ramda');

let locationInput:location.ILocation=
{latitude: 24.4942437,
    longtitude: 54.4068603,
    city: 'Abu Dhabi',
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    address: 'Al Reem Island - Abu Dhabi - United Arab Emirates'

}
interface IObserver<T>
{
    onCompleted():void;
    onError():void;
    onNext():void;

}

interface IObservable <T>
{
    registerListener( observer: IObserver<T>):void;
    removeListener(observer:IObserver<T>):void;
    
}
let prayers: Array<object> =
    [{ prayerName: 'Fajr', prayerTime: "2019-01-31T05:46:00.000Z" },
    { prayerName: 'Sunrise', prayerTime: "2019-01-31T07:02:00.000Z" },
    { prayerName: 'Isha', prayerTime: "2019-01-31T19:27:00.000Z" },
    { prayerName: 'Dhuhr', prayerTime: "2019-01-31T12:38:00.000Z" },
    { prayerName: 'Asr', prayerTime: "2019-01-31T15:47:00.000Z" },
    { prayerName: 'Sunset', prayerTime: "2019-01-31T18:07:00.000Z" },
    { prayerName: 'Maghrib', prayerTime: "2019-01-31T18:09:00.000Z" },
    { prayerName: 'Imsak', prayerTime: "2019-01-31T05:34:00.000Z" },
    { prayerName: 'Midnight', prayerTime: "2019-01-31T00:36:00.000Z" }];


class Observer implements IObserver<location.ILocation>
{
    onCompleted(): void {
        throw new Error("Method not implemented.");
    }    onError(): void {
        throw new Error("Method not implemented.");
    }
    onNext(): void {
        throw new Error("Method not implemented.");
    }


}
class Observable implements IObservable<location.ILocation>
{   private  _observers: Array<IObserver<location.ILocation>>;
    constructor()
    {
        this._observers = new Array<IObserver<location.ILocation>>();
    }
    
   public registerListener(observer: IObserver<location.ILocation>): void {
        this._observers.push(observer);
    }    
    removeListener(observer: IObserver<location.ILocation>): void 
    {
        this._observers.splice(this._observers.indexOf(observer,1));

    }


}
buildLocationObject().catch((err) => console.log(err));
async function buildLocationObject() {
    try {
        let prayerConfig: cg.IPrayersConfig = await new cg.default().getPrayerConfig();
        let prayerManager: manager.IPrayerManager = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(null, prayerConfig)
            .setPrayerMethod(prayer.Methods.Mecca)
            .setPrayerPeriod(new Date('2019-02-01'), new Date('2019-02-28'))
            .setLocationByAddress('reem island', 'AE')
            .createPrayerTimeManager()
        let upcomingPrayer: prayer.IPrayersTiming = prayerManager.getUpcomingPrayer();
        console.log(prayerManager.getPrayerLocation());
    }
    catch (err) {
        console.log(err);
    }

}

