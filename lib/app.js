"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
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
