'use strict';

angular.module('ngDB', [])
  .factory('db', function($log, $window) {
      var dbi = dbi || {},
          api = api || {};
      
      /***
       * Utility
       * Holder for helper functions and values
       **/
      var util = {
          version: '0.0.1'
      };
      
      
      /***
       * api.extend
       * Extends api with a provided function
       * @param {String} method - name of new method
       * @param {Function} func - function to extend
       * returns api.method to scope.
       **/
      api.extend = function(method, func) {
          api[method] = function () {
              return func.apply(this, arguments);
          };
      };
      
      /***
       * api.version
       * Returns db version.
       **/
      api.extend('version', function() {
          return util.version;
      });
      
      /***
       * api.create
       * Creates dbi.model with the provided model
       * @ param {Object} model
       * returns this for chaining.
       **/
      api.extend('create', function(model) {
          var max = 0;
          var ids = [];
          if (typeof model === 'object') {
              if (!Array.isArray(model)) {
                  model = [model];
              }
              for (var i in model) {
                  model[i]._id = max;
                  ids.push(max);
                  max++;
              }
              ids.splice(ids.length - 1, 1);
              dbi.maxId = max;
              dbi.model = model;
              $log.log('DB Created');
              return this;
          }
          else {
              $log.error('Model is not an Object');
          }
      });
      
      /***
       * api.update
       * Updates and exsisting record
       * @param {Number} id
       * @param {Object} obj
       **/
      api.extend('update', function(id, obj) {
          var record, objKeys, objVals = [];
          if (typeof obj === 'object') {
              if (typeof id === 'number') {
                  for (var i in obj) {
                      objKeys = Object.keys(obj);
                      for (var o in objKeys) {
                          objVals.push(obj[objKeys[o]]);
                      }
                  }
                  record = api.findById(id);
                  if (record) {
                      for (var i in objKeys) {
                          record[objKeys[i]] = objVals[i];
                          $log.log('Updated record with id', id);
                      }
                  }
                  else {
                      $log.log('Record not found.');
                  }
              }
              else {
                  $log.error('ID must be a number.');
              }
          }
          else {
              $log.error('Update obj is not an Object.')
          }
      });
      
      /***
       * api.findById
       * Finds a record by provided id
       * @param {Number} id
       * returns record if found.
       **/
      api.extend('findById', function(id) {
          if (typeof id === 'number') {
              for (var i in dbi.model) {
                  if (dbi.model[i]._id === id) {
                      return dbi.model[i];
                  }
              }
          }
          else {
              return $log.error('ID not found.');
          }
          
          return false;
      });
      
      /***
       * api.findOne
       * Finds one record with matching object properties
       * from the provided object
       * @param {Object} obj
       * returns one record.
       **/
      api.extend('findOne', function(obj) {
          var objKey, objVal;
          if (typeof obj === 'object') {
              objKey = Object.keys(obj);
              objVal = obj[objKey];
              for (var i in dbi.model) {
                  if (dbi.model[i].hasOwnProperty(objKey)) {
                      if (dbi.model[i][objKey] === objVal) {
                          return dbi.model[i];
                      }
                  } else {
                      return $log.error('No records match query.');
                  }
              }
          }
          return false;
      });
      
      /***
       * api.remove
       * Removes a record by the provided id
       * @param {Number} id
       * returns this for chaining.
       **/
      api.extend('remove', function(id) {
          var record;
          if (typeof id === 'number') {
              record = api.findById(id);
              if (record) {
                  if (dbi.model.indexOf(record)) {
                      dbi.model.splice(dbi.model.indexOf(record), 1);
                      $log.log('Record removed with id', id);
                      return this;
                  }
                  else {
                      $log.error('Record not found in model with id', id);
                  }
              }
              else {
                  $log.error('Record not found with id', id);
              }
          }
          else {
              $log.error('ID must be a number.');
          }
      });
      
      api.extend('storeDB', function(key) {
          if ($window.localStorage) {
              if (key) {
                  $window.localStorage.setItem(key, JSON.stringify(dbi.model));
                  $log.log('DB stored in localStorage');
                  return this;
              }
              else {
                  $window.localStorage.setItem('ngDBData', JSON.stringify(dbi.model));
                  $log.log('DB stored in localStorage');
                  return this;
              }
          }
          else {
              $log.error('Browser does not support localStorage.');
              return false;
          }
      });
      
      
      // needs work
      api.extend('find', function() {
          dbi.cache = [];
          dbi.model.forEach(function(data) {
              dbi.cache.push(data);
          });
          return dbi.cache;
      });
      
      return {
          api : api
      };
  });
