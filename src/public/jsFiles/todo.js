var app = angular.module('app')

app.controller('todoCtrl', function ($scope, $http) {
	
	$scope.testArray = ['blazej', 'pawel', 'ela', 'kacper', 'slkdfjsd', 'ldksgfdlkg', 'dflkjgdfs', 'aslkfjgsfl', 'alfkgjdfl', 'slkgjsfdlg']
	$scope.$parent.mainMsg = "Task manager"
	$scope.tasks = []
	$scope.doneTasks = []
	$scope.title = ""
	$scope.switches = switches
	$scope.taskName = ""
	$scope.editVal = ""
	$scope.editText = "Edit"
	$scope.taskList = true
	$scope.clearBtnSwitch = false

	$scope.getTasks = function() {
		$http.get('/data').then(function (response) {
			$scope.tasks = response.data.tasks.inProgress 
			$scope.doneTasks = response.data.tasks.done
		}, function (response) {
			$scope.response = response.statusText
		})
	}

	$scope.getTasks()

	$scope.clearBtn = function(){
		if($scope.doneTasks.length > 0){
			$scope.clearBtnSwitch = true
		}
	}

	$scope.clearTasks = function() {
		$http.post('/clearTasks').then( function (response){
			$scope.clearBtnSwitch = false;
			$scope.getTasks()
			$scope.$parent.errorMsg = "Task list successfully cleared"
		})
	}

	$scope.done = function() {
		if($scope.doneTasks.includes(this.task.name)) {
			$scope.$parent.errorMsg = "This task is already done"
		}
		else{
			$http.post('/doneTodo' + this.task.name).then( function (response) {
				$scope.taskList = false
				$scope.doneList = true
				$scope.clearBtnSwitch = true;				
			})
			
			this.delete("Your task has been moved to your done tasks")
			$scope.getTasks()
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
				$scope.doneList = false;
				$scope.taskList = true;
				$scope.title = ""
		
			}, function (response) {
				$scope.switchChange('error')
				$scope.$parent.errMsg = true
				$scope.$parent.errorMsg = response.statusText
			})
		}			
	}

	$scope.delete = function (msg) {
		$http.delete('/delTodo' + this.task.name).then( function (response) {
			$scope.getTasks()
		})
		$scope.switchChange('success')
		$scope.$parent.errMsg = true
		if(msg == undefined){
			$scope.$parent.errorMsg = "Your task has been deleted"
		}
		else {
			$scope.$parent.errorMsg = msg
		}
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
			$scope.editText = "Edit"
			$http.post('/editTodo' + task + '/' + this.task.name)
			$scope.getTasks()
			$scope.switchChange('success')
			$scope.$parent.errMsg = true
			$scope.$parent.errorMsg = "Edited task successfully"
		}

		else if (this.task.edit == false) {
			$scope.editText = 'Accept'
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