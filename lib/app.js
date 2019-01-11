"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const request = require("request-promise-native");
const to = require('await-to-js').default;
const location_1 = require("./location");
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
    address: "Watford",
    countryCode: "GB",
    longtitude: -0.1277583,
    latitude: 51.5073509
};
createLocationEntity(locationInput)
    .then((result) => {
    LocationEnity = result;
    console.log(result.getLocation());
    console.log(result.getTimeZone());
})
    .catch((err) => {
    console.log(err.message);
});
async function createLocationEntity(location) {
    return await location_1.LocationFactory.createLocationFactory(location);
}
constructPrayerTimeObject(queryString)
    .then((result) => {
    console.log('SUCEEED');
    console.log(result);
})
    .catch((err) => {
    console.log('FAILED');
    console.log(err.message);
});
async function constructPrayerTimeObject(query, callback) {
    let err, body, result, prayerObject, notification;
    [err, result] = await to(request.get(query));
    if (!err)
        return result;
    else
        throw new Error('why');
    //return await(request.get(query));
    // let PrayersTimings: Array<entity.IPrayerTime> = new Array();
    // PrayersTimings.push({ prayerName: entity.Prayers.ASR, time: Date.now(), adjustment: 2 });
    // debug(PrayersTimings + 'hi');
}
