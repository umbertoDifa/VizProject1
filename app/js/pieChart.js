//*CLASS PIE CHART*//
var PieChart = function(index,map,nation,year,sex,lower,upper,data,color){
 this.viewBoxWidth = 8196;
 this.viewBoxHeight = 2188;

 this.panel = panel["panel"+index];
 this.pieSvg;
 this.index=index;

 this.path;
 this.pie;
 this.arc;


 this.stateName = nation;
 this.year = year;
 this.male = 1;
 this.female = 2;
 this.totalPopulation = 0;
 this.sex = this.totalPopulation;


 this.color;

 this.dataset = data;

 this.lower = lower;
 this.upper = 84;

 //subscribe to map
 //map.addChart(this);
 this.pieColor = color;
 this.pieText;

 this.currentSplitYear = 2014;
 this.granularityValue = 1;

 this.threshold;

 var filteredDataset = filterData(this.dataset,this.stateName,this.year,this.sex); 
 this.populationSum = 0;
 for(var i in filteredDataset[0].age.slice(this.lower,this.upper+1)){
  this.populationSum += filteredDataset[0].age.slice(this.lower,this.upper+1)[i];
}
log('total population')
log(this.populationSum);


}

PieChart.prototype.createPieChart = function(){

  var that = this;
  //var filteredDataset = dataset.filter(function(d){ return d.stateName == "Italy" && d.year=="1991" && d.sex ==2 ;});
  var filteredDataset = filterData(this.dataset,this.stateName,this.year,this.sex); 

  radius = Math.min(this.viewBoxWidth, this.viewBoxHeight) ;

  this.color = d3.scale.category20();

  this.pie = d3.layout.pie()
  .sort(null);

  this.innerPie = d3.layout.pie()
  .sort(null);

  this.arc = d3.svg.arc()
  .innerRadius(radius *0.5)
  .outerRadius(radius *0.7);

  this.innerArc = d3.svg.arc()
  .innerRadius(radius *0.45)
  .outerRadius(radius *0.5)
  .startAngle(0).endAngle(1.5*Math.PI);


  
  this.outerG = this.panel.append('g').attr('panelIndex',this.index );
  this.pieSvg = this.outerG.append('g')
  .append("svg")
  .attr("viewBox", "00 0 "+ this.viewBoxWidth+" "+this.viewBoxHeight)
  .style('width','100%')
  .style('height', '100%');

  this.innerPieSvg = this.outerG.append('g')
  .append("svg")
  .attr("viewBox", "00 0 "+ this.viewBoxWidth+" "+this.viewBoxHeight)
  .style('width','100%')
  .style('height', '100%');
  
  var pieG = this.pieSvg
  .append("g")
  .attr("transform", "translate(" + this.viewBoxWidth / 2 + "," + (this.viewBoxHeight -radius/2) + ")"); 

  var innerPieG = this.pieSvg
  .append("g")
  .attr("transform", "translate(" + this.viewBoxWidth / 2 + "," + (this.viewBoxHeight -radius/2) + ")"); 

  this.path = pieG.selectAll("path")
  .data(this.pie(filteredDataset[0].age.slice(this.lower,this.upper)))
  .enter().append("path")
  .attr("fill", function(d, i) { return that.pieColor;})
  .attr('class', 'piePath')
  .attr("d", that.arc)
  .each(function(d) { this._current = d; }); // store the initial values

  this.innerPath = innerPieG.selectAll("path")
  .data(this.innerPie([1]))
  .enter().append("path")
  .attr("fill", function(d, i) { return "black";})
  .attr('class', 'innerPiePath')
  .attr("d", that.innerArc)
  .each(function(d) { this._current = d; }); 


  //add text
  var outerArc = d3.svg.arc()
  .innerRadius(radius * 0.7)
  .outerRadius(radius *0.9);

  var counter = 0;

  this.pieText = pieG.selectAll("text")
  .data(this.pie(filteredDataset[0].age.slice(this.lower,this.upper)))
  .enter()
  .append("text")
  .attr("transform", function(d) { return "translate(" + outerArc.centroid(d) + ")"; })
  .attr("dy", ".35em")
  .attr('font-size', 230)
  .style("text-anchor", "middle")
  .text(eachOther);

  //percentuale gente viva
  this.percentageText = pieG
  .append("text")
  .attr("transform", "translate(" + 20 + "," + (0) + ")")
  .attr("dy", ".35em")
  .attr('font-size', 530)
  .style("text-anchor", "middle")
  .text("nada");

  
  function eachOther(d,val){
    var alternate = (that.granularityValue < 5) ? 4 : 2;
    if(counter % alternate == 0){
      counter++;
      return val;
    }else{
      counter++;
      return "";
    }
  }


}

PieChart.prototype.setId = function(id){
  this.outerG.attr('id',id);
}

PieChart.prototype.updateGraph = function(granularityValue){
  var that = this;

  var enterAntiClockwise = {
    startAngle: Math.PI * 2,
    endAngle: Math.PI * 2
  };


  var filteredDataset =  this.updateGranularity(granularityValue);

  this.path = this.path.data(this.pie(filteredDataset['newAges'].slice(this.lower,this.upper))); // update the data
  // set the start and end angles to Math.PI * 2 so we can transition
  // anticlockwise to the actual values later

  this.path.enter().append("path")  
  .attr('class', 'piePath')
  .attr("fill", function (d, i) {
    return that.pieColor;//that.color(i);
  })
  .attr('stroke-width', 20)
  .attr("d", that.arc(enterAntiClockwise))
  .each(function (d) {
    this._current = {
      data: d.data,
      value: d.value,
      startAngle: enterAntiClockwise.startAngle,
      endAngle: enterAntiClockwise.endAngle
    };
      }); // store the initial values

  this.path.exit()
  .transition()
  .duration(750)
  .attrTween('d', arcTweenOut)
      .remove() // now remove the exiting arcs

  this.path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs

  this.splitOnYear(this.currentSplitYear);



  //add text
  var outerArc = d3.svg.arc()
  .innerRadius(radius * 0.8)
  .outerRadius(radius *0.9);

  this.pieText = this.pieText .data(this.pie(filteredDataset['newAges'].slice(this.lower,this.upper)));

  this.pieText 
  .exit().remove();
  //update text
  this.pieText 
  .enter()
  .append("text")
  .attr("transform", function(d) { return "translate(" + outerArc.centroid(d) + ")"; })
  .attr("dy", ".35em")
  .attr('font-size', 230)
  .style("text-anchor", "middle")
  .text(eachOther);


  var counter = 0;
  this.pieText 
  .attr("transform", function(d) { return "translate(" + outerArc.centroid(d) + ")"; })
  .attr("dy", ".35em")
  .attr('font-size', 230)
  .style("text-anchor", "middle")
  .text(function(d,i){
    return eachOther(filteredDataset['label'][i]);
  });



  function eachOther(val){
    if(val.toString().split('-')[0] > 70){
      return"";
    }
    var alternate;
    switch(that.granularityValue) {
      case 1:
      alternate = 5;
      break;
      case 2:
      alternate = 4;
      break;
      case 3:
      alternate = 3;
      break;
      case 4:
      alternate = 2;
      break;
      case 5:
      alternate = 1;
      break;
      case 6:
      alternate = 1;
      break;
      case 7:
      alternate = 1;
      break;
      default:
      alternate = 1;
    }

    if(counter % alternate == 0){
      counter++;
      return val;
    }else{
      counter++;
      return "";
    }
  }

  // Store the displayed angles in _current.
  // Then, interpolate from _current to the new angles.
  // During the transition, _current is updated in-place by d3.interpolate.
  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return that.arc(i(t));
    };
  }
  // Interpolate exiting arcs start and end angles to Math.PI * 2
  // so that they 'exit' at the end of the data
  function arcTweenOut(a) {
    var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
    this._current = i(0);
    return function (t) {
      return that.arc(i(t));
    };
  }


}

PieChart.prototype.updateGranularity = function(value){
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

  PieChart.prototype.splitOnYear= function(year){
   this.currentSplitYear = year;
    var threshold = 2014 - year + 12 ; //l'eta minima per ricordare è 12

    var that = this;    

    var filteredDataset = filterData(this.dataset,this.stateName,this.year,this.sex)[0].age.slice(this.lower,this.upper+1); 

    var sum = 0;
    
    for(var i = threshold; i < filteredDataset.length; i++){
      sum += filteredDataset[i];
    }
    log('percentuale');

    var percentage = sum/this.populationSum;
    log(d3.format('%')(percentage));

  //population scale
  this.populationScale = d3.scale.linear()
  .domain([0, 1])
  .range([0,2]);


  radius = Math.min(this.viewBoxWidth, this.viewBoxHeight) ;

  this.innerArc
  .startAngle(0).endAngle(this.populationScale(percentage)*Math.PI);

  this.innerPath.transition().duration(750)    
  .attrTween("d", arcTween); 

  //append text percentage
  this.percentageText.transition(1000)
  .text(d3.format('%')(percentage));

 // redraw the arcs

  // Store the displayed angles in _current.
  // Then, interpolate from _current to the new angles.
  // During the transition, _current is updated in-place by d3.interpolate.
  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return that.innerArc(i(t));
    };
  }


}


PieChart.prototype.updateSex = function(sex){
  this.sex = sex;

  var filteredDataset = filterData(this.dataset,this.stateName,this.year,this.sex)[0].age.slice(this.lower,this.upper+1); 

   //update total population
   this.populationSum = 0;
   for(var i in filteredDataset){
    this.populationSum += filteredDataset[i];
  }
  log('total population')
  log(this.populationSum);
}

