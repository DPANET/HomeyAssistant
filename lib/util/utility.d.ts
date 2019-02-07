export declare class DateUtil {
    static getEndofDate(endDate: Date): Date;
    static addDay(days: number, dateNow: Date): Date;
    private static readonly format;
    static getTime(date: string, time: string): Date;
    static getNowDate(): Date;
    static getYear(date: Date): any;
    static getMonth(date: Date): number;
    static addMonth(months: number, date: Date): Date;
    static dayMatch(dateLeft: Date, dateRight: Date): boolean;
    static formatDate(date: string): Date;
    static getMonthsDifference(startDate: Date, endDate: Date): number;
}
