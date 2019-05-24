"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prayer = require("./entities/prayer");
const configuration_1 = __importDefault(require("./configurators/configuration"));
const moment_1 = __importDefault(require("moment"));
const val = require("./validators/validator");
var validators = val.validators;
const util_1 = __importDefault(require("util"));
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
function getPrayerView(prayers) {
    let prayerView = new Array();
    let prayerViewObject;
    let prayerTimings = new Array();
    prayers.forEach((curr, index, arr) => {
        curr.prayerTime.forEach((prayerTiming, i) => {
            prayerTimings.push(prayerTiming.prayerTime);
        });
        prayerViewObject =
            {
                prayerDate: moment_1.default(curr.prayersDate).format('L'),
                fajr: moment_1.default(prayerTimings[0]).format('LT'),
                sunrise: moment_1.default(prayerTimings[1]).format('LT'),
                dhuhr: moment_1.default(prayerTimings[2]).format('LT'),
                asr: moment_1.default(prayerTimings[3]).format('LT'),
                sunset: moment_1.default(prayerTimings[4]).format('LT'),
                maghrib: moment_1.default(prayerTimings[5]).format('LT'),
                isha: moment_1.default(prayerTimings[6]).format('LT'),
                midnight: moment_1.default(prayerTimings[7]).format('LT')
            };
        prayerView.push(prayerViewObject);
    });
    return prayerView;
}
function getPrayerViewRow(prayersView) {
    let prayerViewRow = new Array();
    prayersView.forEach((prayerViewObject, index, arr) => {
        prayerViewRow.push({ prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.FAJR, prayerTime: prayerViewObject.fajr }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.SUNRISE, prayerTime: prayerViewObject.sunrise }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.DHUHR, prayerTime: prayerViewObject.dhuhr }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.ASR, prayerTime: prayerViewObject.asr }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.SUNSET, prayerTime: prayerViewObject.sunset }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.MAGHRIB, prayerTime: prayerViewObject.maghrib }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.ISHA, prayerTime: prayerViewObject.isha }, { prayerDate: prayerViewObject.prayerDate, prayerName: prayer.PrayersName.MIDNIGHT, prayerTime: prayerViewObject.midnight });
    });
    return prayerViewRow;
}
var prayerConfigFE = {
    method: 4,
    school: 33,
    midnight: 0,
    adjustmentMethod: 2,
    latitudeAdjustment: 3,
    startDate: new Date('2019-05-24'),
    endDate: new Date(),
    adjustments: [
        {
            prayerName: prayer.PrayersName.IMSAK,
            adjustments: "ttt"
        },
        {
            prayerName: prayer.PrayersName.FAJR,
            adjustments: "ee"
        },
        {
            prayerName: prayer.PrayersName.SUNRISE,
            adjustments: 3
        },
        {
            prayerName: prayer.PrayersName.DHUHR,
            adjustments: 2
        },
        {
            prayerName: prayer.PrayersName.ASR,
            adjustments: 3
        },
        {
            prayerName: prayer.PrayersName.MAGHRIB,
            adjustments: 2
        },
        {
            prayerName: prayer.PrayersName.SUNSET,
            adjustments: 0
        },
        {
            prayerName: prayer.PrayersName.ISHA,
            adjustments: -10
        },
        {
            prayerName: prayer.PrayersName.MIDNIGHT,
            adjustments: 0
        }
    ]
};
async function buildLocationObject() {
    try {
        console.time('Prayer_Manager');
        let prayerConfig = await new configuration_1.default().getPrayerConfig();
        let locationConfig = await new configuration_1.default().getLocationConfig();
        // console.log(locationConfig);
        // let prayerManager: manager.IPrayerManager = await manager.PrayerTimeBuilder
        //     .createPrayerTimeBuilder(locationConfig, prayerConfig)
        //     .createPrayerTimeManager();
        // let prayerManager: manager.IPrayerManager = await manager.PrayerTimeBuilder
        //     .createPrayerTimeBuilder(null, prayerConfig)
        //     .setLocationByAddress("Abu Dhabi","AE")
        //     .createPrayerTimeManager();
        //    console.timeEnd('Prayer_Manager');
        let validate = validators.ConfigValidator.createValidator();
        //   console.log(ramda.values(prayer.AdjsutmentMethod));
        //console.log(prayer.AdjsutmentMethod.Server);
        // console.log("validation status : "+ validate.validate());
        console.log("the object is valid : " + validate.validate(prayerConfigFE));
        //  console.log("Validation Error: "+ validate.getValidationError())
        console.log(util_1.default.inspect(validate.getValidationError(), { showHidden: false, depth: null }));
        //  console.log(prayerManager.getPrayerAdjsutments());
        // console.log(prayerManager.getPrayersByDate(new Date('2019-05-23')));
    }
    catch (err) {
        if (err.name === "ValidationError")
            err.details.map((detail) => console.log((util_1.default.inspect(`${detail.value.label} with value ${detail.value.value}: ${detail.message}`, { showHidden: false, depth: null }))));
        //  console.log(err);
        console.log(util_1.default.inspect(err, { showHidden: false, depth: null }));
    }
}
//# sourceMappingURL=app.js.map