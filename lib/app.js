"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const utility_1 = require("./util/utility");
buildLocationObject().catch((err) => console.log(err));
async function buildLocationObject() {
    try {
        // let prayerConfig: cg.IPrayersConfig = await new cg.default().getPrayerConfig();
        // let prayerTime: prayer.IPrayersTime = await manager.PrayerTimeBuilder
        //     .createPrayerTimeBuilder(null, prayerConfig)
        //     .setPrayerMethod(prayer.Methods.Mecca)
        //     .setPrayerPeriod(new Date('2019-01-30'), new Date('2019-01-30'))
        //     .setLocationAddress('Abu Dhabi', 'AE')
        //     .createPrayerTime();
        // let CronJob = cron.CronJob;
        // new CronJob('* * * * * *', function () {
        //     console.log('You will see this message every second');
        // }, null, true, 'America/Los_Angeles');
        //console.log(util.inspect(prayerTime, false, null, true /* enable colors */));       // console.log(prayerSettings);
        console.log(utility_1.DateUtil.getTime('2019-01-01', '15:04'));
    }
    catch (err) {
        console.log(err);
    }
}
