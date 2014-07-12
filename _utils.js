'use strict';

//====================================================================

var d3 = require('d3');

//====================================================================

var isSvgElement = function (node) {
  return ('viewportElement' in node);
};

var makeAccessor = function (val) {
  return function (val_) {
    if (!arguments.length) {
      return val;
    }
    val_ = val;
    return this;
  };
};

//====================================================================

exports.defaults = require('lodash.defaults');
exports.prop = require('compiled-accessors').getter;

/**
 * Create accessors.
 *
 * @param {object} obj
 * @param {object} values - Names of the accessors to create and their
 *                 initial values.
 */
exports.makeAccessors = function (obj, values) {
  values.forEach(function (value, name) {
    obj[name] = makeAccessor(value);
  });
};

/**
 * @param {HTMLElement|SVGElement} parent
 * @param {object} attrs
 *
 * @return {object} D3.js element.
 */
exports.makeRoot = function (parent, attrs) {
  var $parent = d3.select(parent);

  var $root;
  if (isSvgElement(parent)) {
    $root = $parent.select('g');
    if ($root.empty()) {
      $root.append('g');
    }

    return $root;
  }

  $root = $parent.select('svg');
  if ($root.empty()) {
    attrs || (attrs = {});
    $root.append('svg').attr({
      // This attributes are required to form a valid SVG document.
      xmlns: 'http://www.w3.org/2000/svg',
      version: '1.1',

      // Defines the viewPort (displayed area) of the document.
      width: attrs.width,
      height: attrs.height,
    });
  }

  return $root;
};
