import dotenv = require('dotenv');
dotenv.config();
import Debug = require('debug');
const debug = Debug("app:startup");
import prayer = require("./entities/prayer");
import cg = require("./configurators/configuration");
import * as manager from './managers/manager';
import util = require('util')
import * as cron from 'cron';
import {DateUtil} from './util/utility';
import * as mom from'moment';
import moment = require('moment');
import { EventEmitter } from 'events';
import ramda = require('ramda');


let prayers:Array<object>=
        [ { prayerName: 'Fajr', prayerTime: "2019-01-31T05:46:00.000Z" },
      { prayerName: 'Sunrise', prayerTime: "2019-01-31T07:02:00.000Z" },
      { prayerName: 'Isha', prayerTime: "2019-01-31T19:27:00.000Z" },
      { prayerName: 'Dhuhr', prayerTime: "2019-01-31T12:38:00.000Z"},
      { prayerName: 'Asr', prayerTime: "2019-01-31T15:47:00.000Z" },
      { prayerName: 'Sunset', prayerTime: "2019-01-31T18:07:00.000Z" },
      { prayerName: 'Maghrib', prayerTime: "2019-01-31T18:09:00.000Z"},
      { prayerName: 'Imsak', prayerTime: "2019-01-31T05:34:00.000Z" },
      { prayerName: 'Midnight', prayerTime: "2019-01-31T00:36:00.000Z" } ];
buildLocationObject().catch((err) => console.log(err));
async function buildLocationObject() {
    try {
        let orderBy = ramda.sortBy(ramda.prop('prayerTime'));

        // let prayerConfig: cg.IPrayersConfig = await new cg.default().getPrayerConfig();
        // let prayerTime: prayer.IPrayersTime = await manager.PrayerTimeBuilder
        //     .createPrayerTimeBuilder(null, prayerConfig)
        //     .setPrayerMethod(prayer.Methods.Mecca)
        //     .setPrayerPeriod(new Date('2019-01-31'), new Date('2019-01-31'))
        //     .setLocationByAddress('reem island marina square', 'AE')
        //     .createPrayerTime();

        prayers= orderBy(prayers);
        let fardhPrayers:Array<prayer.IPrayerType> = prayer.PrayersTypes.filter((n)=>n.prayerType === prayer.PrayerType.Fardh );
        let objects = ramda.innerJoin((prayerLeft:prayer.IPrayersTiming,prayerRight:prayer.IPrayerType)=> prayerLeft.prayerName === prayerRight.prayerName
        ,prayers
        ,fardhPrayers);

        console.log(util.inspect(objects, false, null, true /* enable colors */));       // console.log(prayerSettings);   

        // console.log(util.inspect(orderBy(prayers), false, null, true /* enable colors */));       // console.log(prayerSettings);   
        // let  job:cron.CronJob = new cron.CronJob('10 * * * * *', function() {
        //     const d = new Date();
        //     console.log('At Ten Minutes:', d);
        // },()=> console.log('completed'),true,'Asia/Dubai');
        // job.start();
    }
    catch (err) {
        console.log(err);
    }
}

