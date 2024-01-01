// convert javascript default date format to the string format
// For example. Sun Aug 20 2023 11:39:19 GMT-0400 (Eastern Daylight Time) -> 08/20/2023

export const convertDateToString = () => {
    let now = new Date(), month, day, year;
    let dateString;
    month = '' + (now.getMonth() + 1),
        day = '' + now.getDate(),
        year = now.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    dateString = [year, month, day].join('-');
    return dateString;
}