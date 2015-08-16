'use strict';
var _ = require('underscore');

function SMA(data, index) {
  var start = index - 30;
  var sma = 0;
  for (var i = start; i < index; i++) {
    sma += data[i]
  }
  return sma / 30
}

function getNormalizedPower(watts_data) {
  var watt_sum = 0;
  var moving_averages = [];

  for (var i = 30; i <= watts_data.length; i++) {
    moving_averages.push(SMA(watts_data, i));
  }
  moving_averages = _.map(moving_averages, function(num) {
    return Math.pow(num, 4);
  })

  var avg = _.reduce(moving_averages, function(memo, num) {
    return memo + num;
  }, 0) / moving_averages.length;

  return Math.round(Math.pow(avg, 1/4));
}

function getVi(np, avgWatts) {
  return (np / avgWatts).toFixed(2);
}

function getIf(np, ftp) {
  return (np / ftp).toFixed(2);
}

function tss(intensityFactor, duration) {
  return (Math.pow(intensityFactor, 2) * 100 * (duration / 3600)).toFixed(2);
}

module.exports = {
  getNormalizedPower: getNormalizedPower,
  tss: tss,
  getIf: getIf,
  getVi: getVi,
};
