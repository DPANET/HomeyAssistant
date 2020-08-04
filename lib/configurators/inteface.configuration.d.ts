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
    id?: string;
    profileID?: string;
}
export interface IConfigProvider {
    createDefaultConfig(profileID?: string): Promise<IConfig>;
    getPrayerConfig(config?: IConfig): Promise<IPrayersConfig>;
    updatePrayerConfig(prayerConfigs: IPrayersConfig, config: IConfig): Promise<boolean>;
    getLocationConfig(config?: IConfig): Promise<ILocationConfig>;
    updateLocationConfig(locationConfig: ILocationConfig, config: IConfig): Promise<boolean>;
    getConfigId(config?: IConfig): Promise<IConfig>;
}
