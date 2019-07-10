'use strict';

const cheerio = require('cheerio');

class weatherInfo {
    constructor() {
        this.GetLocalWeatherinfo = (content) => {
            const rets = new Array(5);
            try {
                const tmp$ = cheerio.load(content);
                const allcontenthtml = tmp$('dl[class=weather_info]').html();
                const html = cheerio.load(allcontenthtml);
                const temperature = html('p[class=now]').text();
                rets[0] = temperature;
                const barometer = html('dd[class=weather]').children('span').children('b').text();
                rets[1] = barometer;
                rets[2] = html('dd[class=shidu]').children().first().text().substring(3, html('dd[class=shidu]').children().first().text().length);
                rets[3] = html('dd[class=shidu]').children().first().next().text().substring(3, html('dd[class=shidu]').children().first().next().text().length);
                rets[4] = html('dd[class=shidu]').children().last().text().substring(4, html('dd[class=shidu]').children().last().text().length);
                const pm = html('dd[class=kongqi]').children('h6').text();
                rets[5] = pm.substring(4, pm.length);
            } catch (error) {
                return null;
            }
            return rets;
        };
    }
}
export default weatherInfo;