"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
});
;
exports.prayerTimeSchema = new mongoose_1.Schema({
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
});
;
exports.configModel = mongoose_1.model('UsersPrayersConfig', exports.configSchema, 'UsersPrayersConfig');
exports.prayerTimeModel = mongoose_1.model('PrayersTimeCache', exports.prayerTimeSchema, 'PrayersTimeCache');
//# sourceMappingURL=schema.configuration.js.map