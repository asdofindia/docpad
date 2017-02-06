// Generated by CoffeeScript 1.12.3
var ElementsCollection, MetaCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ElementsCollection = require('./elements');


/**
 * Meta collection class. Collection of
 * document meta data strings
 * @class MetaCollection
 * @constructor
 * @extends ElementsCollection
 */

MetaCollection = (function(superClass) {
  extend(MetaCollection, superClass);

  function MetaCollection() {
    return MetaCollection.__super__.constructor.apply(this, arguments);
  }

  return MetaCollection;

})(ElementsCollection);

module.exports = MetaCollection;
