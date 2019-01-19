"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const Debug = require("debug");
const debug = Debug("app:startup");
const to = require('await-to-js').default;
var BuilderType;
(function (BuilderType) {
    BuilderType["LocationBuilder"] = "Location Builder";
    BuilderType["APPLE"] = "Apple";
    BuilderType["PRAYERTIME"] = "Prayer Time";
})(BuilderType = exports.BuilderType || (exports.BuilderType = {}));
class PrayerManager {
}
class PrayerManagerFactory {
    static async createPrayerManagerFactory(location) {
        let locationEntity;
        return;
    }
}
