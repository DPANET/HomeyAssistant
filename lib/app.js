"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prayer = require("./entities/prayer");
const moment_1 = __importDefault(require("moment"));
const validator_1 = require("./validators/validator");
const utility_1 = require("./util/utility");
let prayers = [{ prayerName: 'Fajr', prayerTime: "2019-01-31T05:46:00.000Z" },
    { prayerName: 'Sunrise', prayerTime: "2019-01-31T07:02:00.000Z" },
    { prayerName: 'Isha', prayerTime: "2019-01-31T19:27:00.000Z" },
    { prayerName: 'Dhuhr', prayerTime: "2019-01-31T12:38:00.000Z" },
    { prayerName: 'Asr', prayerTime: "2019-01-31T15:47:00.000Z" },
    { prayerName: 'Sunset', prayerTime: "2019-01-31T18:07:00.000Z" },
    { prayerName: 'Maghrib', prayerTime: "2019-01-31T18:09:00.000Z" },
    { prayerName: 'Imsak', prayerTime: "2019-01-31T05:34:00.000Z" },
    { prayerName: 'Midnight', prayerTime: "2019-01-31T00:36:00.000Z" }];
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
    school: 0,
    midnight: 0,
    adjustmentMethod: 4,
    latitudeAdjustment: 3,
    startDate: new Date(),
    endDate: new Date("06-06-2019"),
    adjustments: [
        { prayerName: prayer.PrayersName.FAJR, adjustments: 350 },
        { prayerName: prayer.PrayersName.DHUHR, adjustments: 450 },
        { prayerName: prayer.PrayersName.ASR, adjustments: 600 },
        { prayerName: prayer.PrayersName.MAGHRIB, adjustments: 750 },
        { prayerName: prayer.PrayersName.ISHA, adjustments: 800 },
    ]
};
async function buildLocationObject() {
    try {
        //  console.time('Prayer_Manager');
        //  let prayerConfig: cg.IPrayersConfig = await new Configurator().getPrayerConfig();
        // let locationConfig: cg.ILocationConfig = await new Configurator().getLocationConfig();
        console.log(utility_1.DateUtil.getDateByTimeZone(new Date(), "Asia/Dubai"));
        //  console.log(locationConfig);
        // let prayerManager: managerInterface.IPrayerManager = await manager.PrayerTimeBuilder
        //     .createPrayerTimeBuilder(locationConfig, prayerConfig)
        //     .createPrayerTimeManager();
        // let prayerManager: manager.IPrayerManager = await manager.PrayerTimeBuilder
        //     .createPrayerTimeBuilder(null, prayerConfig)
        //     .setLocationByAddress("Abu Dhabi","AE")
        //     .createPrayerTimeManager();
        //    console.timeEnd('Prayer_Manager');
        //let result:boolean = await prayerManager.savePrayerConfig(prayerConfigFE);
        //console.log(result)
        let validate = validator_1.ConfigValidator.createValidator();
        //  console.log(ramda.values(prayer.AdjsutmentMethod));
        //console.log(prayer.AdjsutmentMethod.Server);
        //console.log(Object.values(prayer.AdjsutmentMethod));;
        console.log(prayerConfigFE);
        console.log("the object is valid : " + validate.validate(prayerConfigFE));
        //let err:validators.IValidationError = validate.getValidationError();
        //let message:string[] = err.details.map((detail:any)=>`${detail.value.label} with value ${detail.value.value}: ${detail.message}`);
        // let messageShort = message.reduce((prvs,curr,index,array)=> prvs.concat('\r\n',curr));
        //  console.log("Validation Error: "+ validate.getValidationError())
        //console.log(messageShort);
        //console.log(prayerManager.getPrayersByDate(new Date('2019-06-23')));
    }
    catch (err) {
        let message;
        if (err.name === "ValidationError") {
            message = err.details.map((detail) => `${detail.value.label} with value ${detail.value.value}: ${detail.message}`);
            console.log(message);
        }
        else
            console.log(err);
    }
}
buildLocationObject().catch((err) => console.log(err));
//# sourceMappingURL=app.js.map