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
buildLocationObject().catch((err) => console.log(err));
async function buildLocationObject() {
    try {
        // let prayerConfig: cg.IPrayersConfig = await new cg.default().getPrayerConfig();
        // let prayerTime: prayer.IPrayersTime = await manager.PrayerTimeBuilder
        //     .createPrayerTimeBuilder(null, prayerConfig)
        //     .setPrayerMethod(prayer.Methods.Mecca)
        //     .setPrayerPeriod(new Date('2019-01-31'), new Date('2019-01-31'))
        //     .setLocationByAddress('reem island marina square', 'AE')
        //     .createPrayerTime();
        // console.log(util.inspect(prayerTime, false, null, true /* enable colors */));       // console.log(prayerSettings);   

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

