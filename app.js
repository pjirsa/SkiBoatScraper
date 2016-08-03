var fs = require('fs');
var http = require('http');
var tabletojson = require('tabletojson');
var _ = require('underscore');
var json2csv = require('json2csv');
var cheerio = require('cheerio');

var url = 'http://www.ski-it-again.com/php/skiitagain.php?endless=summer&topic=Search&category=Comp_Boat';

var htmlResult = '';
http.get(url, (res) => {
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
        htmlResult += chunk;
    });

    res.on('end', () => {
        var $ = cheerio.load(htmlResult);
        var nested = $('table').find('table');
        var resultTable = nested.eq(2);
        // remove first 2 header rows
        resultTable.children().first().remove();
        resultTable.children().first().remove();
        // change header row to have th instead of td
        resultTable.children().first().children('td').each((i, elem) => {
            elem.name = 'th';
        });

        var rawHtml = '<table>' + resultTable.html() + '</table>';
        var tables = tabletojson.convert(rawHtml);
        var boatList = tables[0];
        var results = _.filter(boatList, function (data) {
            return data["POST ID"].length > 0;
        });

        console.log(JSON.stringify(results));

        fs.writeFile("./boats.json", JSON.stringify(results), 'utf8');

        var fields = ['POST ID', 'State', 'Year, Make and Model', 'Post Date', 'Asking $'];
        var csvResult = json2csv({ data: results, fields: fields });

        fs.writeFile("./boats.csv", csvResult, 'utf8');
    });
});