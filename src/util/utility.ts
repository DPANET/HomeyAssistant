import moment  from 'moment';
import momentTZ from 'moment-timezone';

export class DateUtil
{
    static getEndofDate(endDate: Date): Date {
        return moment.utc(endDate).endOf('D').toDate();
    }
    static addDay(days: number, dateNow: Date): Date {
     return   moment.utc(dateNow).add(1,'d').toDate();
    }
    static addMinutes(date:Date,minutes:number)
    {
        return moment.utc(date).add(minutes,'minute').toDate()
    }
    private static readonly format:string = 'YYYY-MM-DD';
    
    static getTime(date:string, time:string):Date
    {
       // console.log(`${date}, ${time}`);
        let timeFormat:string = 'DD MMM YYYY, hh:mm'
        // return moment.utc(`${date}, ${time}`,timeFormat).toDate();
        return moment(`${date}, ${time}`,timeFormat).toDate();
        //return new Date(date + ' '+time);
    }
    static getNowDate():Date
    {
        return moment.utc(new Date(),this.format).startOf('day').toDate();

    }
    static getNowTime():Date
    {
        return new Date();

    }

    static getYear(date: Date): any {
        return date.getUTCFullYear();

    }
    static getMonth(date: Date): number {
        return date.getUTCMonth()+1;
    
    }
    
    static addMonth(months:number ,date: Date): Date {

        return moment(date,this.format).add(months,'month').toDate();
    }
    static dayMatch(dateLeft:Date,dateRight:Date):boolean
    {
        let value:boolean =  
          (dateLeft.getUTCFullYear() === dateRight.getUTCFullYear()) &&
         (dateLeft.getUTCMonth() === dateRight.getUTCMonth()) &&
         (dateLeft.getUTCDate() === dateRight.getUTCDate());
       return value
    }
    public static  formatDate(date:string) :Date
    {
        return moment.utc(date,'DD MMM YYYY').toDate();

    }
    public static getDateByTimeZone(date:Date, timeZone:string): string
    {
        return momentTZ(date).tz(timeZone).format();

    }
    public static getDateByTimeZoneFromString(date:string,time:string,timeZone:string):Date
    {
        let timeFormat:string = 'DD MMM YYYY, hh:mm';
        //console.log(timeZone);
        //timeZone="Asia/Dubai"
        return moment.tz(`${date}, ${time}`,timeFormat,timeZone).toDate();

    }
    public static getStartOfDay(date:Date):Date
    {
        return moment.utc(date,this.format).startOf('day').toDate();
    }
    public static getMonthsDifference(startDate: Date, endDate: Date): number {
        let startMoment: moment.Moment = moment.utc(startDate,this.format).startOf('month');
        let endMoment: moment.Moment = moment.utc(endDate,this.format).startOf('day');
        return endMoment.diff(startMoment, 'M', false) ;

    }
}