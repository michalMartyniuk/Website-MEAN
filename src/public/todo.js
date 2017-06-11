angular.module('app', [])

.controller('mainCtrl', function ($scope) {
	$scope.tasks = tasks
	$scope.doneTasks = doneTasks
	$scope.title = ""
	$scope.editModel = ""
	$scope.switches = switches

	$scope.switchChange = function(state) {
		for(var key in switches) {
			if(switches.hasOwnProperty(key)) {
				if(key == state) {
				 	switches[key] = true
				}
				else {
					switches[key] = false
				}
			}
		}	
	}

	$scope.done = function() {
		$scope.doneTasks.push(this.task.name)
		this.delete()
		$scope.switchChange('success')
		$scope.msg = "Your task has been deleted and added to your Done list"
	}

	$scope.edit = function() {
		var index = $scope.tasks.indexOf(this.task)
		if(!this.task.editS) {
			this.task.editS = true
		}
		else {
			$scope.tasks.splice(index, 1, {name: this.editModel, editS: false})
			$scope.switchChange('success')
			$scope.msg = "Edited task successfully"
		}
	}

	$scope.delete = function () {
		var index = $scope.tasks.indexOf(this.task)
		$scope.tasks.splice(index, 1)
		$scope.switchChange('success')
		$scope.msg = "Task: " + this.task.name + " was deleted successfully"
	}

	$scope.add = function (){
		if(!($scope.tasks.includes($scope.title)) && $scope.title !== ""){
			$scope.switchChange('success')
			$scope.tasks.push({name: $scope.title, editS: false})
			$scope.msg = "Your task was added successfully"
			
		}
		else if($scope.title == ""){
			$scope.switchChange('empty')
			$scope.msg = "Task field is empty. Please enter task to add."
			
		}
		else if($scope.tasks.includes($scope.title)) {
			$scope.switchChange('error')
			$scope.msg = "This task already exists"
			
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
	{ name: 'John', editS: false },
	{ name: 'Lucas', editS: false }
]

var doneTasks = []





