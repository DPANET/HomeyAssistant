"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const request = require("request-promise-native");
const to = require('await-to-js').default;
const { googleMapsClient } = require("./location");
const locationEntity = require("./location");
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
createLocationEntity()
    .then((result) => {
    console.log(result.getLocation());
})
    .catch((err) => {
    console.log(err.message);
});
async function createLocationEntity() {
    let location;
    location = {
        address: "ruwais camp",
        countryCode: "AE",
        longtitude: 45.4479073,
        latitude: 25.6868961
    };
    return await locationEntity.LocationFactory.createLocationFactory(location);
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
