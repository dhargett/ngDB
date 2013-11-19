angular.module('app')
.factory('ng', function($log) {
var api = {};

/***
 * api.create *chainable
 * creates dbi array from the model provided as the
 * parameter the model provided may be an Object or an Array.
 * @param {Object} model
 * @return {Object} this
 **/
api.create = function(model) {
  var i, o, max = 0;
  this.idArr = [];
  if ( typeof model === 'object' ) {
    if ( Object.prototype.toString.call(model) != '[object Array]') {
      model = [model];
    }
    //If array has id fields, cache highest id and idArr
      if (model[0].id) {
        for (i in model) {
          this.idArr.push(model[i].id);
        }
        for (o in this.idArr) {
          if (this.idArr[o] > max) {
            max = this.idArr[o];
          }
        }
        this.idArr.splice(this.idArr.length - 1,1);
        this.dbiID = max;
        this.dbi = model;
        $log.log('Created dbi');
        return this;
      }
      else {
        // if no id add id fields to each record
        for (i in model) {
          
          model[i].id = max;
          this.idArr.push(max);
          max += 1;
        }
        // remove extra id
        this.idArr.splice(this.idArr.length - 1,1);
        // set max id
        this.dbiID = max;
        // set dbi model
        this.dbi = model;
        $log.log('Created dbi');
        return this;
      }
  }
};

/***
 * STILL NEEDS WORK, WILL RETURN ALL RESULTS 
 * BUT NOT BY SPECIFEC PARAMETERS
 * api.find
 * returns an array containing results matching 
 * the object provided as the parameter.
 * @param {Object} obj
 * @return {Array} arr
 **/
api.find = function(obj) {
  var o, x, key, val, keys = [], vals = [], arr = [];
  if ( typeof obj === 'object' ) {

     // loop through properties in obj then push
     // each key and value to their corresponding arrays
    for (var prop in obj) {
      key = Object.keys(obj);
      
      for (o in key) {
        vals.push(obj[key[o]]);
      }
    }

    // loop through keys and vals then set vars
    for (o in key) {
      var k = key[o], v = vals[o];
      
      // loop through dbi
      for (x in this.dbi) {
        
        // check if dbi-key matches key(k)
        if ((this.dbi)[x].hasOwnProperty(k)) {
          
          // check if dbi-key value matches value(v)
          if ((this.dbi)[x][k] === v) {
            
            // check if array contains dbi record
            //////////fix////////
            //finds one
              arr.push(this.dbi[x]);

          }
        }
      }
      
      for (var t = 0; t < arr.length; t++) {
        // need to loop through arr now
        if (arr[t][k] != v) {
          arr.splice(t,1);
        }
      }
      
    }
    if (arr.length !== 0) {
      
      return arr;
    }
  }
  else {
    return this.dbi; 
  }
  return false;
}; 

/***
 * api.findOne
 * returns one object matching the
 * object provided as the parameter.
 * @param {Object} obj
 * @return {Object} this.dbi[i]
 **/
api.findOne = function (obj) {
  var key, val, i;
  if (typeof obj === 'object') {
    key = Object.keys(obj);
    val = obj[key];
    
    for (i in this.dbi) {
      if (this.dbi[i].hasOwnProperty(key)) {
        if (this.dbi[i][key] === val) {
          return this.dbi[i];
        }
      }
    }
  }
  return false;
};

/***
 * api.findId
 * returns one object matching the
 * number provided as the parameter.
 * @param {Number} obj
 * @return {Object} this.dbi[i]
 **/
api.findId = function (id) {
  var i;
  if (typeof id === 'number') {
    for (i in this.dbi) {
      if (this.dbi[i].id === id) {
        return this.dbi[i];
      }
    }
  }
  return false;
};

/***
 * api.update *chainable
 * updates record with properties in object
 * and by id provided in parameters.
 * @param {Object} obj
 * @param {Number} id
 **/
api.update = function (obj, id) {
  var record = null, key, val, vals = [], i, o;
  if (typeof obj === 'object' && typeof id === 'number') {
    
    for (i in obj) {
      key = Object.keys(obj);
      for (o in key) {
        vals.push(obj[key[o]]);
      }
    
    }

    record = api.findId(id);
    if (record !== null) {
      for (o in key) {
        
        var k = key[o], v = vals[o];
        
        record[k] = v;
        $log.log('Updated record with id(' + id + ')');
        
      }
    } else {
      $log.log('Update Error : record not found with id - ' + id);
    }
  }
  else {
    return false;
  }
  return this;
};

/***
 * api.remove
 * removes record in dbi with corresponding
 * id provided as the parameter.
 * @param {Number} id
 **/
api.remove = function (id) {
  var i;
  if (typeof id === 'number') {
    for (i in this.dbi) {
      if (this.dbi[i].id === id) {
        this.dbi.splice(i % this.dbi.length, 1);
        $log.log('Removed record with id(' + id + ')');
        return this;
      }
    }
  }
  else {
    $(log).error('remove() Error : id(' + id + ') is not a number');
  }
  $(log).error('remove() Error : id(' + id + ') was not found');
  return false;
};

/***
 * return api methods
 **/
  return {
    DB: api
  };
});

/***
 * Array.prototype.contains
 * Helper Function
 * returns true if item is found in specified array
 * @param {Object} item
 **/
Array.prototype.contains = function ( item ) {
   for (var i in this) {
       if (this[i] == item) { return true }
   }
   return false;
};
