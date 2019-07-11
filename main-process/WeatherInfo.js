'use strict';

import {
    load,
} from 'cheerio';

export default class WeatherInfo {
    static GetLocalweatherInfo(content) {
        let location;
        let temperature;
        let weathertext;
        let weatherimg;

        try {
            const all = load(content);
            location = all('span.sp2.f1').html();
            temperature = all('span.sp1.f1').html();
            weathertext = all('span.sp3').html();
            weatherimg = all('img.pngtqico')[0].attribs.src;
        } catch (error) {
            return null;
        }
        return [location, temperature, weathertext, weatherimg];
    }
}