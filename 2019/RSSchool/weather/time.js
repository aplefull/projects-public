function getReadableMonth(month, language) {
    const arr = {
        en: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
        ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    };

    return arr[language][month];
}

function getDay(time, language) {
    const day = new Date(time).getDay();
    const arr = {
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    };

    return arr[language][day];
}

function getPeriod(time) {
    const hours = new Date(time).getHours();
    if (hours < 12 && hours >= 0) return 'AM';
    return 'PM';
}

function getHours(time) {
    return (time.getHours() + 24) % 12 || 12;
}

function getMinutes(time) {
    let minutes = time.getMinutes();
    if (minutes.toString().length < 2) minutes = `0${minutes}`;
    return minutes;
}

function getCurrentDay(n, language) {
    const day = new Date().getDay();
    const arr = {
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    };
    let returnValue = day + n;

    if (returnValue > 6) returnValue -= 7;
    return arr[language][returnValue];
  }

export {
    getReadableMonth,
    getDay,
    getHours,
    getPeriod,
    getMinutes,
    getCurrentDay,
};