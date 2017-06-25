var app = angular.module('app', [])

app.controller('mainCtrl', function ($scope, $http) {

	// layoutNav Animation
	$scope.headlineEnter = false
	$scope.jumboDivs = jumboDivs	

	$scope.switchCheck = function (num, action) {
		if(action == 'enter') {
			jumboDivs[num].switch = true	
			for( var i=0; i<jumboDivs.length; i++) {
				if(jumboDivs[i].switch == false) {
					jumboDivs[i].switch2 = true
				}
			}	
		}
		else if(action == 'leave'){
			jumboDivs[num].switch = false
			for( var i=0; i<jumboDivs.length; i++) {
				jumboDivs[i].switch2 = false
			}
		}
	}










	// layoutNav Animation end

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


		
var jumboDivs = [
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
	{ switch: false, switch2: false, clickSwitch: false },
]
