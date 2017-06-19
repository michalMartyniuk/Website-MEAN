var app = angular.module('app')

app.controller('homeCtrl', function ($scope) {
	$scope.$parent.mainMsg = 'Home'
})

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