angular.module('app', [])

.controller('mainCtrl', function ($scope) {
	
	$scope.liDivs = liDivs	
	$scope.switchCheck = function (num, action) {
		if(action == 'enter') {
			liDivs[num].switch = true	
			for( var i=0; i<liDivs.length; i++) {
				if(liDivs[i].switch == false) {
					liDivs[i].switch2 = true
				}
			}	
		}
		else if(action == 'leave'){
			liDivs[num].switch = false
			for( var i=0; i<liDivs.length; i++) {
				liDivs[i].switch2 = false
			}
		}
	}
})

liDivs = [
	{ switch: false, switch2: false },
	{ switch: false, switch2: false },
	{ switch: false, switch2: false },
	{ switch: false, switch2: false },
	{ switch: false, switch2: false }
]




// liDivs.forEach( function ( item, index ) {
// 	if( index != 0 ){
// 		item[index].switch = true
// 	}
// })