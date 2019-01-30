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
buildLocationObject().catch((err) => console.log(err));
async function buildLocationObject() {
    try {
        let prayerConfig: cg.IPrayersConfig = await new cg.default().getPrayerConfig();
        let prayerTime: prayer.IPrayersTime = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(null, prayerConfig)
            .setPrayerMethod(prayer.Methods.Mecca)
            .setPrayerPeriod(new Date('2019-01-30'), new Date('2019-01-30'))
            .setLocationAddress('Abu Dhabi', 'AE')
            .createPrayerTime();
        // let CronJob = cron.CronJob;
        // new CronJob('* * * * * *', function () {
        //     console.log('You will see this message every second');
        // }, null, true, 'America/Los_Angeles');
        console.log(util.inspect(prayerTime, false, null, true /* enable colors */));       // console.log(prayerSettings);
       // console.log(DateUtil.getTime('2019-01-01','03:04'));
   
    }
    catch (err) {
        console.log(err);
    }
}