import { IPrayersConfig, ILocationConfig, IConfigProvider, IConfig } from "./inteface.configuration";
export declare enum ConfigProviderName {
    SERVER = "Server",
    CLIENT = "Client",
    HOMEY = "Homey",
    CUSTOM = "Customer"
}
export declare abstract class ConfigProvider implements IConfigProvider {
    private _providerName;
    constructor(providerName: ConfigProviderName);
    abstract createDefaultConfig(id?: any): Promise<IConfig>;
    abstract getPrayerConfig(id?: any): Promise<IPrayersConfig>;
    abstract updatePrayerConfig(prayerConfigs: IPrayersConfig, id?: any): Promise<boolean>;
    abstract getLocationConfig(id?: any): Promise<ILocationConfig>;
    abstract updateLocationConfig(locationConfig: ILocationConfig, id?: any): Promise<boolean>;
    abstract getConfig(id?: any): Promise<IConfig>;
    protected mergePrayerConfig(original: IPrayersConfig, target: IPrayersConfig): IPrayersConfig;
    protected mergeLocationConfig(original: ILocationConfig, target: ILocationConfig): ILocationConfig;
}
export declare class ClientConfigurator extends ConfigProvider {
    private _db;
    private readonly _fileName;
    constructor(fileName?: string);
    createDefaultConfig(id?: any): Promise<IConfig>;
    updateLocationConfig(locationConfig: ILocationConfig, id?: any): Promise<boolean>;
    getLocationConfig(id?: any): Promise<ILocationConfig>;
    updatePrayerConfig(prayerConfigs: IPrayersConfig, id?: any): Promise<boolean>;
    getPrayerConfig(id?: any): Promise<IPrayersConfig>;
    private getDB;
    getConfig(id?: IConfig): Promise<IConfig>;
}
export declare class ConfigProviderFactory {
    static createConfigProviderFactory<T extends ConfigProvider = ClientConfigurator, K = any>(providerType: new (configs?: K) => T, configs?: K): T;
}
