import { IPrayersConfig, ILocationConfig, IConfigProvider, IConfig } from "./inteface.configuration";
import { Schema } from 'mongoose';
export declare enum ConfigProviderName {
    SERVER = "Server",
    CLIENT = "Client"
}
declare abstract class ConfigProvider implements IConfigProvider {
    private _providerName;
    constructor(providerName: ConfigProviderName);
    abstract createDefaultConfig(id: Schema.Types.ObjectId): Promise<IConfig>;
    abstract getPrayerConfig(config?: IConfig): Promise<IPrayersConfig>;
    abstract updatePrayerConfig(prayerConfigs: IPrayersConfig, config: IConfig): Promise<boolean>;
    abstract getLocationConfig(config?: IConfig): Promise<ILocationConfig>;
    abstract updateLocationConfig(locationConfig: ILocationConfig, config: IConfig): Promise<boolean>;
    abstract getConfigId(config?: IConfig): Promise<IConfig>;
    protected mergePrayerConfig(original: IPrayersConfig, target: IPrayersConfig): IPrayersConfig;
    protected mergeLocationConfig(original: ILocationConfig, target: ILocationConfig): ILocationConfig;
}
export declare class ConfigProviderFactory {
    static createConfigProviderFactory(configProviderName?: ConfigProviderName): ConfigProvider;
}
export {};
