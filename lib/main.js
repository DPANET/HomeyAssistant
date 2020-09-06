"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nconf_1 = __importDefault(require("nconf"));
nconf_1.default.file('config/default.json');
const prayersLib = __importStar(require("./index"));
var prayerConfig = {
    method: 4,
    school: 0,
    midnight: 0,
    adjustmentMethod: 1,
    latitudeAdjustment: 3,
    startDate: new Date(),
    endDate: prayersLib.DateUtil.addMonth(1, new Date()),
    adjustments: [
        { prayerName: prayersLib.PrayersName.FAJR, adjustments: 1 },
        { prayerName: prayersLib.PrayersName.DHUHR, adjustments: 2 },
        { prayerName: prayersLib.PrayersName.ASR, adjustments: 0 },
        { prayerName: prayersLib.PrayersName.MAGHRIB, adjustments: 4 },
        { prayerName: prayersLib.PrayersName.ISHA, adjustments: 0 },
    ]
};
var locationConfig = {
    location: {
        latitude: 21.3890824,
        longtitude: 39.8579118,
        countryCode: "SA",
        countryName: "Saudi Arabia",
        address: "Mecca Saudi Arabia",
        city: "Mecca"
    },
    timezone: {
        timeZoneId: "Asia/Riyadh",
        timeZoneName: "Arabian Standard Time",
        dstOffset: 0,
        rawOffset: 10800
    }
};
var countnumber = 0;
async function main() {
    //let prayerDBConnection: mongoose.Mongoose;
    try {
        // Create Prayer Manager manually
        let prayerManager = await prayersLib.PrayerTimeBuilder
            .createPrayerTimeBuilder()
            .setLocationByAddress("Abu Dhabi", "AE")
            .setPrayerPeriod(new Date(), prayersLib.DateUtil.addMonth(1, new Date()))
            .setPrayerMethod(prayersLib.Methods.Mecca)
            .createPrayerTimeManager();
        console.log(prayerManager.getPrayerTime(prayersLib.PrayersName.FAJR));
        console.log(prayerManager.getPrayers());
        console.log(prayerManager.getUpcomingPrayer());
        // Create Prayer from Config 
        prayerManager = await prayersLib.PrayerTimeBuilder
            .createPrayerTimeBuilder(locationConfig, prayerConfig)
            .createPrayerTimeManager();
        console.log(prayerManager.getPrayerTime(prayersLib.PrayersName.FAJR, new Date()));
        //Validate Config File
        let validate = prayersLib.PrayerConfigValidator.createValidator();
        console.log(validate.validate(prayerConfig));
    }
    catch (err) {
        console.log(err);
    }
}
main();
