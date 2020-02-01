import { Schema, Model, Document, model } from 'mongoose';
import { IPrayersConfig, ILocationConfig, IConfig } from './inteface.configuration'
import { IPrayersTime } from '../entities/prayer'
import { string } from '@hapi/joi';

export const configSchema: Schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      createIndexes: true,
      required: true,
      auto: true,
    },
    deviceID: {
      type: String,
      unique: true
    }
    ,
    config: {
      prayerConfig:
      {
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
      }
      ,
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
  }
);

export interface IConfigSchemaModel extends Document {
  _id: Schema.Types.ObjectId,
  deviceID: string,
  config:
  {
    prayerConfig:
    {
      prayer: {
        timing: string
      }
      ,
      calculations: IPrayersConfig
      // {
      //   method: number,
      //   school: number,
      //   midnight: number,
      //   latitudeAdjustment: number,
      //   adjustmentMethod: number,
      //   adjustments: [{ prayerName: string, adjustments: number }]
      // }
    },
    locationConfig: ILocationConfig
    // {
    //   location: {
    //     latitude: number,
    //     longtitude: number
    //     city: string,
    //     countryCode: string,
    //     countryName: string,
    //     address: string
    //   },
    //   timezone: {
    //     timeZoneName: string,
    //     dstOffset: number,
    //     rawOffset: number

    //   }
    // }

  }
};

export const prayerTimeSchema: Schema = new Schema(
  {
    _id:
    {
      type: Schema.Types.ObjectId,
      createIndexes: true,
      required: true,
      auto: true,
    }
    ,
    deviceID: {
      type: String,
      unique: true
    },
    prayersTime:
    {
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
  }
)
export interface IPrayerTimeSchemaModel extends Document {
  _id: Schema.Types.ObjectId;
  deviceID: string;
  prayersTime: IPrayersTime;
};
export const configModel: Model<IConfigSchemaModel> = model('UsersPrayersConfig', configSchema, 'UsersPrayersConfig');
export const prayerTimeModel: Model<IPrayerTimeSchemaModel> = model('PrayersTimeCache', prayerTimeSchema, 'PrayersTimeCache')
