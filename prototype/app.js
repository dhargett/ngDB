
angular.module('app', ['ng'])
.controller('MainCtrl', function($scope, ng) {
  
  $scope.createFindChain = ng.DB.create([{test:'yes'},{test:'still'}]).find();
  ng.DB.update({test:'again',field2:'here'},1);
  $scope.findId = ng.DB.findId(1);
  ng.DB.remove(1);
});
