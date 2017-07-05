var app = angular.module('app')

app.controller('todoCtrl', function ($scope, $http) {
	
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

	// $scope.timeMsg = function(msg) {
		
	// 	$scope.$parent.errorMsg = msg

	// 	function parentMsg() {
	// 		$scope.$parent.errorMsg = originMsg
	// 	}

	// 	setTimeout(parentMsg, 3000)
	// }



	$scope.done = function() {
		if($scope.doneTasks.includes(this.task.name)) {
			$scope.switchChange('error')
		}
		else {
			$http.post('/doneTodo' + this.task.name)	
			this.delete()
			$scope.getTasks()
			$scope.switchChange('success')
		}
	}

	var valid = true
	$scope.add = function (){
		for(var i=0; i<$scope.tasks.length; i++){
			if($scope.tasks[i].name !== $scope.title && $scope.title !== "") {
				valid = true
			}
			else if($scope.title == ""){
				valid = false
				$scope.$parent.errMsg = true
				$scope.$parent.errorMsg = "Add field is empty"
				break
			}
			else if($scope.tasks[i].name == $scope.title){
				valid = false
				$scope.$parent.errMsg = true
				$scope.$parent.errorMsg = "This task already exists"
				break
			}
		}
		if(valid == true) {
			$http.post('/addTodo' + $scope.title).then(function (response) {
				$scope.getTasks()
				$scope.switchChange('success')
		
			}, function (response) {
				$scope.switchChange('error')
				$scope.$parent.errMsg = true
				$scope.$parent.errorMsg = response.statusText
			})
		}			
	}

	$scope.delete = function () {
		$http.delete('/delTodo' + this.task.name).then( function (response) {
			$scope.getTasks()
		})
		$scope.switchChange('success')
		$scope.$parent.errMsg = true
		$scope.$parent.errorMsg = "Your task has been deleted"
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
			$scope.$parent.errMsg = true
			$scope.$parent.errorMsg = "Edited task successfully"
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