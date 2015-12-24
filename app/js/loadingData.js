var dataset; // global dataset var
var usPopulation; //global var for us population
var panel;
var usedPanels=[];
var worldStateNames = [];
var years =[];
var graphColor = ['#91bfdb','#ffffbf','#fc8d59'];
loadFiles();

//LOAD FILE ASYNCHRONOUSLY
function loadFiles(afterFunction){
  queue() //NB. no guarantees on which method ends first

  .defer(collectData,"data/IDBcleaned/dataof2014sexDistinction.csv")
  .defer(collectStateNames,"data/IDBcleaned/worldStateNames.csv")
  .defer(collectYears,"data/IDBcleaned/anni.csv")
  .defer(collectUsaState,"data/IDBcleaned/usPopulation.csv")
  .awaitAll(ready);
}


function ready(error,result){
 panel = setUpLayout();

 //var slider = new Slider(panel['timeline']); 
 var map = new Map(panel['map']);//ALWAYS CREATE MAP BEFORE CHARTS
 var ageSplitter = new AgeSplitter(panel['timeline']);
 var granularity = new GranularityTool(panel['timeline']);
 var timeline = new Timeline(panel['timeline'],ageSplitter);

 usedPanels =[0,0,0,0,0,0]; //initialize free panels
 map.createMap(granularity,ageSplitter); 
 
 

}



//COLLECT DATA WORLD POPULATION
function collectData (path,callback){
  d3.csv(path , function(error,data) {

   if (error) {  //If error is not null, something went wrong.
          console.log(error);  //Log the error.

        } else {      //If no error, the file loaded correctly. Yay!
          data.forEach(function(d){
            //group the age counts in an array
            d['age'] = [+d['0']];
            delete d['0'];
            for(i = 1; i < 101; i ++){ //101 is the range of ages from 0 to 100
              d['age'].push(+d[i.toString()]);
              delete d[i.toString()];
            }            
          }
          );         
          //log(data);   //Log the data.
          dataset = data;
        }
        callback(null,null);
      });
  
}

//LOAD DATA ABOUT US STATES POPULATION
function collectUsaState(path,callback){

 d3.csv(path , function(error,data) {

   if (error) {  //If error is not null, something went wrong.
          console.log(error);  //Log the error.

        } else {      //If no error, the file loaded correctly. Yay!
          data.forEach(function(d){
            //group the age counts in an array
            d['age'] = [+d['0']];
            delete d['0'];
            for(i = 1; i < 86; i ++){ //86 is the range of ages from 0 to 85+
              d['age'].push(+d[i.toString()]);
              delete d[i.toString()];
            }            
          }
          );          
          //log(data);   //Log the data.
          usPopulation = data;
        }
        callback(null,null);
      });

}
//LOAD STATE NAMES
function collectStateNames(path,callback){
  d3.csv(path , function(error,data) {

   if (error) {  //If error is not null, something went wrong.
          console.log(error);  //Log the error.

        } else {      //If no error, the file loaded correctly. Yay!
          data.forEach(function(d){
            worldStateNames.push(d['x']) ;        
          });          
          log(worldStateNames);
        }      
        callback(null,null);
      });
}

  //LOAD YEARS AVAILABLE
  function collectYears(path,callback){
   d3.csv(path , function(error,data) {

   if (error) {  //If error is not null, something went wrong.
          console.log(error);  //Log the error.

        } else {      //If no error, the file loaded correctly. Yay!
          data.forEach(function(d){
            years.push(d['x']) ;        
          });          
          //log(years);
        }     
        years.sort(function(a, b){return a-b});

        callback(null,null);
      });
 }

 function log(roba){
  if(DEBUG == true){
    console.log(roba)
  };
}

