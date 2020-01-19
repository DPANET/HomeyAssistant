"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.configSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    deviceID: String,
    config: {
        prayerConfig: {
            prayer: {
                timing: String
            },
            calculations: {
                method: Number,
                school: Number,
                midnight: Number,
                latitudeAdjustment: Number,
                adjustmentMethod: Number,
                adjustments: [
                    {
                        prayerName: String,
                        adjustments: Number
                    }
                ]
            }
        },
        locationConfig: {
            location: {
                latitude: Number,
                longtitude: Number,
                city: String,
                countryCode: String,
                countryName: String,
                address: String
            },
            timezone: {
                timeZoneId: String,
                timeZoneName: String,
                dstOffset: Number,
                rawOffset: Number
            }
        }
    }
});
;
exports.configModel = mongoose_1.model('UsersPrayersConfig', exports.configSchema, 'UsersPrayersConfig');
//# sourceMappingURL=schema.config.js.map