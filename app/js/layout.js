
function setUpLayout(){

    //create divs for layout
    var timelineAndMap = d3.select("body")
    .append("div")
    .attr("id","timelineAndMap");

    var map = timelineAndMap
    .append("div")
    .attr("id","mappa");

    var panel1 = d3.select("body")
    .append("div")
    .attr("id","pan1");

    var panel2  = d3.select("body")
    .append("div")
    .attr("id","pan2");

    var panel3  = d3.select("body")
    .append("div")
    .attr("id","pan3");


    var panel4  = d3.select("body")
    .append("div")
    .attr("id","pan4");

    var panel5  = d3.select("body")
    .append("div")
    .attr("id","pan5");


    var panel6  = d3.select("body")
    .append("div")
    .attr("id","pan6");

    var timeline =timelineAndMap
    .append("div")
    .attr("id","timelineDiv");





    //create svgs to put in the divs
    //mapSvg = map.append("svg").style('width','100%').style('height', '100%').attr('id','map' );
    //timelineSvg = timeline.append("svg").style('width','100%').style('height', '100%').attr('id','timeline' );

    // panel1Svg = panel1.append("svg").style('width','100%').style('height', '100%').attr('id','panel1' );
    // panel2Svg = panel2.append("svg").style('width','100%').style('height', '100%').attr('id','panel2' );
    // panel3Svg = panel3.append("svg").style('width','100%').style('height', '100%').attr('id','panel3' );
    // panel4Svg = panel4.append("svg").style('width','100%').style('height', '100%').attr('id','panel4' );
    // panel5Svg = panel5.append("svg").style('width','100%').style('height', '100%').attr('id','panel5' );
    // panel6Svg = panel6.append("svg").style('width','100%').style('height', '100%').attr('id','panel6' );

  //   return {map:mapSvg,
  //     timeline:timelineSvg,
  //     panel1:panel1Svg,
  //     panel2:panel2Svg,
  //     panel3: panel3Svg,
  //     panel4:panel4Svg,
  //     panel5 : panel5Svg,
  //     panel6:panel6Svg
  // };
  return {
    map:map,
    timeline:timeline,
    panel0: panel3,
    panel1:panel4,
    panel2:panel2,
    panel3 : panel5,
    panel4:panel1,   
    panel5:panel6
};

}