"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configModel = exports.configSchema = void 0;
const mongoose_1 = require("mongoose");
exports.configSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
        createIndexes: true,
        required: true,
        auto: true,
    },
    deviceID: {
        type: String,
        unique: true
    },
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
                        _id: false,
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
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
;
exports.configModel = mongoose_1.model('UsersPrayersConfig', exports.configSchema, 'UsersPrayersConfig');
//# sourceMappingURL=schema.configuration.js.map