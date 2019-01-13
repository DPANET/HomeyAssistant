"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
const location_1 = require("./location");
class PrayerManager {
}
class PrayerManagerFactory {
    static async createPrayerManagerFactory(location) {
        let locationEntity;
        let err;
        //get Location
        [err, locationEntity] = to(await location_1.LocationFactory.createLocationFactory(location));
        return;
    }
}
