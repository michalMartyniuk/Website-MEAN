var app = angular.module('app')

app.controller('todoCtrl', function ($scope, $http) {
	
	const originMsg = $scope.$parent.mainMsg

	$scope.originMsg = originMsg
	
	$scope.$parent.mainMsg = "To-do"
	$scope.tasks = []
	$scope.doneTasks = []
	$scope.title = ""
	$scope.switches = switches
	$scope.taskName = ""
	$scope.editVal = ""

	$scope.getTasks = function() {
		$http.get('/data').then(function (response) {
			$scope.tasks = response.data.tasks.inProgress 
			$scope.doneTasks = response.data.tasks.done
		}, function (response) {
			$scope.response = response.statusText
		})
	}

	$scope.getTasks()

	$scope.timeMsg = function(msg) {
		
		$scope.$parent.mainMsg = msg

		function parentMsg() {
			$scope.$parent.mainMsg = originMsg
		}

		setTimeout(parentMsg, 3000)
	}



	$scope.done = function() {
		if($scope.doneTasks.includes(this.task.name)) {
			$scope.switchChange('error')

			$scope.timeMsg("This task already exists")
		}
		else {
			$http.post('/doneTodo' + this.task.name)	
			this.delete()
			$scope.getTasks()
			$scope.switchChange('success')

			$scope.timeMsg("Your task has been deleted and added to your Done list")
		}
	}

	$scope.add = function (){
		if(!($scope.tasks.includes($scope.title)) && $scope.title !== ""){
			$http.post('/addTodo' + $scope.title).then(function (response) {
				$scope.getTasks()
				$scope.switchChange('success')

				$scope.timeMsg("Your task was added successfully")
			}, function (response) {
				$scope.switchChange('error')
				$scope.$parent.mainMsg = response.statusText
			})
		}

		else if($scope.title == ""){
			$scope.switchChange('empty')
			$scope.timeMsg("Task field is empty. Please enter task to add.")
			
		}
		else if($scope.tasks.includes($scope.title)) {
			$scope.switchChange('error')
			$scope.timeMsg("This task already exists")
			
		}
	}

	$scope.delete = function () {
		$http.delete('/delTodo' + this.task.name)
		$scope.getTasks()
		$scope.switchChange('success')
		$scope.$parent.mainMsg = "Your task has been deleted"
	}

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

	var task = ""
	
	$scope.edit = function() {
		if (this.task.edit == true) {
			$http.post('/editTodo' + task + '/' + this.task.name)
			$scope.getTasks()
			$scope.switchChange('success')
			$scope.$parent.mainMsg = "Edited task successfully"
		}

		else if (this.task.edit == false) {
			this.task.edit = true
			task = this.task.name
		}
	}
})

var switches = {
	success: false,
	empty: false,
	error: false,
	done: false
}