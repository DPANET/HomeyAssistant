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
exports.prayerTimeSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        createIndexes: true,
        required: true,
        auto: true
    },
    profileID: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true
    },
    expireAt: {
        type: Date, default: Date.now, expires: 0
    },
    prayersTime: {
        location: {
            address: {
                type: String
            },
            countryCode: {
                type: String
            },
            countryName: {
                type: String
            },
            latitude: {
                type: Number
            },
            longtitude: {
                type: Number
            },
            city: {
                type: String
            },
            timeZoneId: {
                type: String
            },
            timeZoneName: {
                type: String
            },
            dstOffset: {
                type: Number
            },
            rawOffset: {
                type: Number
            }
        },
        prayers: [{
                _id: false,
                prayerTime: [
                    {
                        _id: false,
                        prayerName: String,
                        prayerTime: Date
                    }
                ],
                prayersDate: Date
            }],
        pareyerSettings: {
            midnight: {
                id: {
                    type: Number
                },
                midnight: {
                    type: String
                }
            },
            school: {
                id: {
                    type: Number
                },
                school: {
                    type: String
                }
            },
            latitudeAdjustment: {
                id: {
                    type: Number
                },
                latitudeMethod: {
                    type: String
                }
            },
            method: {
                id: {
                    type: Number
                },
                methodName: {
                    type: String
                }
            },
            startDate: {
                type: Date
            },
            adjustmentMethod: {
                id: {
                    type: Number
                },
                adjustmentMethod: {
                    type: String
                }
            },
            endDate: {
                type: Date
            },
            adjustments: [
                {
                    _id: false,
                    prayerName: String,
                    adjustments: Number
                }
            ]
        }
    }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
;
exports.prayerTimeModel = mongoose.model('PrayersTimeCache', exports.prayerTimeSchema, 'PrayersTimeCache');
//# sourceMappingURL=schema.userscache.js.map