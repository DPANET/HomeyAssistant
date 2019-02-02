"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const prayer = require("./entities/prayer");
const cg = require("./configurators/configuration");
const manager = __importStar(require("./managers/manager"));
const util = require("util");
let prayers = [{ prayerName: 'Fajr', prayerTime: "2019-01-31T05:46:00.000Z" },
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
        // let orderBy = ramda.sortBy(ramda.prop('prayerTime'));
        let prayerConfig = await new cg.default().getPrayerConfig();
        let prayerTime = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(null, prayerConfig)
            .setPrayerMethod(prayer.Methods.Mecca)
            .setPrayerPeriod(new Date('2019-02-02'), new Date('2019-02-02'))
            .setLocationByAddress('reem island marina square', 'AE')
            .createPrayerTime();
        //console.log(new Date('2019-02-02'));
        let prayerManager = new manager.PrayerManager(prayerTime);
        let upcomingPrayer = prayerManager.getUpcomingPrayer();
        console.log(util.inspect(upcomingPrayer, false, null, true /* enable colors */)); // console.log(prayerSettings);   
        // console.log(DateUtil.getNowDate('Asia/Dubai').toLocaleDateString());
        console.log(util.inspect(prayerTime, false, null, true /* enable colors */)); // console.log(prayerSettings);   
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
