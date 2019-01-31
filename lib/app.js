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
const cron = __importStar(require("cron"));
const events_1 = require("events");
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
        let job = new cron.CronJob('10 * * * * *', function () {
            const d = new Date();
            console.log('At Ten Minutes:', d);
        }, () => console.log('completed'), true, 'Asia/Dubai');
        job.start();
    }
    catch (err) {
        console.log(err);
    }
}
class PrayersEvent extends events_1.EventEmitter {
    constructor() {
        super();
        let job = new cron.CronJob('10 * * * * *', () => this.emit('prayer'), null, true, 'Asia/Dubai');
        job.start();
    }
}
let myevent = new PrayersEvent();
myevent.on('prayer', () => console.log('somoeone woke me up'));
