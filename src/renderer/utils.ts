export const getWeekday = (date: Date | string) => {

    if (typeof date === 'string') {
        date = new Date(date);
    }

    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    return days[date.getDay()];
};

export const formatNumberToMinuteString = (v: number) => {
    v = clampMinutes(v);
    return v < 10 ? `0${v}` : v.toString();
};

export const formatNumberToHourString = (v: number) => {
    v = clampHours(v);
    return v < 10 ? `0${v}` : v.toString();
};

export const calculateTimeValue = (hours: number, minutes: number): number => {
    let minuteValue = 0;
    if (minutes >= 0 && minutes <= 15) {
        minuteValue = 0.25;
    } else if (minutes > 15 && minutes <= 30) {
        minuteValue = 0.5;
    } else if (minutes > 30 && minutes <= 45) {
        minuteValue = 0.75;
    } else if (minutes > 45) {
        hours += 1;
        minuteValue = 0;
    }
    return hours + minuteValue;
};

export const clampMinutes = (minutes: number): number => {
    if (minutes <= 0) {
        return 0;
    } else if (minutes >= 59) {
        return 59;
    }
    return minutes;
};

export const clampHours = (hours: number): number => {
    if (hours <= 0) {
        return 0;
    } else if (hours >= 23) {
        return 23;
    }
    return hours;
};

export const minuteStringToNumber = (newMinute: string): number => {
    let parsedNewMinute = parseInt(newMinute);

    if (Number.isNaN(parsedNewMinute)) {
        parsedNewMinute = 0;
    }

    return clampMinutes(parsedNewMinute);
};

export const hourStringToNumber = (newHour: string): number => {
    let parsedNewHour = parseInt(newHour);

    if (Number.isNaN(parsedNewHour)) {
        parsedNewHour = 0;
    }

    return clampHours(parsedNewHour);
};

export const areArraysEqual = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every(id => arr2.includes(id)) && arr2.every(id => arr1.includes(id));
};
