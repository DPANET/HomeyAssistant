"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
//const { googleMapsClient } = require("./location");
const prayerEntity = require("./entities/prayers");
const loc = __importStar(require("./entities/location"));
const Joi = __importStar(require("joi"));
const val = __importStar(require("./validators/validator"));
const prayer_provider_1 = require("./providers/prayer-provider");
const lowdb_1 = __importDefault(require("lowdb"));
const FileAsync_1 = __importDefault(require("lowdb/adapters/FileAsync"));
const _ = require("lodash");
//googleMap();
const ramda = require("ramda");
var queryString = [
    {
        url: 'http://api.aladhan.com/v1/timingsByCity/' + '01-01-2019',
        qs: {
            city: "Abu Dhabi",
            country: "AE",
            method: "04"
        },
        method: 'GET',
        json: true,
        resolveWithFullResponse: false
    }
];
let locationInput;
let LocationEnity;
locationInput = {
    address: "Westminster",
    countryCode: "GB",
    latitude: 51.5073509,
    longtitude: -0.1277583
};
let locationUpdated = {
    address: 'Dubai',
    countryCode: 'AE',
    latitude: 25.1972858,
    longtitude: 55.2792565
};
//buildLocationObject().catch((err)=>console.log(err));
//readJsonFile();
//console.log(locationProvider.getProviderName());
async function buildLocationObject() {
    try {
        let locationBuilder = loc.LocationBuilderFactory.createBuilderFactory(loc.LocationTypeName.LocationBuilder);
        let locationObject = await locationBuilder.setLocationAddress('Dubai', 'AE').
            then(lb => lb.createLocation());
        console.log(locationObject);
    }
    catch (err) {
        console.log(err.message);
    }
    //console.log(util.inspect(err.message, false, null, true /* enable colors */));
}
async function validate1() {
    let locationEntity;
    let validationError, validationResult;
    locationEntity = {
        address: "fs",
        // countryCode: "GB",
        latitude: 20,
        longtitude: -0.1277583
    };
    let validate = val.ValidatorProviderFactory.
        createValidateProvider(val.ValidatorProviders.LocationValidator);
    [validationError, validationResult] = await to(validate.validate(locationEntity));
    if (validationError) {
        console.log("validartion error : " + validationError.message);
    }
    else
        return validationResult;
}
async function validate2() {
    let locationEntity;
    locationEntity = {
        countryCode: "GB",
        latitude: 2000,
        longtitude: -0.1277583
    };
    let _joiSchema = Joi.object().keys({
        countryCode: Joi.string().regex(/^[A-Z]{2}$/i),
        address: Joi.string(),
        latitude: Joi.number().min(-90).max(90),
        longtitude: Joi.number().min(-180).max(180),
        countryName: Joi.any()
    })
        .with('address', 'countryCode')
        .with('latitude', 'longtitude');
    let result, err;
    [err, result] = await to(Joi.validate(locationEntity, _joiSchema));
    if (err)
        console.log("validartion 2 error : " + err.message);
    else
        console.log(true);
}
buildPrayerObject().catch((err) => console.log(err));
async function buildPrayerObject() {
    try {
        let locationBuilder = loc.LocationBuilderFactory.createBuilderFactory(loc.LocationTypeName.LocationBuilder);
        let locationObject = await locationBuilder.setLocationAddress('Dubai', 'AE').
            then(lb => lb.createLocation());
        let prayerProvider = new prayer_provider_1.PrayerTimeProvider();
        let result, err;
        let midnight = await prayerProvider.getPrayerMidnightById(1);
        console.log(midnight);
        // let prayers: Array<prayerEntity.IPrayers>;
        // let saveResult : boolean= false;
        // [err, result] = await to(prayerProvider.getPrayerSettings());
        // result.method= methods;
        // [err,saveResult] = await to( prayerProvider.savePrayerSettings(result));
        // if(err)
        // console.log(err);
        // console.log(saveResult);
        // [err, prayers] = await to(prayerProvider.getPrayerTime(result, locationObject));
        // console.log(prayers);
        // console.log(util.inspect(prayers, false, null, true /* enable colors */));
    }
    catch (err) {
        console.log(err.message);
    }
}
//readJsonFile().catch(err => console.log(err));
async function readJsonFile() {
    let i = {
        method: 3,
        adjustments: [
            {
                prayerName: prayerEntity.PrayersName.FAJR,
                adjustments: 3
            },
            {
                prayerName: prayerEntity.PrayersName.SUNRISE,
                adjustments: 2
            },
            {
                prayerName: prayerEntity.PrayersName.DHUHR,
                adjustments: 2
            },
            {
                prayerName: prayerEntity.PrayersName.ASR,
                adjustments: 2
            },
            {
                prayerName: prayerEntity.PrayersName.SUNSET,
                adjustments: 0
            },
            {
                prayerName: prayerEntity.PrayersName.MAGHRIB,
                adjustments: 1
            },
            {
                prayerName: prayerEntity.PrayersName.ISHA,
                adjustments: 0
            },
            {
                prayerName: prayerEntity.PrayersName.IMSAK,
                adjustments: 0
            },
            {
                prayerName: prayerEntity.PrayersName.MIDNIGHT,
                adjustments: 25
            }
        ]
    };
    //console.log(i);
    let db = await lowdb_1.default(new FileAsync_1.default('src/configurators/prayers.json'));
    let err, result;
    let fn = (n) => n = 1;
    try {
        result = await db.get('apis.prayersAPI.settings.calculations')
            .value();
        let orginal = {
            x: 3,
            y: 2
        };
        let update = {
            x: 1,
            y: 5,
            z: 4
        };
        //  return false;
        console.log(ramda.mergeDeepRight(result, i));
        let z = _.merge(result, i);
        console.log(z);
        //console.log(result);
        return true;
    }
    catch (err) {
        console.log(err);
    }
}
//console.log(manager.BuilderFactory.createBuilderFactory());
// createLocationEntity(locationInput)
// .then((result) => {
//     LocationEnity=  result;
//     console.log(result.getLocation());
//     console.log(result.getTimeZone());
// })
// .catch((err)=>{
//     console.log(err.message);
// })
// Settings.getPrayersSettings().then((results)=>
// {
// console.log(results);
// })
// .catch((err)=> console.log(err.message));
// async function createLocationEntity(location: ILocation) :Promise<Location> {
// return await LocationFactory.createLocationFactory(location);
// }
// constructPrayerTimeObject(queryString)
//     .then((result) => {
//         console.log('SUCEEED');
//         console.log(result);
//     })
//     .catch((err) => {
//         console.log('FAILED');
//         console.log(err.message);
//     }
//     );
// async function constructPrayerTimeObject(query, callback?) {
//     let err, body, result, prayerObject, notification;
//         [err,result] = await  to(request.get(query));
//         if(!err)
//         return result;
//         else
//         throw new Error('why');
//              //return await(request.get(query));
//     // let PrayersTimings: Array<entity.IPrayerTime> = new Array();
//     // PrayersTimings.push({ prayerName: entity.Prayers.ASR, time: Date.now(), adjustment: 2 });
//     // debug(PrayersTimings + 'hi');
// }
