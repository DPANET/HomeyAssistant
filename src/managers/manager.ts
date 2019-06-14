
const to = require('await-to-js').default;
import ramda = require('ramda');
import * as location from '../entities/location';
import * as prayer from '../entities/prayer';
import * as pp from '../providers/prayer-provider';
import * as lp from '../providers/location-provider';
import { ILocationConfig, IPrayersConfig } from "../configurators/inteface.configuration";
import {Configurator} from "../configurators/configuration"; 
import validators = require('../validators/interface.validators');
import {PrayerSettingsValidator,LocationValidator,ConfigValidator} from "../validators/validator";
//import validators = val.validators;
import { isNullOrUndefined } from '../util/isNullOrUndefined';
import { DateUtil } from '../util/utility';
import {IPrayerManager,ILocationBuilder,IPrayerSettingsBuilder,IPrayerTimeBuilder} from "./interface.manager"

export class PrayerSettingsBuilder implements IPrayerSettingsBuilder {

    private _prayerSettings: prayer.IPrayersSettings;
    private _prayerProvider: pp.IPrayerProvider;
    private _validtor: validators.IValid<prayer.IPrayersSettings>;
    private constructor(prayerProvider: pp.IPrayerProvider, validator: validators.IValid<prayer.IPrayersSettings>, prayerConfig?: IPrayersConfig) {
        this._prayerProvider = prayerProvider;
        this._validtor = validator;
        this._prayerSettings = new prayer.PrayersSettings();
        if (!isNullOrUndefined(prayerConfig)) {
            this._prayerSettings.midnight.id = isNullOrUndefined(prayerConfig.midnight) ? prayer.MidnightMode.Standard : prayerConfig.midnight;
            this._prayerSettings.method.id = isNullOrUndefined(prayerConfig.method) ? prayer.Methods.Mecca : prayerConfig.method;
            this._prayerSettings.adjustments = isNullOrUndefined(prayerConfig.adjustments) ? this._prayerSettings.adjustments : prayerConfig.adjustments;
            this._prayerSettings.school.id = isNullOrUndefined(prayerConfig.school) ? prayer.Schools.Shafi : prayerConfig.school;
            this._prayerSettings.latitudeAdjustment.id = isNullOrUndefined(prayerConfig.latitudeAdjustment) ? prayer.LatitudeMethod.Angle : prayerConfig.latitudeAdjustment;
            this._prayerSettings.startDate = isNullOrUndefined(prayerConfig.startDate) ? DateUtil.getNowDate() : prayerConfig.startDate;
            this._prayerSettings.endDate = isNullOrUndefined(prayerConfig.endDate) ? DateUtil.addMonth(1, DateUtil.getNowDate()) : prayerConfig.endDate;
            this._prayerSettings.adjustmentMethod.id = isNullOrUndefined(prayerConfig.adjustmentMethod) ? prayer.AdjsutmentMethod.Server : prayerConfig.adjustmentMethod;
        }
        else {
            this._prayerSettings.midnight.id = prayer.MidnightMode.Standard;
            this._prayerSettings.method.id = prayer.Methods.Mecca;
            this._prayerSettings.adjustments = this._prayerSettings.adjustments;
            this._prayerSettings.school.id = prayer.Schools.Shafi;
            this._prayerSettings.adjustmentMethod.id = prayer.AdjsutmentMethod.Server;
            this._prayerSettings.latitudeAdjustment.id = prayer.LatitudeMethod.Angle;
            this._prayerSettings.startDate = DateUtil.getNowDate();
            this._prayerSettings.endDate = DateUtil.addMonth(1, DateUtil.getNowDate());
        }
    }
    public setPrayerAdjustmentMethod(adjustmentMethodId: prayer.AdjsutmentMethod): IPrayerSettingsBuilder {
        this._prayerSettings.adjustmentMethod.id = adjustmentMethodId;
        return this;
    }
    public setPrayerMethod(methodId: prayer.Methods): IPrayerSettingsBuilder {
        this._prayerSettings.method.id = methodId;
        return this;
    }
    public setPrayerSchool(schoolId: prayer.Schools): IPrayerSettingsBuilder {
        this._prayerSettings.school.id = schoolId;
        return this;
    }
    public setPrayerAdjustments(adjustments: prayer.IPrayerAdjustments[]): IPrayerSettingsBuilder {
        this._prayerSettings.adjustments = adjustments;
        return this;
    }
    public setPrayerMidnight(midnightId: prayer.MidnightMode): IPrayerSettingsBuilder {
        this._prayerSettings.midnight.id = midnightId;
        return this;
    }
    public setPrayerPeriod(startDate: Date, endDate: Date): IPrayerSettingsBuilder {
        this._prayerSettings.startDate = DateUtil.getStartOfDay(startDate);
        this._prayerSettings.endDate = endDate;
        return this;
    }
    public setPrayerLatitudeAdjustment(latitudeAdjustment: prayer.LatitudeMethod): IPrayerSettingsBuilder {
        this._prayerSettings.latitudeAdjustment.id = latitudeAdjustment;
        return this;
    }
    public async createPrayerSettings(): Promise<prayer.IPrayersSettings> {
        let validationErr: validators.IValidationError;
        let validationResult: boolean = false;
        validationResult =this._validtor.validate(this._prayerSettings);
        if (validationResult===false)
            return Promise.reject(this._validtor.getValidationError());
        if (validationResult) {
            try {
                this._prayerSettings.method = await this._prayerProvider.getPrayerMethodsById(this._prayerSettings.method.id);
                this._prayerSettings.latitudeAdjustment = await this._prayerProvider.getPrayerLatitudeById(this._prayerSettings.latitudeAdjustment.id);
                this._prayerSettings.midnight = await this._prayerProvider.getPrayerMidnightById(this._prayerSettings.midnight.id);
                this._prayerSettings.school = await this._prayerProvider.getPrayerSchoolsById(this._prayerSettings.school.id);
                this._prayerSettings.adjustmentMethod = await this._prayerProvider.getPrayerAdjustmentMethodById(this._prayerSettings.adjustmentMethod.id);
                return this._prayerSettings;

            }
            catch (error) {
                return Promise.reject(error);
            }
        }
    }
    public static createPrayerSettingsBuilder(prayerConfig?: IPrayersConfig, prayerProvider?: pp.IPrayerProvider): IPrayerSettingsBuilder {
        let prayerProviderName: pp.IPrayerProvider = pp.PrayerProviderFactory
            .createPrayerProviderFactory(pp.PrayerProviderName.PRAYER_TIME);
        let validate: validators.IValid<validators.ValidtionTypes> = PrayerSettingsValidator.createValidator();
        return new PrayerSettingsBuilder(prayerProviderName, validate, prayerConfig);
    }

};

export class LocationBuilder implements ILocationBuilder {
    private _location: location.ILocationSettings
    private _locationProvider: lp.ILocationProvider;
    private _validtor: validators.IValid<location.ILocationSettings>;
    private constructor(locationProvider: lp.ILocationProvider, validator: validators.IValid<location.ILocationSettings>, locationConfig?: ILocationConfig) {
        this._locationProvider = locationProvider;
        this._validtor = validator;
        this._location = new location.Location();
        if (!isNullOrUndefined(locationConfig)) {
            this._location.latitude = isNullOrUndefined(locationConfig.location.latitude) ? null : locationConfig.location.latitude;
            this._location.longtitude = isNullOrUndefined(locationConfig.location.longtitude) ? null : locationConfig.location.longtitude;
            this._location.countryCode = isNullOrUndefined(locationConfig.location.countryCode) ? null : locationConfig.location.countryCode;
            this._location.countryName = isNullOrUndefined(locationConfig.location.countryName) ? null : locationConfig.location.countryName;
            this._location.address = isNullOrUndefined(locationConfig.location.address) ? null : locationConfig.location.address;
            this._location.city = isNullOrUndefined(locationConfig.location.city) ? null : locationConfig.location.city;
            this._location.timeZoneId = isNullOrUndefined(locationConfig.timezone.timeZoneId) ? null : locationConfig.timezone.timeZoneId;
            this._location.timeZoneName = isNullOrUndefined(locationConfig.timezone.timeZoneName) ? null : locationConfig.timezone.timeZoneName;
            this._location.rawOffset = isNullOrUndefined(locationConfig.timezone.rawOffset) ? null : locationConfig.timezone.rawOffset;
            this._location.dstOffset = isNullOrUndefined(locationConfig.timezone.dstOffset) ? null : locationConfig.timezone.dstOffset;
        }

    }
    public setLocationCoordinates(lat: number, lng: number): ILocationBuilder {
        this._location.latitude = lat;
        this._location.longtitude = lng;
        return this;
    }
    public setLocationAddress(address: string, countryCode?: string): ILocationBuilder {
        this._location.countryCode = countryCode;
        this._location.address = address;
        return this;
    }
    public async createLocation(): Promise<location.ILocationSettings> {
        let validationErr: validators.IValidationError, validationResult: boolean = false;
        let providerErr: Error, locationResult: location.ILocation, timezoneResult: location.ITimeZone;
        validationResult = this._validtor.validate(this._location);
        if (validationResult===false)
            return Promise.reject(this._validtor.getValidationError());
    
            if (!isNullOrUndefined(this._location.latitude))
                [providerErr, locationResult] = await to(this._locationProvider.getLocationByCoordinates(this._location.latitude, this._location.longtitude));

            else if ((!isNullOrUndefined(this._location.address))) 
                [providerErr, locationResult] = await to(this._locationProvider.getLocationByAddress(this._location.address, this._location.countryCode));
                
            
            if (providerErr)
                    return Promise.reject(providerErr);

            [providerErr, timezoneResult] = await to(this._locationProvider.getTimeZoneByCoordinates(locationResult.latitude, locationResult.longtitude));
            if (providerErr)
                return Promise.reject(providerErr);
            this._location = ramda.mergeWith(ramda.concat, locationResult, timezoneResult);
            return Promise.resolve(this._location);
    
    
    }

    public static createLocationBuilder(locationConfig?: ILocationConfig, ILocationProvider?: lp.ILocationProvider): LocationBuilder {
        let providerName: lp.ILocationProvider = lp.LocationProviderFactory.
            createLocationProviderFactory(lp.LocationProviderName.GOOGLE);
        let validate: validators.IValid<validators.ValidtionTypes> = LocationValidator.createValidator();
        return new LocationBuilder(providerName, validate, locationConfig);
    }

};

export class PrayerTimeBuilder implements IPrayerTimeBuilder {

    private _locationBuilder: ILocationBuilder;
    private _prayerSettingsBuilder: IPrayerSettingsBuilder;
    private _prayers: Array<prayer.IPrayers>;
    private _prayerProvider: pp.IPrayerProvider;
    private constructor(prayerProvider: pp.IPrayerProvider, locationBuilder: ILocationBuilder, prayerSettingsBuilder: IPrayerSettingsBuilder) {
        this._prayerSettingsBuilder = prayerSettingsBuilder;
        this._locationBuilder = locationBuilder;
        this._prayerProvider = prayerProvider;
        this._prayers = new Array<prayer.Prayers>();
    }
    public setPrayerMethod(methodId: prayer.Methods): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerMethod(methodId);

        return this;
    }
    public setPrayerSchool(schoolId: prayer.Schools): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerSchool(schoolId);
        return this;
    }
    public setPrayerAdjustments(adjustments: prayer.IPrayerAdjustments[]): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerAdjustments(adjustments);
        return this;
    }
    public setPrayerMidnight(midnightId: prayer.MidnightMode): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerMidnight(midnightId);
        return this;
    }
    public setPrayerLatitudeAdjustment(latitudeAdjustment: prayer.LatitudeMethod): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerLatitudeAdjustment(latitudeAdjustment);
        return this;
    }
    public setPrayerPeriod(startDate: Date, endDate: Date): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerPeriod(startDate, endDate);
        return this;
    }
    public setLocationByCoordinates(lat: number, lng: number): IPrayerTimeBuilder {
        this._locationBuilder.setLocationCoordinates(lat, lng);
        return this;
    }
    public setLocationByAddress(address: string, countryCode?: string): IPrayerTimeBuilder {
        this._locationBuilder.setLocationAddress(address, countryCode);
        return this;
    }
    setPrayerAdjustmentMethod(adjustmentMethodId: prayer.AdjsutmentMethod): IPrayerTimeBuilder {
        this._prayerSettingsBuilder.setPrayerAdjustmentMethod(adjustmentMethodId);
        return this;
    }
    public async createPrayerTime(): Promise<prayer.IPrayersTime> {
       
        let location: location.ILocationSettings, prayerSettings: prayer.IPrayersSettings;
        try {
            // location = await this._locationBuilder.createLocation();
            // prayerSettings = await this._prayerSettingsBuilder.createPrayerSettings()
            await Promise.all([ this._locationBuilder.createLocation(), this._prayerSettingsBuilder.createPrayerSettings()])
             .then((result:any)=>
             {   
                 location= result[0];
                 prayerSettings= result[1];

             });

            this._prayers = await this._prayerProvider.getPrayerTime(prayerSettings, location);
            this._prayers = await this.adjustPrayers(this._prayers, prayerSettings);
            return Promise.resolve(new prayer.PrayersTime(this._prayers, location, prayerSettings));
        }
        catch (err) {
            return Promise.reject(err);
        }
        
    }
    private adjustPrayers(prayers: prayer.IPrayers[], prayerSettings: prayer.IPrayersSettings): prayer.IPrayers[] {
        //  let adjustTimingFN = ramda.find<>(n => n.prayerName === prayerName, this.getPrayerAdjsutments());
        //console.log(prayers);
        switch (prayerSettings.adjustmentMethod.id) {
            case prayer.AdjsutmentMethod.Provider:
            break;
            case prayer.AdjsutmentMethod.Server:
            case prayer.AdjsutmentMethod.Client:
            prayers = this.adjustServerPrayers(prayers, prayerSettings);
            break;
        }
        return prayers
    }
    private adjustServerPrayers(prayers: prayer.IPrayers[], prayerSettings: prayer.IPrayersSettings): prayer.IPrayers[] {
        var prayerName = ramda.prop('prayerName');
        var prayerTime = ramda.lensProp('prayerTime')
        var indexedByAdjustment = ramda.indexBy(prayerName, prayerSettings.adjustments)
        var indexByPrayerTime = (value: prayer.IPrayers) => ramda.indexBy(prayerName, value.prayerTime)
        var defaultPrayersAdjustments = (o: prayer.IPrayers) => ramda.set(prayerTime, ramda.map(ramda.assoc('adjustments', 0), o.prayerTime), o)
        var lensPrayers = (prayerTimeObject: prayer.IPrayers) => ramda.set(prayerTime, indexByPrayerTime(prayerTimeObject), prayerTimeObject);
        var mergePrayerAdjustment = (prayerTimeObject: prayer.IPrayers) =>
            ramda.set(prayerTime,
                ramda.values
                    (ramda.mergeDeepRight(prayerTimeObject.prayerTime, indexedByAdjustment)),
                prayerTimeObject);
        var addObject = (o: any) => ramda.set(prayerTime, DateUtil.addMinutes( o.prayerTime,o.adjustments), o);
        var pluckObject = ramda.dissoc('adjustments')
        var addPrayerAdjustment =
            (prayerTimeObject: prayer.IPrayers) => ramda.set(
                prayerTime, ramda.map(ramda.pipe(addObject, pluckObject), prayerTimeObject.prayerTime), prayerTimeObject)
        return ramda.map(ramda.pipe(defaultPrayersAdjustments,
            lensPrayers,
            mergePrayerAdjustment, addPrayerAdjustment), prayers);
    }
    public async createPrayerTimeManager(): Promise<IPrayerManager> {
        try {
            let prayersTime: prayer.IPrayersTime = await this.createPrayerTime();

            let prayerManager: IPrayerManager = new PrayerManager(prayersTime, this);
            return Promise.resolve(prayerManager);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    public static createPrayerTimeBuilder(locationConfig?: ILocationConfig, prayerConfig?: IPrayersConfig): PrayerTimeBuilder {
        let prayerProvider: pp.IPrayerProvider = pp.PrayerProviderFactory.createPrayerProviderFactory(pp.PrayerProviderName.PRAYER_TIME);
        let locationBuilder: ILocationBuilder = LocationBuilder
            .createLocationBuilder(isNullOrUndefined(locationConfig) ? null : locationConfig);
        let prayerSettingsBuilder: IPrayerSettingsBuilder = PrayerSettingsBuilder
            .createPrayerSettingsBuilder(isNullOrUndefined(prayerConfig) ? null : prayerConfig);
        return new PrayerTimeBuilder(prayerProvider, locationBuilder, prayerSettingsBuilder);
    }
};
class PrayerManager implements IPrayerManager {



    private _prayerTime: prayer.IPrayersTime;
    private _prayerTimeBuilder: IPrayerTimeBuilder;
   // private _prayerEvents: prayer.PrayerEvents;
    constructor(prayerTime: prayer.IPrayersTime, prayerTimeBuilder: IPrayerTimeBuilder) {
        this._prayerTime = prayerTime;
     //   this._prayerEvents = new prayer.PrayerEvents();
        this._prayerTimeBuilder = prayerTimeBuilder;
    }
    public async savePrayerConfig(prayerConfig: IPrayersConfig): Promise<boolean> {
       try{
        let validator: validators.IValid<IPrayersConfig> =ConfigValidator.createValidator();
        let validationResult: boolean = validator.validate(prayerConfig);
        let validationErr: validators.IValidationError;
        if(validationResult ===false)
            return Promise.reject(validator.getValidationError());        
        let configurator:Configurator = new Configurator();
        await configurator.savePrayerConfig(prayerConfig);
        return Promise.resolve(true)
       }
        catch(err)
        {
          return  Promise.reject(err);
        }
    }
    public getPrayerTimeZone(): location.ITimeZone {
        return {
            timeZoneId: this._prayerTime.location.timeZoneId,
            timeZoneName: this._prayerTime.location.timeZoneName,
            dstOffset: this._prayerTime.location.dstOffset,
            rawOffset: this._prayerTime.location.rawOffset
        };
    }
    public getPrayerLocation(): location.ILocation {
        return {
            latitude: this._prayerTime.location.latitude,
            longtitude: this._prayerTime.location.longtitude,
            city: this._prayerTime.location.city,
            countryCode: this._prayerTime.location.countryCode,
            countryName: this._prayerTime.location.countryName,
            address: this._prayerTime.location.address
        
        };
    }
    public getPrayerLocationSettings():location.ILocationSettings
    {
        return {
            latitude: this._prayerTime.location.latitude,
            longtitude: this._prayerTime.location.longtitude,
            city: this._prayerTime.location.city,
            countryCode: this._prayerTime.location.countryCode,
            countryName: this._prayerTime.location.countryName,
            address: this._prayerTime.location.address,
            timeZoneId: this._prayerTime.location.timeZoneId,
            timeZoneName: this._prayerTime.location.timeZoneName,
            dstOffset: this._prayerTime.location.dstOffset,
            rawOffset: this._prayerTime.location.rawOffset
        }
    }
    public getPrayerStartPeriod(): Date {
        return this._prayerTime.pareyerSettings.startDate;
    }
    public getPrayerEndPeriond(): Date {
        return DateUtil.getEndofDate(this._prayerTime.pareyerSettings.endDate);
    }
    public getUpcomingPrayerTimeRemaining(): Date {
        throw new Error("Method not implemented.");
    }
    public getPrviouesPrayerTimeElapsed(): Date {
        throw new Error("Method not implemented.");
    }
    public getPrayerConfig(): IPrayersConfig {
        return {
            method: this._prayerTime.pareyerSettings.method.id,
            midnight: this._prayerTime.pareyerSettings.midnight.id,
            school: this._prayerTime.pareyerSettings.school.id,
            latitudeAdjustment: this._prayerTime.pareyerSettings.latitudeAdjustment.id,
            adjustmentMethod: this._prayerTime.pareyerSettings.adjustmentMethod.id,
            startDate: this.getPrayerStartPeriod(),
            endDate: this.getPrayerEndPeriond(),
            adjustments: this._prayerTime.pareyerSettings.adjustments
        };
    }
    public getLocationConfig(): ILocationConfig {
        return {

            location:
            {
                latitude: this._prayerTime.location.latitude,
                longtitude: this._prayerTime.location.longtitude,
                city: this._prayerTime.location.city,
                countryCode: this._prayerTime.location.countryCode,
                countryName: this._prayerTime.location.countryName,
                address: this._prayerTime.location.address
            },
            timezone: {
                timeZoneId: this._prayerTime.location.timeZoneId,
                timeZoneName: this._prayerTime.location.timeZoneName,
                dstOffset: this._prayerTime.location.dstOffset,
                rawOffset: this._prayerTime.location.rawOffset
            }

        }
    }
    public getPrayerTime(prayerName: prayer.PrayersName, prayerDate?: Date): prayer.IPrayersTiming {
        let prayersByDate: prayer.IPrayers = this.getPrayersByDate(prayerDate);
        if (!isNullOrUndefined(prayersByDate)) {
            return ramda.find<prayer.IPrayersTiming>(n => n.prayerName === prayerName, prayersByDate.prayerTime);
        }
        return null;
    }
    public getPrayersByDate(date: Date): prayer.IPrayers {
        let fnDayMatch = (n: prayer.IPrayers) => DateUtil.dayMatch(date, n.prayersDate);
        return ramda.find(fnDayMatch, this._prayerTime.prayers);
    }
    public getUpcomingPrayer(date?: Date, prayerType?: prayer.PrayerType): prayer.IPrayersTiming {
        let dateNow: Date;
        if (isNullOrUndefined(date))
            dateNow = DateUtil.getNowTime();
        else
            dateNow = date;

        if (dateNow > this.getPrayerEndPeriond() || dateNow < this.getPrayerStartPeriod())
            return null;
        let orderByFn = ramda.sortBy<prayer.IPrayersTiming>(ramda.prop('prayerTime'));
        let upcomingPrayer: prayer.IPrayersTiming = null;
        let fardhPrayers: Array<prayer.IPrayerType> = prayer.PrayersTypes.filter((n) => n.prayerType === prayer.PrayerType.Fardh);
        let todayPrayers: prayer.IPrayers = this.getPrayersByDate(dateNow);
        if (!isNullOrUndefined(todayPrayers)) {
            let listOfPrayers: Array<prayer.IPrayersTiming> = orderByFn(todayPrayers.prayerTime);
            //filter on fardh prayers.
            listOfPrayers = ramda.innerJoin
                ((prayerLeft: prayer.IPrayersTiming, prayerRight: prayer.IPrayerType) => prayerLeft.prayerName === prayerRight.prayerName
                    , listOfPrayers
                    , fardhPrayers);
            //find next prayer based on prayertype
            for (let i: number = 0, prev, curr; i < listOfPrayers.length; i++) {
                prev = listOfPrayers[i], curr = listOfPrayers[i + 1];
                upcomingPrayer = this.processUpcomingPrayer(prev, curr, i + 1, listOfPrayers, dateNow);
                if (!isNullOrUndefined(upcomingPrayer))
                    return upcomingPrayer;
            }
        }
        return upcomingPrayer;
    }
    private processUpcomingPrayer(prev: prayer.IPrayersTiming, curr: prayer.IPrayersTiming, index: number, array: Array<prayer.IPrayersTiming>, dateNow: Date): prayer.IPrayersTiming {

        if (prev.prayerTime >= dateNow)
            return array[index - 1];
        else if (!isNullOrUndefined(curr) && prev.prayerTime <= dateNow && curr.prayerTime >= dateNow)
            return array[index];
        else if (isNullOrUndefined(curr) && array.length === index) {
            let nextDay: Date = DateUtil.addDay(1, dateNow);
            if (nextDay > this.getPrayerEndPeriond())
                return null;
            return this.getPrayerTime(prayer.PrayersName.FAJR, nextDay);
        }
        return null
    }
    public getPreviousPrayer(): prayer.IPrayersTime {
        return;
    }
    public async updatePrayersDate(startDate: Date, endDate: Date): Promise<IPrayerManager> {
        try {
            this._prayerTime = await this._prayerTimeBuilder
                .setPrayerPeriod(startDate, endDate)
                .createPrayerTime();
            return this;
        } catch (err) {
            return Promise.reject(err);
        }
    }
    getPrayerSettings(): prayer.IPrayersSettings {
        return this._prayerTime.pareyerSettings;
    }
    getPrayerAdjsutments(): prayer.IPrayerAdjustments[] {
        return this._prayerTime.pareyerSettings.adjustments;
    }
    getPrayerAdjustmentsByPrayer(prayerName: prayer.PrayersName): prayer.IPrayerAdjustments {
        return ramda.find<prayer.IPrayerAdjustments>(n => n.prayerName === prayerName, this.getPrayerAdjsutments());
    }
    getPrayers(): prayer.IPrayers[] {
        return this._prayerTime.prayers;
    }
}



