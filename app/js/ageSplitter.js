var AgeSplitter = function(divPanel){

	var that = this;

	this.current = 2014;
	this.divPanel = divPanel;

	this.chart=[];

	this.viewBoxWidth = 2000;
	this.viewBoxHeight = 500;

	this.lower = 1;
	this.upper= 20;

	//create svg
	this.svg = this.divPanel.append('g').append("svg")
	.attr("viewBox", "0 0 "+ this.viewBoxWidth+" "+this.viewBoxHeight)
	.attr('panelIndex',this.index )
	.style('width','30%')
	.style('height', '30%');

	//create scales

	this.radiusScale = d3.scale.ordinal()
	.domain(d3.range(this.lower,this.upper+1,1)) 
	.rangeRoundBands([50,90]);

	this.strokeScale = d3.scale.ordinal()
	.domain(d3.range(this.lower,this.upper+1,1)) 
	.rangeRoundBands([5,20]);

	this.fontScale = d3.scale.ordinal()
	.domain(d3.range(this.lower,this.upper+1,1)) 
	.rangeRoundBands([45,130]);

	this.yScaleText = d3.scale.ordinal()
	.domain(d3.range(this.lower,this.upper+1,1)) 
	.rangeRoundBands([this.viewBoxHeight * 0.22, this.viewBoxHeight * 0.275]);

	//append text
	this.svg.append('text')
	.attr('text-anchor', 'middle')
	.attr('dominant-baseline', 'central')
	.attr('font-size', 250)
	.attr('fill', '#d9d9d9')
	.attr('x', this.viewBoxWidth * 0.5 )
	.attr('y', this.viewBoxHeight * 0.5)
	.text("Who remembers?");

	
	
	
}

AgeSplitter.prototype.select = function(year){	
	this.current = year;
	this.update();
}



AgeSplitter.prototype.update = function(){
	//call charts
	log('updating split');
	for(i in this.chart){
		this.chart[i].splitOnYear(this.current);
	}
}

AgeSplitter.prototype.addChart = function(chart){
	this.chart.push(chart);
	//call charts
	for(i in this.chart){
		this.chart[i].splitOnYear(this.current);
	}
}

