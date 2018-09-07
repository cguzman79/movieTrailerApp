var myApp = angular.module('myApp',[]);
myApp.controller('AppCtrl',['$scope','$http',function($scope,$http){
	console.log("The controller is working!");
	
	var refresh = function(){
		$http.get('/movies').success(function(response){
			console.log("I got the data I requested!");
			$scope.trailers = response;
			$scope.trailer = "";
		});	
	};
	
	refresh();
	
	$scope.addTrailer = function(){
		console.log($scope.trailer);
		$http.post('/movies', $scope.trailer).success(function(response){
			console.log(response);
			refresh();
		});
	}
	
	$scope.remove = function(id){
		console.log(id);
		$http.delete('/movies/' + id).success(function(response){
			console.log(response);
			refresh();
		});
	}
	
	$scope.edit = function(id){
		console.log(id);
		$http.get('/movies/' + id).success(function(response){
			$scope.trailer=response;
			
			
		});
	}
	
	$scope.update = function(){
		console.log($scope.trailer._id);
		$http.put('/movies/' + $scope.trailer._id, $scope.trailer).success(function(response){
			refresh();		
		})
	
	};
	
	$scope.deselect = function(){
		$scope.trailer = "";
	}
	
	
	
}]);

