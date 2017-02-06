// Generated by CoffeeScript 1.12.3
var FileModel, FilesCollection, Model, QueryCollection, pathUtil, ref,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

pathUtil = require('path');

ref = require('../base'), QueryCollection = ref.QueryCollection, Model = ref.Model;

FileModel = require('../models/file');


/**
 * The DocPad files and documents query collection class
 * Extends the DocPad QueryCollection class
 * https://github.com/docpad/docpad/blob/master/src/lib/base.coffee#L91
 * Used as the query collection class for DocPad files and documents.
 * This differs from standard collections in that it provides backbone.js,
 * noSQL style methods for querying the file system. In DocPad this
 * is the various files that make up a web project. Typically this is the documents,
 * css, script and image files.
 *
 * Most often a developer will use this class to find (and possibly sort) documents,
 * such as blog posts, by some criteria.
 * 	posts: ->
 * 		@getCollection('documents').findAllLive({relativeOutDirPath: 'posts'},[{date:-1}])
 * @class FilesCollection
 * @constructor
 * @extends QueryCollection
 */

FilesCollection = (function(superClass) {
  extend(FilesCollection, superClass);

  function FilesCollection() {
    return FilesCollection.__super__.constructor.apply(this, arguments);
  }


  /**
  	 * Base Model for all items in this collection
  	 * @private
  	 * @property {Object} model
   */

  FilesCollection.prototype.model = FileModel;


  /**
  	 * Base Collection for all child collections
  	 * @private
  	 * @property {Object} collection
   */

  FilesCollection.prototype.collection = FilesCollection;


  /**
  	 * Initialize the collection
  	 * @private
  	 * @method initialize
  	 * @param {Object} attrs
  	 * @param {Object} [opts={}]
   */

  FilesCollection.prototype.initialize = function(attrs, opts) {
    var base;
    if (opts == null) {
      opts = {};
    }
    if (this.options == null) {
      this.options = {};
    }
    if ((base = this.options).name == null) {
      base.name = opts.name || null;
    }
    return FilesCollection.__super__.initialize.apply(this, arguments);
  };


  /**
  	 * Fuzzy find one
  	 * Useful for layout searching
  	 * @method fuzzyFindOne
  	 * @param {Object} data
  	 * @param {Object} sorting
  	 * @param {Object} paging
  	 * @return {Object} the file, if found
   */

  FilesCollection.prototype.fuzzyFindOne = function(data, sorting, paging) {
    var escapedData, file, i, len, queries, query;
    escapedData = data != null ? data.replace(/[\/]/g, pathUtil.sep) : void 0;
    queries = [
      {
        relativePath: escapedData
      }, {
        relativeBase: escapedData
      }, {
        url: data
      }, {
        relativePath: {
          $startsWith: escapedData
        }
      }, {
        fullPath: {
          $startsWith: escapedData
        }
      }, {
        url: {
          $startsWith: data
        }
      }
    ];
    for (i = 0, len = queries.length; i < len; i++) {
      query = queries[i];
      file = this.findOne(query, sorting, paging);
      if (file) {
        return file;
      }
    }
    return null;
  };

  return FilesCollection;

})(QueryCollection);

module.exports = FilesCollection;
