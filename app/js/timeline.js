var Timeline = function(divPanel,ageSplitter){

	var that = this;

	this.current = 1;
	this.divPanel = divPanel;
	this.ageSplitter = ageSplitter;

	this.chart=[];

	this.viewBoxWidth = 2000;
	this.viewBoxHeight = 500;

	//create svg
	this.svg = this.divPanel.append("svg")
	.attr("viewBox", "0 0 "+ this.viewBoxWidth+" "+this.viewBoxHeight)
	.attr('panelIndex',this.index )
	.style('width','100%')
	.style('height', '70%');

	this.events = [	
	{title: "World War II", year: 1945},
	{title: "Moon Landing", year : 1959}, 	
	{title: "Chile earthquake", year: 1960},
	{title: "End Vietnam War", year:1975},
	{title:"The Fall of the Berlin Wall", year:1989},
	{title:'Bosnian Genocide',year:1995},
	{title:"Google is founded", year:1998},
	{title:"Mars Exploration Rovers",year:2003},
	{title:"Italy wins Soccer World Cup", year:2006},
	{title:"Japan Tsunami",year:2011},
	{title:"Today",year:2014}];	

	//append circle
	this.circles = this.svg.append("g").selectAll('circle')
	.data(this.events)
	.enter()
	.append('circle')
	.attr('cx',function(d,i){return (that.viewBoxWidth* 0.095 * i) + that.viewBoxWidth* 0.025;})
	.attr('cy', 200)
	.attr('r', 30 )
	.attr('id',function(d,i){return 'circle'+i;} )
	.style("stroke", "black")  
	.style("stroke-width",8)
	.style("fill", "#d9d9d9")
	.style('opacity',"0.6")
	.style('stroke-width', '5')
	.on('click',function(d,i){
		resetStyle();

		//make circle higlight
		d3.select('#noEvent').attr('visibility','hidden');
		d3.select('#event'+d.year).attr('visibility','visible');		
		d3.select('#'+this.getAttribute('id'))
		.transition().duration(500)
		.style('opacity', '1')
		.style('stroke-width', '15')
		.style('stroke', '#542788');		
		

		var theYearText = d3.select('#textEvent'+i);		
		//highlight text
		theYearText.transition().duration(500)
		.attr('x', theYearText.attr('x')-85)
		.attr('y', 360)
		.attr('font-size',120 );

		//split
		that.ageSplitter.select.call(that.ageSplitter,d.year);

	});

	this.scale = d3.scale.ordinal()
	.domain(d3.range(0,30,1)) 
	.rangeRoundBands([0,that.viewBoxWidth]);


	//append event name
	this.eventsText = this.svg.append("g")
	.selectAll('text')
	.data(this.events)
	.enter()
	.append('text')
	.attr('dy', 1)
	.text(function(d,i){return d.title;})
	.attr('x', 300)
	.attr('y', 100)
	.attr('font-size', 130)
	.attr('id',function(d,i){return 'event'+d.year;})
	.attr('visibility','hidden' )
	.style('text-decoration','underline' )
	.attr('fill', 'black');

	//append no event selected
	this.svg.append("g")	
	.append('text')
	.attr('dy', 1)
	.text("Select an year to filter")
	.attr('x', 300)
	.attr('y', 100)
	.attr('font-size', 130)
	.attr('id', 'noEvent')
	.attr('visibility','visible' )
	.attr('fill', 'lightgrey');

	function resetStyle(){	
		//hide all titles	
		that.eventsText.each(function(){this.setAttribute('visibility','hidden');});

		//reset circles
		that.circles.each(function(){
			d3.select('#'+this.getAttribute('id'))
			.style('stroke-width', '5')
			.style('opacity', '0.6')
			.style('stroke', 'black');		
		});


		//reset text
		that.yearText.each(function(d,i){
			this.setAttribute('x',  (that.viewBoxWidth* 0.095 * i) + that.viewBoxWidth* 0.001);
			this.setAttribute('y', 300);
			this.setAttribute('font-size', 50);
		});
		
	}

	//append no year selected
	this.noSplit = this.svg.append("text")
	.attr("text-anchor", "middle") 
	.attr("transform", "translate("+ (this.viewBoxWidth-50) +","+(this.viewBoxHeight/1.1)+")") 
	.attr('font-size', this.viewBoxHeight/7)
	.attr('fill', 'black')
	.attr('id', 'noSplitIcon')
	.attr('font-family', 'FontAwesome')
	.on('click',function(){			
	 //split
	 resetStyle();
	 d3.select('#noEvent').attr('visibility','visible');

	 that.ageSplitter.select.call(that.ageSplitter,2014+12);
	})
	.text(function() { return '\uf057'; });

	//append year
	this.yearText = this.svg.append("g")
	.selectAll('text')
	.data(this.events)
	.enter()
	.append('text')
	.attr('dy', 1)
	.text(function(d,i){return d.year;})
	.attr('x', function(d,i){return(that.viewBoxWidth* 0.095 * i) + that.viewBoxWidth* 0.001;})
	.attr('y', 300)
	.attr('id',function(d,i){return 'textEvent'+i;} )
	.attr('font-size', 50)
	.attr('fill', 'black');

}
