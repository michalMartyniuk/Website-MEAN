angular.module('app', [])

.controller('mainCtrl', function($scope){
	$scope.tasks = tasks
	$scope.switches = switches

	$scope.switches.success = true
	$scope.switchKeys = []
	for (var key in switches) {
		if (switches.hasOwnProperty(key)) {
			switches[key] = !switches[key]
		}
	}


})

var switches = {
	success: false,
	empty: false,
	error: false,
	done: false
}


var tasks = [
	{ name: 'John', editS: true },
	{ name: 'Andrew', editS: true }
]
