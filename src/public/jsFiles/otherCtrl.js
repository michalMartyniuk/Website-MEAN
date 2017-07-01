var app = angular.module('app')

app.controller('homeCtrl', function ($scope, $http) {
	
	$scope.switches = switches
	$scope.$parent.mainMsg = 'Home'

	$scope.switchChange = function(state) {
		for(var key in $scope.switches) {
			if($scope.switches.hasOwnProperty(key)){
				if(key == state) {
					$scope.switches[key] = true
				}
				else {
					$scope.switches[key] = false
				}
			}				
		}	
	}
})

var switches = {
	education: false,
	tech: false,
	skills: false,
	profile: true
}


app.controller('registerCtrl', function ($scope) {
	$scope.$parent.mainMsg = 'Sign up'
})

app.controller('loginCtrl', function ($scope) {
	$scope.$parent.mainMsg = 'Login'
})

app.controller('profileCtrl', function ($scope) {
	$scope.$parent.mainMsg = 'Profile'
})

app.controller('errorCtrl', function ($scope) {
	$scope.$parent.mainMsg = 'Error'
})