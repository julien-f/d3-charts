// # Example chart
//
// This chart is an example and its sole purpose is to explain how to
// create charts and to show some good practices.

//====================================================================

// Always use strict mode!
'use strict';

//====================================================================

// D3.js will probably be necessary.
var d3 = require('d3');

// As well as common chart utilities.
var utils = require('./_utils');

//====================================================================

/**
 * Create an instance of this chart.
 *
 * @returns {function}
 */
var createChart = function () {
  /**
   * (Re)Draw the chart.
   *
   * @param {HTMLElement|SVGElement} node - The node in which to draw.
   */
  var chart = function (node) {
    // Create (update if existing) the root element of our chart.
    var $root = utils.makeRoot(node, {
      width: chart.width(),
      height: chart.height(),
    });

    // If you use margin, apply a translation.
    $root = $root.append('g'); // TODO
  };

  // Create accessors and initializes with default values.
  utils.makeAccessors(chart, createChart.defaults);

  // Returns our chart.
  return chart;
};

// A good practice is to declare configurable options outside of
// createChart() and to expose it to make the defaults configurable.
createChart.defaults = {
  // Size.
  width: 800,
  height: 600,

  // Key function (used for data join).
  key: undefined,

  // Accessors.
  x: utils.prop('x'),
  y: utils.prop('y'),

  // As many things as possible should be exposed to make the chart
  // extremely flexible (e.g. margin, scales, axes, labels).
  marginTop: 20,
  marginRight: 20,
  marginBottom: 20,
  marginLeft: 20,
  color: 'red',
};

//====================================================================

// Exports the chart.
module.exports = createChart;
