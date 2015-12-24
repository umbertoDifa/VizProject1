
var DEBUG = false;
"use strict";


//FILTER function
function filterData(dataset,state,year,sex){
	var that = this;

	
	function filterOptions(d){  
		
  return d.stateName == state && d.year==year && d.sex ==sex; 
}
return dataset.filter(filterOptions,that);
}

getKeyByValue = function(obj, value ) {
	for( var prop in obj ) {
		if( obj.hasOwnProperty( prop ) ) {
			if( obj[ prop ] === value )
				return prop;
		}
	}
}


