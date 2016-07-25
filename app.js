var fs = require('fs');
var tabletojson = require('tabletojson');
var _ = require('underscore');

var inputData = fs.readFileSync('./boats.html', 'utf8');

var tables = tabletojson.convert(inputData);
var boatList = tables[0];
var results = _.filter(boatList, function(data){
    return data["POST ID"].length > 0;
});

fs.writeFile("./boats.json", JSON.stringify(results), 'utf8');