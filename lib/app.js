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
const loc = __importStar(require("./location"));
const provider = __importStar(require("./providers"));
const val = __importStar(require("./validator"));
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
let locationProvider = provider.LocationProviderFactory.createLocationProviderFactory(provider.LocationProviderName.GOOGLE);
//buildLocationObject(locationProvider);
//console.log(locationProvider.getProviderName());
async function buildLocationObject(locationProvider) {
    let locationResult;
    let timeZoneResult;
    let locationObject;
    locationResult = await locationProvider.getLocationByCoordinates(locationInput.latitude, locationInput.longtitude);
    timeZoneResult = await locationProvider.getTimeZoneByCoordinates(locationInput.latitude, locationInput.longtitude);
    locationObject = new loc.Location(locationResult, timeZoneResult);
    console.log(locationObject);
    console.log(locationObject.timeZoneName);
}
// async function createLocation()
// {
//     let locationBuilder: LocationBuilder= new LocationBuilder(locationProvider);
//     let locationEntity : Location;
//      locationBuilder.setLocationCoordinates(locationInput.latitude,locationInput.longtitude)
//     .then(()=>locationBuilder.setLocationAddress(locationInput.address,locationInput.countryCode))
//     .then(()=>locationBuilder.setLocationTimeZone(locationInput.latitude,locationInput.longtitude))
//     .then(()=>{ locationBuilder.createLocation();})
//     .catch((err)=> console.log(err.message));
// }
async function validate() {
    val.ValidatorProviderFactory.
        createValidateProvider(val.ValidatorProviders.LocationValidator);
}
// validate().catch((err)=>
// {
//     console.log(err.message);
// });
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
