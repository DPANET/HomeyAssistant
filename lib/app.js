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
const to = require('await-to-js').default;
const loc = __importStar(require("./entities/location"));
const Joi = __importStar(require("joi"));
const val = __importStar(require("./validators/validator"));
const prayer_provider_1 = require("./providers/prayer-provider");
const LU = __importStar(require("levelup"));
const LD = __importStar(require("leveldown"));
//console.log(process.env.GOOGLE_API_KEY);
//googleMap();
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
buildLocationObject().catch((err) => console.log(err));
readJsonFile();
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
    let prayerProvider = new prayer_provider_1.PrayerTimeProvider();
    let result, err;
    [err, result] = await to(prayerProvider.getPrayerLatitudeById(2));
    if (err)
        console.log(err);
    else {
        console.log(result);
    }
}
async function readJsonFile() {
    let db = LU.default(LD.default('..src/configurators/prayers'));
    db.get('apis').then((result) => console.log(result)).catch(err => console.log(err));
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
