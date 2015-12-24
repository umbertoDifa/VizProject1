//**CLASS MAP**//

var Map = function(divPanel){
	this.panel = divPanel;
	
	this.projection; 


	this.viewBoxWidth = 8196;
	this.viewBoxHeight = 2188;

	this.currentMap;
	this.mapG; //g container for the maps

	this.granularityTool;
	this.ageSplitter;

	this.usNames;
	this.usMap;
	this.usMappingIdToMap={};

	this.worldDictionary={};
	this.worldMap;
	this.worldPath;

	this.currentMenu;
	this.currentArrow;

	this.chart = {};


}

Map.prototype.createMap = function(granularity,ageSplitter){
	var that = this;
	this.granularityTool = granularity;
	this.ageSplitter = ageSplitter;

	this.projection= d3.geo.albersUsa()
	.scale(this.viewBoxWidth*4/3)
	.translate([this.viewBoxWidth/2, this.viewBoxHeight/2]);

	var path = d3.geo.path()
	.projection(this.projection);

	var svg = this.panel
	.append("svg")
	.attr("viewBox", "0 0 "+ this.viewBoxWidth+" "+this.viewBoxHeight) //VIEWBOX OF THE MAP
	.style('width','100%')
	.style('height', '100%');

	
	var usMapG = svg.append("g").attr('id','usMap' );
	var worldMapG = svg.append("g").attr('id','worldMap' );
	this.currentMap = usMapG;

	this.mapG = svg.append('g');
	this.mapG.append("svg:text").text("U.S").on('click',function(){
		d3.select('#worldButton').attr('text-decoration','none' );
		d3.select('#usButton').attr('text-decoration','underline' );
		(that.currentArrow) ? that.currentArrow.attr('visibility', 'hidden'): function(){};
		(that.currentMenu)? that.currentMenu.attr('visibility', 'hidden'):function(){};
		that.changeMap('us');})
	.attr("x", function(){		
		return that.viewBoxWidth * 0.6;
	})
	.attr("y", function(){
		return  that.viewBoxHeight * 1.7;
	})
	.attr("text-anchor","middle")
	.attr('fill', 'black')
	.attr('text-decoration','underline' )
	.attr('id','usButton' )
	.attr('font-size', that.viewBoxWidth * 0.03);

	this.mapG.append("svg:text").text("World").on('click',function(){	
		d3.select('#worldButton').attr('text-decoration','underline' );
		d3.select('#usButton').attr('text-decoration','none' );
		(that.currentArrow) ? that.currentArrow.attr('visibility', 'hidden'): function(){};
		(that.currentMenu)? that.currentMenu.attr('visibility', 'hidden'):function(){};
		that.changeMap('world');})
	.attr("x", function(){		
		return that.viewBoxWidth * 0.75;
	})
	.attr("y", function(){
		return  that.viewBoxHeight * 1.7;
	})
	.attr("text-anchor","middle")
	.attr('fill', 'black')
	.attr('id','worldButton' )
	.attr('font-size', that.viewBoxWidth * 0.03);	   

	//call both the maps but show only us and hide world
	queue()
	.defer(showUsMap)
	.defer(showWorldMap)
	.awaitAll();


	//***CREATE MENU
	this.mapG.append('text')
	.attr('text-anchor', 'middle')
	.attr('dominant-baseline', 'central')
	.attr('font-family', 'FontAwesome')
	.attr('font-size', 200)
	.attr('x', this.viewBoxWidth * 0.19)
	.attr('y',  function(){
		return  that.viewBoxHeight * 1.65;
	})
	.on('click',showStateList)
	.text(function(d) { return '\uf13a'; });

	this.mapG.append('text')
	.attr('text-anchor', 'middle')
	.attr('dominant-baseline', 'central')	
	.attr('font-size', 200)
	.attr('id',"listMenu" )
	.attr('x', this.viewBoxWidth * 0.12 )
	.attr('y',  function(){
		return  that.viewBoxHeight * 1.65;
	})
	.on('click',toggleList)
	.text("States List");

	var toggling = true;
	function toggleList(){
		if(toggling){
			showStateList();
			toggling = !toggling;
		}else{
			//nothing to do
			that.currentMap.attr('visibility', 'hidden');
			that.currentArrow.attr('visibility', 'visible');
			that.currentMenu.attr('visibility', 'visible');
		}
	}

	//create var for svg tendina usa
	var svgMenuUs = that.mapG.append("svg").attr('id', 'tendinaUs');
	var svgMenuWorld = that.mapG.append("svg").attr('id', 'tendinaWorld');
	var rectangleWorld= svgMenuWorld.append("rect");
	var rectangle=svgMenuUs.append("rect");

	function showStateList(){
		that.currentMap.attr('visibility','hidden');
		that.currentMenu=d3.select("#tendinaUs");
		that.currentArrow=d3.select('#leftArrow');
		d3.select("#tendinaUs").attr('visibility', 'visible');
		//d3.select("#tendinaUs").attr('visibility', 'visible');

		//create us menu
		svgMenuUs
		.attr('y', -that.viewBoxHeight * 0.2)
		.attr('width', that.viewBoxWidth * 0.9)
		.attr('height', that.viewBoxHeight * 2);
		
		rectangle 
		.attr("x", that.viewBoxWidth * 0.05 )
		.attr("y", -that.viewBoxHeight * 0.5)
		.attr("width", that.viewBoxWidth * 0.9)
		.attr("height", that.viewBoxHeight * 2)
		.attr('fill', 'grey');

		//create world menu
		svgMenuWorld
		.attr('y', -that.viewBoxHeight * 0.2)
		.attr('width', that.viewBoxWidth * 0.9)
		.attr('height', that.viewBoxHeight * 2);

		rectangleWorld 
		.attr("x", that.viewBoxWidth * 1.5 )
		.attr("y", -that.viewBoxHeight * 0.5)
		.attr("width", that.viewBoxWidth * 0.9)
		.attr("height", that.viewBoxHeight * 2)
		.attr('fill', 'grey');
		
		//create left arrow control
		that.mapG.append('text')
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'central')
		.attr('font-family', 'FontAwesome')
		.attr('id','leftArrow' )
		.attr('font-size', 200)
		.attr('x', that.viewBoxWidth*0.03)
		.attr('y',  function(){
			return  that.viewBoxHeight * 0.5;
		})
		.on('click',changeToWorld)
		.text(function(d) { return '\uf137'; });

		//create rigth arrow control
		that.mapG.append('text')
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'central')
		.attr('font-family', 'FontAwesome')
		.attr('id','rightArrow' )
		.attr('font-size', 200)
		.attr('x', that.viewBoxWidth*0.92)
		.attr('y',  function(){
			return  that.viewBoxHeight * 0.5;
		})
		.on('click',changeToUs)
		.text(function(d) { return '\uf138'; });

		d3.select("#rightArrow").attr('visibility', 'hidden');
		d3.select("#leftArrow").attr('visibility', 'visible');


		var bb = [];
		log(that.usNames);
		for(i in that.usNames){
			bb.push(that.usNames[i]);
		}

		var xSpace = 1300;
		var ySpace = 230;
		var wordInAColumn = 12;
		var xOffset = 900;
		var yOffset = 400;

		tendinaUsText = svgMenuUs.append("g")
		.attr("class", "states-names")
		.selectAll("text")
		.data(bb)
		.enter()
		.append("svg:text")
		.text(function(d){
			return d.slice(0,20);
		})
		.attr("x", function(d,i){
			
			return (Math.floor(i / wordInAColumn) * xSpace)+xOffset;
		})
		.attr("y", function(d,i){
			return (i % wordInAColumn) * ySpace + yOffset;
		})
		.attr('font-size', 150)
		.attr("text-anchor","start")
		.attr('fill', 'black')
		.on('click', function(){			
			var id = getKeyByValue(that.usNames,this.innerHTML);
			log(this.innerHTML);
			var mapIndex = that.usMappingIdToMap[id];		
			addGraph(id,mapIndex);

			d3.select("#tendinaUs").attr('visibility', 'hidden');
			that.currentMap.attr('visibility','visible');

		});	

		var tendinaWorldText = svgMenuWorld.append("g")
		.attr("class", "states-names")
		.selectAll("text")
		.data(Object.keys(that.worldDictionary))
		.enter()
		.append("svg:text")
		.text(function(d){
			return d;
		})
		.attr("x", function(d,i){
			
			return 2*that.viewBoxWidth;
		})
		.attr("y", function(d,i){
			return (i % wordInAColumn) * ySpace + yOffset;
		})
		.attr('font-size', 150)
		.attr("text-anchor","start")
		.attr('fill', 'black')
		.on('click', function(){			
			var id = that.worldDictionary[this.innerHTML];				
			addWorldGraph(this.innerHTML,id);

			d3.select("#tendinaWorld").attr('visibility', 'hidden');
			that.currentMap.attr('visibility','visible');

		});	

		function changeToWorld(){
			d3.select('#worldButton').attr('text-decoration','underline' );
			d3.select('#usButton').attr('text-decoration','none' );
			that.currentMenu = d3.select("#tendinaWorld");
			rectangle.transition().duration(1000).attr('x', -that.viewBoxWidth);			
			tendinaUsText.transition().duration(1000).attr('x',function(d,i){return (Math.floor(i / wordInAColumn) * xSpace)+xOffset-9200;});
			rectangleWorld.transition().duration(1000).attr('x', that.viewBoxWidth * 0.05);
			tendinaWorldText.transition().duration(1000).attr('x',function(d,i){return (Math.floor(i / wordInAColumn) * xSpace*2)+xOffset;});
			that.currentArrow=d3.select("#rightArrow");
			d3.select("#rightArrow").attr('visibility', 'visible');
			d3.select("#leftArrow").attr('visibility', 'hidden');
		}

		function changeToUs(){
			d3.select('#worldButton').attr('text-decoration','none' );
			d3.select('#usButton').attr('text-decoration','underline' );
			that.currentMenu=d3.select("#tendinaUs");
			d3.select("#tendinaUs").attr('visibility', 'visible');
			rectangle.transition().duration(1000).attr('x', that.viewBoxWidth * 0.05);			
			tendinaUsText.transition().duration(1000).attr('x',function(d,i){return (Math.floor(i / wordInAColumn) * xSpace)+xOffset;});
			rectangleWorld.transition().duration(1000).attr('x', that.viewBoxWidth * 1.5);
			tendinaWorldText.transition().duration(1000).attr('x',function(d,i){return 2*that.viewBoxWidth;});
			that.currentArrow=d3.select("#leftArrow");
			d3.select("#rightArrow").attr('visibility', 'hidden');
			d3.select("#leftArrow").attr('visibility', 'visible');
		}
		
	}

	function showUsMap(){

		d3.json("map/us.json", function(error, us) {
			if (error) throw error;

			var map = topojson.feature(us, us.objects.states).features;
			that.usMap = map;

			d3.tsv("map/us-state-names.tsv", function(tsv){
				var names = {};
				tsv.forEach(function(d,i){
					names[d.id] = d.name;
				});		
				that.usNames = names;

				usMapG
				.append("path")
				.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
				.attr("class", "state-borders")
				.attr("d", path);

				usMapG
				.append("g")
				.attr("class", "states")
				.selectAll("path")
				.data(map)
				.enter()
				.append("path")
				.attr("d", path)
				.attr('id',function(d){
					return "usPath"+d.id;
				} )
				.on('click', showStateName);

				map.forEach(function(d,i){
					that.usMappingIdToMap[d.id.toString()] = i;
					log(d.properties.name);
				});			

				setTimeout(startLayout, 1500);

				function startLayout(){
					fireEvent(document.getElementById("circle5"),'click');
					fireEvent(document.getElementById("usPath17"),'click');
					fireEvent(document.getElementById("manPlusWomanIcon"),'click');

				}
				function fireEvent(obj,evt){

					var fireOnThis = obj;
					if( document.createEvent ) {
						var evObj = document.createEvent('MouseEvents');
						evObj.initEvent( evt, true, false );
						fireOnThis.dispatchEvent(evObj);
					} else if( document.createEventObject ) {
						fireOnThis.fireEvent('on'+evt);
					}
				}

			});


});

}

function addGraph(id,i){
	log('id e i');
	log(id);
	log(i);
	log(this);		
	if(d3.select("#usPath"+id).classed('active') == false){
		if(usedPanels.indexOf(0) == -1){
			return; 
					//nothing to do if all the panels are busy
				}
				d3.select("#usPath"+id).classed('active',true);

					//agigungere nomi
					usMapG
					.append("g")
					.attr("class", "states-names")			
					.append("svg:text").attr('id','textUs'+id)
					.style("pointer-events", "none")
					.text(function(){
						return that.usNames[id];
					})
					.attr("x", function(){
						return path.centroid(that.usMap[i])[0];
					})
					.attr("y", function(){
						return  path.centroid(that.usMap[i])[1];
					})
					.attr('font-size', 300)
					.attr("text-anchor","middle")
					.attr('fill', 'black');

					var index = usedPanels.indexOf(0);
					
					//d3.select("#usPath"+id).style('fill',panel["panel"+index].style('background-color'));
					d3.select("#usPath"+id).style('fill',graphColor[index/2]);

					//e crea i grafi
					var color = graphColor[index/2];
					var barChart = new BarChart(index,that,that.usNames[id],2014,2,0,84,usPopulation,color);
					barChart.createBarChart(); 
					barChart.setId("barChartUs"+id);
					that.chart["barChartUs"+id]= barChart;
					usedPanels[index]=1;
					//subscribe chart to granularity events
					that.granularityTool.addChart(barChart);
					that.ageSplitter.addChart(barChart);

					index = usedPanels.indexOf(0);
					var pie = new PieChart(index,that,that.usNames[id],2014,2,0,84,usPopulation,color);
					pie.createPieChart();
					pie.setId("pieChartUs"+id);
					usedPanels[index]=1;
					//subscribe chart to granularity events
					that.granularityTool.addChart(pie);
					that.ageSplitter.addChart(pie);

				}else{
					d3.select("#usPath"+id).classed('active',false);
					d3.select("#usPath"+id).style('fill', 	'inherit');

					d3.select('#textUs'+id).remove();

					//e elimina i grafi
					var index = d3.select('#barChartUs'+id).attr('panelIndex');
					d3.select('#barChartUs'+id).remove();
					
					that.chart["barChartUs"+id].remove = true;

					maxYvalues[index] = -1;
					minYvalues[index] = 9999999999;
					
					usedPanels[index]=0;

					index = d3.select('#pieChartUs'+id).attr('panelIndex');
					d3.select('#pieChartUs'+id).remove();
					usedPanels[index]=0;
				}



			}

			function addWorldGraph(name,id){

				if(d3.select("#worldPath"+id).classed('active') == false){
					if(usedPanels.indexOf(0) == -1){
						return; 
						//nothing to do if all the panels are busy
					}

					d3.select("#worldPath"+id).classed('active',true);

					worldMapG.append("svg:text").attr('id','textWorld'+id)
					.style("pointer-events", "none")
					.text(name)
					.attr('font-size',that.viewBoxWidth/30 )
					.attr("x", function(){
						return that.worldPath.centroid(that.worldMap[id])[0];
					})
					.attr("y", function(){
						return  that.worldPath.centroid(that.worldMap[id])[1];
					})
					.attr("text-anchor","middle")
					.attr('fill', 'black');

					//e crea i grafi
					var index = usedPanels.indexOf(0);
					//d3.select("#worldPath"+id).style('fill',panel["panel"+index].style('background-color'));
					d3.select("#worldPath"+id).style('fill',graphColor[index/2]);

					//e crea i grafi
					var color = graphColor[index/2];
					var barChart = new BarChart(index,that,name,2014,2,0,100,dataset,color);
					barChart.createBarChart(); 
					barChart.setId("barChartWorld"+id);
					that.chart["barChartWorld"+id]= barChart;
					usedPanels[index]=1;
					//subscribe chart to granularity events
					that.granularityTool.addChart(barChart);
					that.ageSplitter.addChart(barChart);

					index = usedPanels.indexOf(0);
					var pie = new PieChart(index,that,name,2014,2,0,100,dataset,color);
					pie.createPieChart(); 
					pie.setId("pieChartWorld"+id);
					usedPanels[index]=1;
					//subscribe chart to granularity events
					that.granularityTool.addChart(pie);
					that.ageSplitter.addChart(pie);

				}else{
					d3.select("#worldPath"+id).classed('active',false);	
					d3.select("#worldPath"+id).style('fill','grey');

					d3.select('#textWorld'+id).remove();

					//e elimina i grafi
					var index = d3.select('#barChartWorld'+id).attr('panelIndex');
					d3.select('#barChartWorld'+id).remove();
					that.chart["barChartWorld"+id].remove = true;
					maxYvalues[index] = -1;
					minYvalues[index] = 9999999999;
					usedPanels[index]=0;

					index = d3.select('#pieChartWorld'+id).attr('panelIndex');
					d3.select('#pieChartWorld'+id).remove();
					usedPanels[index]=0;
				}
			}

			function showStateName(d,i){
				var id = d.id;
				log(this);

				addGraph.call(this,id,i);
			}

			function showWorldMap(){

				var projection =
				d3.geo.aitoff()
				.scale(that.viewBoxWidth * 0.25).center([20, 40 ])
				.translate([that.viewBoxWidth/2, that.viewBoxHeight/20]);


				var path = d3.geo.path()
				.projection(projection);
				that.worldPath=path;

				var g = d3.select('#worldMap').append("g");		

				// load and display the World
				d3.json("./map/world-topo-min.json", function(error, topology) {
					var topo = topojson.feature(topology, topology.objects.countries).features;
					that.worldMap=topo;
					var country = g.selectAll(".country").data(topo);



					country.enter().insert("path")
					.attr("class", "country")
					.attr("d", path)
					.attr("id", function(d,i) { 
						if(worldStateNames.indexOf(d.properties.name) > - 1){
							that.worldDictionary[d.properties.name] = i;
						}else{

							log(d.properties.name);
						}
						return "worldPath"+i; })
					.attr("class", "states")	
					.style('opacity',fillOnlyAvailableStates)				
					.attr("title", function(d) { return d.properties.name; });

					country
					.on("click", stateSelected); 

					function fillOnlyAvailableStates(d,i){
						if(worldStateNames.indexOf(d.properties.name) > - 1){
							return 1;
						}else{
							return 0.3;
						}
					}

					function stateSelected(d,i){
						if(worldStateNames.indexOf(d.properties.name) > - 1){
							var id = i;
							addWorldGraph(d.properties.name,id);
						}
					}		

				});
d3.select('#worldMap').attr('visibility','hidden');


}

}


Map.prototype.changeMap = function(map){
	var that = this;
	this.currentMap.attr('visibility','hidden');
	d3.select("#tendinaUs").attr('visibility', 'hidden');

	if(map == 'us'){
		d3.select('#usMap').attr('visibility','visible');
		this.currentMap = d3.select('#usMap');
	}else{

		d3.select('#worldMap').attr('visibility','visible');
		this.currentMap = d3.select('#worldMap');
	}
	
}
