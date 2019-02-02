import moment = require('moment');
import momentTZ= require('moment-timezone');

export class DateUtil
{
    static addDay(days: number, dateNow: Date): Date {
     return   moment(dateNow).add(1,'d').toDate();
    }
    private static readonly format:string = 'YYYY-MM-DD';
    static getTime(date:string, time:string):Date
    {
        return new Date(date + ' '+time);
    }
    static getNowDate():Date
    {
        return new Date();

    }

    static getYear(date: Date): any {
        return date.getFullYear();

    }
    static getMonth(date: Date): number {
       // console.log('Date : '+ date);
        return date.getMonth()+1;
    
    }
    
    static addMonth(months:number ,date: Date): Date {

        return moment(date,this.format).add(1,'month').toDate();
    }
    static dayMatch(dateLeft:Date,dateRight:Date):boolean
    {
       return  (dateLeft.getFullYear() == dateRight.getFullYear()) &&
        (dateLeft.getMonth() === dateRight.getMonth()) &&
        (dateLeft.getDay() === dateRight.getDay());
    }
    public static  formatDate(date:string) :Date
    {
        if(!date.includes('Z'))
        return new Date(date + 'Z');
        else
        return new Date(date);
    }
    public static getMonthsDifference(startDate: Date, endDate: Date): number {
        let startMoment: moment.Moment = moment(startDate,this.format).startOf('month');
        let endMoment: moment.Moment = moment(endDate,this.format).startOf('day');
        return endMoment.diff(startMoment, 'M', false) ;

    }
}