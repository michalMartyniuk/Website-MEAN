angular.module('app', [])

.controller('mainCtrl', function ($scope) {
	$scope.drop = drop
})


var drop = [
	{name: 'Home'},
	{name: 'Sign up'},
	{name: 'About'},
	{name: 'Contact'}
]