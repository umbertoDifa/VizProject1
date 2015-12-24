
maxYvalues=[];
minYvalues=[];

compareMode = false;
//**CLASS GRAPH**//
var BarChart = function(index,map,nation,year,sex,lower,upper,data,color){
//INTIALIZATION DEFAULT VARS
this.sex = sex;//FIX ME
this.male = 1;
this.female = 2;
this.totalPopulation = 0;
this.stateName = nation;
this.year = year;
this.sex = this.totalPopulation;

this.lower = lower;
this.upper = 84; //all dataset till the same upper age, this is hardcoded

this.numberOfAges = upper-lower+1;


this.viewBoxWidth = 8196;
this.viewBoxHeight = 2188;

this.index = index;
this.divPanel = panel["panel"+index];
this.svg;

//scales
this.xScale;
this.yScale;
this.colorScale;

this.margin;

//axis
this.xAxisPadding = 0;
this.yAxisPadding = 10; 

this.xAxis;
this.yAxis;
this.gy; //intermidiate axis line

//subscribe to map
//map.addChart(this);

this.dataset = data;
this.color = color;

this.myXAxis;

this.currentSplitYear = 2014;
this.granularityValue=1;

this.yMax;//for the scale
this.yMin;

this.remove = false;
}

BarChart.prototype.createBarChart = function(){  

  this.margin  = {top:0, right: 0, bottom: 0, left:500};

  this.svg = 
  this.divPanel.append("svg")
  .attr("viewBox", "0 -300 "+ this.viewBoxWidth+" "+this.viewBoxHeight)
  .attr('panelIndex',this.index )
  .style('width','100%')
  .style('height', '100%');



  var that=this;

  var filteredDataset = filterData(this.dataset,this.stateName,this.year,this.sex);

  var filteredAge = filteredDataset[0].age.slice(this.lower,this.upper+1);
  this.numberOfAges = this.upper - this.lower +1;

  this.xScale = d3.scale.ordinal()
  .domain(d3.range(this.lower,this.upper+1,1)) 
  .rangeRoundBands([this.margin.left*1.5 , this.viewBoxWidth - this.margin.left - this.margin.right], 0.1);

  //if compare mode the maximum and minimu for yScale are shared  
  this.yMax = d3.max(filteredAge);
  this.yMin =d3.min(filteredAge);
  

  this.yScale = d3.scale.linear()
  .domain([this.yMin, this.yMax])
  .range([that.viewBoxHeight - this.margin.bottom,this.margin.top]).nice();


  //COLOR scale
  this.colorScale = d3.scale.linear()
  .domain([d3.min(filteredAge), d3.max(filteredAge)])
  .rangeRound([30,200]);

  //bind data
  var bindedData = this.svg
  .selectAll("rect")
  .data(filteredAge);


  //add new elements
  bindedData
  .enter()
  .append("rect").attr({
    x: function(d, i) { return that.xScale(i+that.lower); },
    y: function(d) {
      return that.yScale(that.yScale.domain()[0])-(that.viewBoxHeight - that.yScale(d)); }, 
      width: this.xScale.rangeBand(),
      height: function(d) { return that.viewBoxHeight- that.yScale(d); }, 
      fill: function(d){ return that.color;}// "rgb(100, " + that.colorScale(d) + ",65)"; }      
    }) 
  .attr('label',function(d,i){return i;})
  .attr('id', 'barChart'+this.stateName)
  .attr('class', 'barChart');




  //***AXIS***//
  this.xAxis = d3.svg.axis()
  .scale(that.xScale)
  .orient("bottom");

  this.xAxis.tickValues(d3.range(this.lower, this.upper+1 , 5));

  this.yAxis = d3.svg.axis()
  .scale(this.yScale)
  //.tickSize(0) //here you modify the length of the dashed lines  
  .tickFormat(formatPopulation)
  .orient("right");

 // var ageRange = that.yScale.domain()[1]-that.yScale.domain()[0];
 // this.yAxis.tickValues(d3.range(that.yScale.domain()[0],that.yScale.domain()[1],ageRange/10));
 
 this.myXAxis = this.svg.append("g").attr('class',"x axis" ).call(this.xAxis)
 .attr('shape-rendering', 'geometricPrecision')
 .attr('font-size', this.viewBoxHeight/10)
 .attr("transform", "translate(0,"+this.viewBoxHeight+")"); 

 this.gy = this.svg.append("g").attr('class', 'y axis').call(this.yAxis)
 .attr("transform", "translate("+this.margin.left/3+",0)");

  //ADD LABELS
  this.svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (this.viewBoxWidth*0.95) +","+(this.viewBoxHeight*1.25)+")")  // centre below axis
            .attr('font-size', this.viewBoxHeight/7)
            .attr('fill', '#d9d9d9')
            .text("Age");

            this.svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (this.margin.left*2) +","+(-300)+")")  // centre below axis
            .attr('font-size', this.viewBoxHeight/7)
            .attr('fill', '#d9d9d9')
            .text("Population");

  //Put state name
  this.svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (this.viewBoxWidth/2) +","+(-700)+")")  // centre below axis
            .attr('font-size', this.viewBoxHeight/5)
            .attr('fill', '#d9d9d9')
            .text(that.stateName); 

  //**HELPERS**//
  function formatPopulation(d) {
    return d ===that.yScale.domain()[0] ? d/1000+"k" : d/1000+"k";
  }

}

BarChart.prototype.setId = function (id){
  this.svg.attr('id',id);
}

BarChart.prototype.updateGranularity = function(value){
  this.granularityValue = value;

    //re-filter the dataset
    var filteredDataset = filterData(this.dataset,this.stateName,this.year,this.sex);
    var filteredAge = filteredDataset[0].age.slice(this.lower,this.upper+1);
    //create new array of ages to display

    var newAges =[];
    var sum;
    var index;
    var label=[];
    var lastOffset;

    if(value != 1){
      for(var i = this.lower, index = 0; i < this.upper+1;index++){
        sum = 0;   
        lastOffset=(this.upper - i < value) ? this.upper-i+1 : value;

        for( j=0; j < lastOffset; j++){ //if i have not enogh bins use what is left
          sum += filteredAge[i + j];
        }

        newAges[index]=sum;
        label[index]=i+"-"+(i+j-1);    
        i += value;
      }

    }else{
      newAges = filteredAge;
      label = d3.range(this.lower,this.upper+1,1);
    }
    
    return {label,newAges};
  }

  BarChart.prototype.updateSex = function(sex){
    this.sex = sex;
  }

  BarChart.prototype.updateGraph = function(granularityValue){

    if(this.remove){return};
    var that = this;

  //re-filter the dataset
  var filteredDataset = this.updateGranularity(granularityValue);

  var filteredAge = filteredDataset['newAges'];
  updateMaximum();
  setYcompare();

  //this.numberOfAges = this.upper - this.lower +1;
  var label = filteredDataset['label'];

  //UPDATE SCALE

  this.xScale
  .domain(label)
  .rangeRoundBands([this.margin.left *1.5, this.viewBoxWidth - this.margin.left - this.margin.right], 0.1);

  this.xAxis
  .scale(that.xScale)
//.tickSize(100,200)
//.ticks(15)
.orient("bottom");

this.xAxis.tickValues(label);

//this.yScale.ticks(10);

this.yScale
.domain([this.yMin, this.yMax])
.range([this.viewBoxHeight - this.margin.bottom,this.margin.top]).nice();

var lengthOfNumber = that.yScale.domain()[1].toString().length - 1; //i want to save the last most signifiacnt digit
var ageRange = Math.round((that.yScale.domain()[1]-that.yScale.domain()[0]) / Math.pow(10, lengthOfNumber)) * Math.pow(10, lengthOfNumber);
//this.yAxis.tickValues(d3.range(this.yScale.domain()[0],this.yScale.domain()[1]+1,ageRange/10));

this.svg.selectAll("g.x.axis")
//.transition().duration(500)
.call(this.xAxis);

var labelsCounter = 0;
this.myXAxis.selectAll("g.tick text")
.attr("font-size", prettyfyLabel);


this.gy.transition()
.duration(700)
.call(this.yAxis)
 .selectAll("text") // cancel transition on customized attributes
 .tween("attr.x", null)
 .tween("attr.dy", null);

 this.gy.selectAll("text")
 .attr("x", 0)
 .attr('font-size', this.viewBoxHeight/10)
 .attr("dy", -4);

 this.gy.selectAll("g")//.filter(function(d) { return d; })
 .classed("minor", true);


  //COLOR scale
  this.colorScale
  .domain([d3.min(filteredAge),d3.max(filteredAge)]);

  //UPDATE DATA
   //bind data
   var bindedData = this.svg
   .selectAll("rect")
   .data(filteredAge);

    // add new elements if any
    bindedData.enter().append('rect');

    // update existing elements
    bindedData
    .transition() //mai mettere duration >250 o delay perche va in conflitto con altre transizioni
    .attr('label',function(d,i){return label[i];})
    .attr({
      x: function(d, i) { return that.xScale(label[i]); },
      y: function(d) {
        return that.yScale(that.yScale.domain()[0])-(that.viewBoxHeight - that.yScale(d)); }, 
        width: this.xScale.rangeBand(),
        height: function(d) { return that.viewBoxHeight- that.yScale(d); }, 
        fill: function(d,i){ return that.color;}//myrgb.darker(i/90);}//that.color;}//"rgb(100, " + that.colorScale(d) + ",65)"; }
      });
    // remove old elements if any
    bindedData.exit().remove();

    this.splitOnYear(this.currentSplitYear);    

    function prettyfyLabel(){
      var value;
      value = (label.length > 50) ?  5 :  
      (label.length > 30) ? 4 : 
      (label.length > 25) ? 3 : 
      (label.length > 20) ? 2 : 1;

      if(labelsCounter == 0){
        labelsCounter++;
        return 'inherit';
      }
      if (labelsCounter % value == 0) {
        labelsCounter++;
        return 'inherit' ;
      }  else{ 
        labelsCounter++;
        return 0;
      }
    }

    function formatPopulation(d) {
      return d ===that.yScale.domain()[0] ? d/1000+"k" : d/1000+"k";
    }

    log(maxYvalues);

    function updateMaximum(){
     maxYvalues[that.index] = d3.max(filteredAge);
     that.yMax = d3.max(filteredAge);

     minYvalues[that.index] = d3.min(filteredAge);
     that.yMin = d3.min(filteredAge);
   }
   function setYcompare (){
     //update y 
     if(compareMode){
      that.yMax = d3.max(maxYvalues);
      that.yMin = d3.min(minYvalues);
    }else{
      that.yMax = d3.max(filteredAge);
      that.yMin =d3.min(filteredAge);
    }
  }

}

BarChart.prototype.splitOnYear= function(year){

  this.currentSplitYear = year;
    var threshold = 2014 - year + 12 ; //l'eta minima per ricordare è 12
    
    var filteredDataset = this.updateGranularity(this.granularityValue);
    var filteredAge = filteredDataset['newAges'];

    var rects = this.svg
    .selectAll("rect");

    rects
   .transition().duration(1000).delay(250)  //è 250 per non scontrasti con altre transizioni, non può essere abbassato 
   .attr('fill-opacity',function(d,i){       
    var split = filteredDataset['label'][i].toString().split('-');   
    if(split[split.length-1] < threshold){
      return 0.2;
    }else{
      return 1;
    }
  });

 }

 BarChart.prototype.compare= function(){
  log('new comape');
    //update graph
    this.updateGraph(this.granularityValue);
  }


