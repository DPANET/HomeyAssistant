"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
exports.configSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
exports.test = 2;
//# sourceMappingURL=configSchema.js.map