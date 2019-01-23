"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const paths = {
    apisettings: 'settings.apiSettings',
    apiurl: 'apis.urls',
    adjustmentSettings: 'settings.adjustments',
    calculationsSettings: 'settings.calcuations'
};
class PrayerSettings {
    static async getApiSettings() {
        return await config.get(paths.apisettings);
    }
    static async getPrayersApiURL(urlType, urlTiming) {
        let urlSettings;
        let _urlType, _urlTiming;
        if (urlType === null) {
            urlSettings = await this.getApiSettings();
            _urlTiming = urlSettings.timing;
            _urlType = urlSettings.location;
        }
        else {
            _urlTiming = urlTiming;
            _urlType = urlType;
        }
        return await config.get(paths.apiurl + '.' + _urlType + '.' + _urlTiming);
    }
    static async getPrayersSettings() {
        return await config.get(paths.adjustmentSettings);
    }
}
exports.PrayerSettings = PrayerSettings;
