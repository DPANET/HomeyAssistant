import * as prayers from '../entities/prayer';
export interface IPrayersConfig {
    method: prayers.Methods;
    midnight: prayers.MidnightMode;
    school: prayers.Schools;
    latitudeAdjustment: prayers.LatitudeMethod;
    adjustmentMethod: prayers.AdjsutmentMethod;
    startDate: Date;
    endDate: Date;
    adjustments: prayers.IPrayerAdjustments[];
}
export interface ILocationConfig {
    location: {
        latitude?: number;
        longtitude?: number;
        city?: string;
        countryCode?: string;
        countryName?: string;
        address?: string;
    };
    timezone: {
        timeZoneId?: string;
        timeZoneName?: string;
        dstOffset?: number;
        rawOffset?: number;
    };
}
export interface IConfig {
    prayerConfig: IPrayersConfig;
    locationConfig: ILocationConfig;
}
export interface IConfigProvider {
    createDefaultConfig(id?: any): Promise<IConfig>;
    getPrayerConfig(id?: any): Promise<IPrayersConfig>;
    updatePrayerConfig(prayerConfigs: IPrayersConfig, id?: any): Promise<boolean>;
    getLocationConfig(id?: any): Promise<ILocationConfig>;
    updateLocationConfig(locationConfig: ILocationConfig, id?: any): Promise<boolean>;
    getConfig(id?: any): Promise<IConfig>;
}
