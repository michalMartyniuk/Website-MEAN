var app = angular.module('app', [])

app.controller('mainCtrl', function ($scope, $http) {

	$scope.listEnter = false
	$scope.Enter = false
	$scope.mainMsg = "Welcome"

	$scope.resetBck = function () {
		$http.post('/resetBck')
	}

	$scope.resetHeadBck = function () {
		$http.post('/resetHeadBck')
	}


	$scope.getUserData = function() {
		$http.get('/data').then( function (response) {
			var background = response.data.background
			var headlineB = response.data.headlineB
			
			$('#mainWrapper').css({
			'background-image': 'url(' + background + ')',
			'background-size': '100% 100%'
			})

			$('.jumbotron').css({
				'background-image': 'url('+ headlineB + ')',
				'background-size': '100% 100%'
			})

		}, function (response) {
				$scope.response = response.statusText
		})
	}

	$scope.getUserData()
})


		
