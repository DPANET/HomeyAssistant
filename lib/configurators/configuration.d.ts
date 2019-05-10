import { IPrayersConfig, ILocationConfig, IConfig } from "./inteface.configuration";
export default class Configurator implements IConfig {
    private _db;
    private readonly _fileName;
    constructor(fileName?: string);
    saveLocationConfig(locationConfig: ILocationConfig): Promise<boolean>;
    getLocationConfig(): Promise<ILocationConfig>;
    savePrayerConfig(prayerConfigs: IPrayersConfig): Promise<boolean>;
    getPrayerConfig(): Promise<IPrayersConfig>;
    private getDB;
}
