/*global localStorage */

'use strict';

/*
 Creates a new client side storage object and initializes an empty
 collection if no collection already exists.
 @param {string} [name] The name of the table
 @param {function} [callback] Our fake DB uses callbacks because in
 real life you probably would be making AJAX calls
 */
var Store = function(name, callback) {
  callback = callback || function () {};

  this._dbName = name;

  if (!localStorage[name]) {
    var data = {
      collection: []
    };

    localStorage[name] = JSON.stringify(data);
  }

  callback.call(this, JSON.parse(localStorage[name]));
};

/*
 Finds items based on a query given as a JS object
 @param {object} [query] The query to match against (i.e. {foo: 'bar'})
 @param {function} [callback] The callback to fire when the query has
 completed running
 */
Store.prototype.find = function (query, callback) {
  if (!callback) {
    return;
  }

  var collection = JSON.parse(localStorage[this._dbName]).collection;

  callback.call(this, collection.filter(function (item) {
    for (var q in query) {
      if (query[q] !== item[q]) {
        return false;
      }
    }
    return true;
  }));
};

/*
 Will retrieve all data from the collection
 @param {function} [callback] The callback to fire upon retrieving data
 */
Store.prototype.findAll = function (callback) {
  callback = callback || function() {};
  callback.call(this, JSON.parse(localStorage[this._dbName]).collection);
};

/*
 Will save the given data to the DB. If no item exists it will create a new
 item, otherwise it'll simply update an existing items's properties
 @param {object} [updateData] The data to save back into the DB
 @param {function} [callback] The callback to fire after saving
 @param {number} [id] An optional param to enter an ID of an item to update
 */
Store.prototype.save = function (updateData, callback, id) {
  var data = JSON.parse(localStorage[this._dbName]);
  var collection = data.collection;

  callback = callback || function () {};

  // If the id was given, find the item and update each property
  if (id) {
    for (var i = 0; i < collection.length; i++) {
      if (collection[i].id === id) {
        for (var key in updateData) {
          collection[i][key] = updateData[key];
        }
        break;
      }
    }

    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, JSON.parse(localStorage[this._dbName]).collection);
  } else {
    // Generate and ID
    updateData.id = new Date().getTime();

    collection.push(updateData);
    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, updateData);
  }
};

/*
 Will remove an item for the Store based on its ID
 @param {number} [id] The ID of the item to remove
 @param {function} [callback] The callback to fire after saving
 */
Store.prototype.remove = function (id, callback) {
  var data = JSON.parse(localStorage[this._dbName]);
  var collection = data.collection;

  for (var i = 0; i < collection.length; i++) {
    if (collection[i].id === id) {
      collection.splice(i, 1);
      break;
    }
  }

  localStorage[this._dbName] = JSON.stringify(data);
  callback.call(this, JSON.parse(localStorage[this._dbName]).collection);
};

/*
 Will drop all storage and start fresh
 @param {function} [callback] The callback to fire after dropping the data
 */
Store.prototype.drop = function (callback) {
  localStorage[this._dbName] = JSON.stringify({collection: []});
  callback.call(this, JSON.parse(localStorage[this._dbName]).collection);
};

module.exports = Store;
