var fs = require('fs');
var tabletojson = require('tabletojson');

var inputData = fs.readFileSync('./boats.html', 'utf8');

var tables = tabletojson.convert(inputData);
var boatList = tables[0];
fs.writeFile("./boats.json", JSON.stringify(boatList), 'utf8');