var GranularityTool = function(divPanel){

	var that = this;

	this.current = 10;
	this.divPanel = divPanel;

	this.chart=[];

	this.viewBoxWidth = 2000;
	this.viewBoxHeight = 500;

	this.lower = 1;
	this.upper= 20;

	this.male = 1;
	this.female = 2;
	this.totalPopulation = 0;

	//create svg
	this.svg = this.divPanel.append("svg")
	.attr("viewBox", "0 0 "+ this.viewBoxWidth+" "+this.viewBoxHeight)
	.attr('panelIndex',this.index )
	.style('width','70%')
	.style('height', '30%');

	//create scales

	this.radiusScale = d3.scale.ordinal()
	.domain(d3.range(this.lower,this.upper+1,1)) 
	.rangeRoundBands([140,200]);

	this.strokeScale = d3.scale.ordinal()
	.domain(d3.range(this.lower,this.upper+1,1)) 
	.rangeRoundBands([20,35]);

	this.fontScale = d3.scale.ordinal()
	.domain(d3.range(this.lower,this.upper+1,1)) 
	.rangeRoundBands([180,250]);

	this.yScaleText = d3.scale.ordinal()
	.domain(d3.range(this.lower,this.upper+1,1)) 
	.rangeRoundBands([this.viewBoxHeight * 0.63, this.viewBoxHeight * 0.63]);

	//append circle
	this.circle = this.svg.append('circle')
	.attr('cx', this.viewBoxWidth * 0.75)
	.attr('cy', this.viewBoxHeight * 0.5)
	.attr('r', this.radiusScale(this.current) )
	.style("stroke", "black")  
	.style("stroke-width",this.strokeScale(this.current))
	.style("fill", "none");
	
	//append plus and minus
	this.svg.append('text')
	.attr('text-anchor', 'middle')
	.attr('dominant-baseline', 'central')
	.attr('font-family', 'FontAwesome')
	.attr('font-size', 160)
	.attr('x', this.viewBoxWidth * 0.91 )
	.attr('y', this.viewBoxHeight * 0.51)
	.on('click',function(){that.increase.call(that)})
	.text(function(d) { return '\uf067'; });

	this.svg.append('text')
	.attr('text-anchor', 'middle')
	.attr('dominant-baseline', 'central')
	.attr('font-family', 'FontAwesome')
	.attr('font-size', 160)
	.attr('x', this.viewBoxWidth * 0.59 )
	.attr('y', this.viewBoxHeight * 0.51)
	.on('click',function(){that.decrease.call(that)})
	.text(function(d) { return '\uf068'; });

	//append text
	this.number = this.svg.append('text')
	.attr('text-anchor', 'middle')	
	.attr('font-size', this.fontScale(this.current))
	.attr('x', this.viewBoxWidth * 0.755)
	.attr('y', this.yScaleText(this.current))
	.attr('font-weight','bolder' )
	.attr('fill','#542788' )
	.text(this.current);


	///CREATE GENDER SELECTOR
	//put button for choosing M F total
	this.manButton = this.svg.append("text")
	.attr("text-anchor", "middle") 
	.attr("transform", "translate("+ (this.viewBoxWidth/4) +","+(this.viewBoxHeight/1.6)+")") 
	.attr('font-size', this.viewBoxHeight/2.5)
	.attr('fill', 'black')
	.attr('font-family', 'FontAwesome')
	.attr('fill', 'black')
	.attr('id', 'manIcon')
	.on('click',function(){			
		resetGenderButtons();

		d3.select('#'+this.getAttribute('id'))
		.transition().duration(500)
		.style('fill', '#542788')
		.attr('font-size', that.viewBoxHeight/2)
		.style('stroke-width', '5')
		.style('stroke', 'black');

		that.updateGender(that.male);
	})
	.text(function() { return '\uf183 '; });

	this.womanButton = this.svg.append("text")
	.attr("text-anchor", "middle") 
	.attr("transform", "translate("+ (this.viewBoxWidth/3) +","+(this.viewBoxHeight/1.6)+")") 
	.attr('font-size', this.viewBoxHeight/2.5)
	.attr('fill', 'black')
	.attr('id', 'womanIcon')
	.attr('font-family', 'FontAwesome')
	.on('click',function(){			
		resetGenderButtons();

		d3.select('#'+this.getAttribute('id'))
		.transition().duration(500)
		.style('fill', '#542788')
		.attr('font-size', that.viewBoxHeight/2)
		.style('stroke-width', '5')
		.style('stroke', 'black');
		
		that.updateGender(that.female);
	})
	.text(function() { return '\uf182'; });

	this.manPlusWomanButton = this.svg.append("text")
	.attr("text-anchor", "middle") 
	.attr("transform", "translate("+ (this.viewBoxWidth/2.2) +","+(this.viewBoxHeight/1.6)+")") 
	.attr('font-size', this.viewBoxHeight/2.5)
	.attr('fill', 'black')
	.attr('id', 'manPlusWomanIcon')
	.attr('font-family', 'FontAwesome')
	.on('click',function(){			
		resetGenderButtons();

		d3.select('#'+this.getAttribute('id'))
		.transition().duration(500)
		.style('fill', '#542788')
		.attr('font-size', that.viewBoxHeight/2)
		.style('stroke-width', '5')
		.style('stroke', 'black');
		
		that.updateGender(that.totalPopulation);
	})
	.text(function() { return '\uf228'; });

	function resetGenderButtons(){
		that.manButton.each(function(){
			d3.select('#'+this.getAttribute('id'))
			.attr('font-size', that.viewBoxHeight/2.5)
			.style('stroke-width', '1')
			.style('fill', 'black');		
		});

		that.womanButton.each(function(){
			d3.select('#'+this.getAttribute('id'))
			.attr('font-size', that.viewBoxHeight/2.5)
			.style('stroke-width', '1')
			.style('fill', 'black');		
		});

		that.manPlusWomanButton.each(function(){
			d3.select('#'+this.getAttribute('id'))
			.attr('font-size', that.viewBoxHeight/2.5)
			.style('stroke-width', '1')
			.style('fill', 'black');		
		});
	}

	var compareButtonActive = false;
	//append button for comparison
	this.compareButton = this.svg.append("text")
	.attr("text-anchor", "middle") 
	.attr("transform", "translate("+ (200) +","+(this.viewBoxHeight/1.6)+")") 
	.attr('font-size', this.viewBoxHeight/2.5)
	.attr('fill', 'black')
	.attr('id', 'compareIcon')
	.attr('font-family', 'FontAwesome')
	.on('click',function(){	
		if(!compareButtonActive){	
			d3.select('#'+this.getAttribute('id'))
			.transition().duration(500)
			.style('fill', '#542788')
			.attr('font-size', that.viewBoxHeight/2)
			.style('stroke-width', '5')
			.style('stroke', 'black');

			compareMode = true;
			compareButtonActive = true;

		}else{

			d3.select('#'+this.getAttribute('id'))
			.transition().duration(500)
			.style('fill', 'black')
			.attr('font-size', that.viewBoxHeight/2.5)
			.style('stroke-width', '0')
			.style('stroke', 'black');
			compareMode = false;
			compareButtonActive = false;
		}
	 //call charts
	 for(var i in that.chart){
	 	log('updating');
	 	that.chart[i].updateGraph(that.current);
	 }
	})
	.text(function() { return '\uf24e'; });


}

GranularityTool.prototype.increase = function(){
	if(this.current != this.upper){
		this.current++;
		this.updateGranularity();
	} 
}

GranularityTool.prototype.decrease = function(){
	if(this.current != this.lower){
		this.current--;
		this.updateGranularity();
	}

}

GranularityTool.prototype.updateGranularity = function(){
	//circle radius and stroke
	this.circle.transition()
	.attr('r', this.radiusScale(this.current))		
	.style("stroke-width",this.strokeScale(this.current));

	//text
	this.number.transition()
	.text(this.current)
	.attr('y', this.yScaleText(this.current))
	.attr('font-size', this.fontScale(this.current));

	//call charts
	for(i in this.chart){
		this.chart[i].updateGraph(this.current);
	}
	//call charts
	for(i in this.chart){
		this.chart[i].updateGraph(this.current);
	}
}

GranularityTool.prototype.updateGender = function(sex){
	//call charts
	for(i in this.chart){
		this.chart[i].updateSex(sex);
		this.chart[i].updateGraph(this.current);
	}
}

GranularityTool.prototype.addChart = function(chart){
	this.chart.push(chart);
	//call charts
	for(i in this.chart){
		this.chart[i].updateGraph(this.current);
	}
}

