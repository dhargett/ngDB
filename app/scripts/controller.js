'use strict';

angular.module('app')
  .controller('AppCtrl', function ($scope, db) {
      $scope.version = db.api.version();
      
      db.api.create([{name:'pete'},{name: 'doug'}]);
      
      // find function so we can update $scope.db later.
      var find = function() {
        $scope.db = db.api.find();
      };
      // initial find
      find();
      
      
      
      
      $scope.id = db.api.findById(1);
      
      $scope.findOne = db.api.findOne({_id: 0});
      
      $scope.update = {};
      $scope.updateRecord = function() {
          db.api.update(parseFloat($scope.update.id), {name: $scope.update.name, age: $scope.update.age});
      };
      
      $scope.remove = {};
      $scope.removeRecord = function() {
          db.api.remove($scope.remove.id);
          // update $scope.db
          find();
      };
      
      $scope.storeDB = function() {
        db.api.storeDB();
      };
  });
