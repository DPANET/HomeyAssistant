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
import { timingSafeEqual } from 'crypto';
import * as event from './managers/event';
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
buildLocationObject().catch((err) => console.log(err));
async function buildLocationObject() {
    try {
        let prayerConfig: cg.IPrayersConfig = await new cg.Configurator().getPrayerConfig();
        let prayerManager: manager.IPrayerManager = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(null, prayerConfig)
            .setPrayerMethod(prayer.Methods.Mecca)
            .setPrayerPeriod(new Date('2019-02-01'), new Date('2019-02-28'))
            .setLocationByCoordinates(24.4942437, 54.4068603)
            .createPrayerTimeManager();
        let prayerEventManager: event.PrayersEventProvider = new event.PrayersEventProvider(prayerManager);
        prayerEventManager.registerListener(new event.PrayersEventListener());
        prayerEventManager.startPrayerSchedule();
        // console.log(DateUtil.addMonth(1, prayerManager.getPrayerEndPeriond()));
        // prayerManager = await prayerManager.updatePrayersDate(new Date('2019-03-01'), new Date('2019-03-31'));
        // //setTimeout(()=>{  prayerEventManager.stopPrayerSchedule();console.log('stop')},60000);
    }
    catch (err) {
        console.log(err);
    }

}

