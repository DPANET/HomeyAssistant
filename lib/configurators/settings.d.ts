interface IApiSettings {
    timing: string;
    location: string;
}
export declare class Settings {
    static getApiSettings(): Promise<IApiSettings>;
    static getPrayersApiURL(urlType?: string, urlTiming?: string): Promise<string>;
    static getPrayersSettings(): Promise<any>;
}
export {};
