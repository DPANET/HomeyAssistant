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
buildLocationObject().catch((err) => console.log(err));
async function buildLocationObject() {
    try {
        let prayerConfig = await new cg.default().getPrayerConfig();
        let prayerTime = await manager.PrayerTimeBuilder
            .createPrayerTimeBuilder(null, prayerConfig)
            .setPrayerMethod(prayer.Methods.Mecca)
            .setPrayerPeriod(new Date('2019-01-30'), new Date('2019-01-30'))
            .setLocationAddress('Abu Dhabi', 'AE')
            .createPrayerTime();
        console.log(util.inspect(prayerTime, false, null, true /* enable colors */)); // console.log(prayerSettings);   
    }
    catch (err) {
        console.log(err);
    }
}
