/********************************************************
* Chord Diagram
* Author: Robert Felder
* Version: 1.0
* Description:
* Changelog: 5.13.2013 - Initial Creation
********************************************************/
function drawChordDiagram(data){
      var teamList = [],
          sectorCount = [],
          id = 0;
      
      // Set the stage
      var r = 960 / 2,
          p = 35,
          chordMem,
          barMem,
          isChordClicked = isBarClicked = false;

      var chordFilteredData = data.filter(function(d){
        if(d.ind6.value1 != null && d.ind6.value2 != null && d.ind6.value3 != null && d.ind6.value4 != null){
          return d;
        }
      });

      var chordData = [], newId = 0;

      // Add in spacers between sectors and countries
      for(var addSpace=0; addSpace < 30; addSpace++){
        chordData.push({"name" : "Spacer",
                        "ind6" : {"value1" : null,
                                     "value2" : null,
                                     "value3" : null,
                                     "value4" : null
                                    },
                        "ind1" : null,
                        "ind4" : null,
                        "ind5" : null,
                        "ind1" : 0,
                        "ind1Year" : null
                        });
      }

      chordFilteredData.forEach(function(d){
        chordData.push({"name" : d.team,
                        "ind6" : d.ind6,
                        "ind1" : d.ind1.value,
                        "ind4" : d.ind4.value,
                        "ind5" : d.ind5.value,
                        "ind1" : d.ind1.value,
                        "ind1Year" : d.ind1.year
                      });
      });

      // Add in spacers between sectors and countries
      for(var addSpace=0; addSpace < 30; addSpace++){
        chordData.push({"name" : "Spacer",
                        "ind6" : {"value1" : null,
                                     "value2" : null,
                                     "value3" : null,
                                     "value4" : null
                                    },
                        "ind1" : null,
                        "ind4" : null,
                        "ind5" : null,
                        "ind1" : 0,
                        "ind1Year" : null
                        });
      }

      chordData.push({"name" : "Value 1",
                      "ind6" : {"value1" : null,
                                     "value2" : null,
                                     "value3" : null,
                                     "value4" : null
                                  },
                      "ind1" : null,
                      "ind4" : null,
                      "ind5" : null,
                      "ind1" : null,
                      "ind1Year" : null
                      });

      chordData.push({"name" : "Value 2",
                      "ind6" : {"value1" : null,
                                     "value2" : null,
                                     "value3" : null,
                                     "value4" : null
                                  },
                      "ind1" : null,
                      "ind4" : null,
                      "ind5" : null,
                      "ind1" : null,
                      "ind1Year" : null
                      });

      chordData.push({"name" : "Value 4",
                      "ind6" : {"value1" : null,
                                     "value2" : null,
                                     "value3" : null,
                                     "value4" : null
                                  },
                      "ind1" : null,
                      "ind4" : null,
                      "ind5" : null,
                      "ind1" : null,
                      "ind1Year" : null
                      });

      chordData.push({"name" : "Value 3",
                      "ind6" : {"value1" : null,
                                     "value2" : null,
                                     "value3" : null,
                                     "value4" : null
                                  },
                      "ind1" : null,
                      "ind4" : null,
                      "ind5" : null,
                      "ind1" : null,
                      "ind1Year" : null
                      });

      chordData.forEach(function(d){
        d.id = newId++;
        d.valueOf = value;
      });

      var analHeight = 750;

      // Begin Chord Diagram
      var groupFill = d3.scale.category20();

      var cDiagram = d3.select("#chordViz").append("svg")
        .attr("width", 900)
        .attr("height", analHeight)
        .append("g")
          .attr("transform", "translate(460, 376), rotate(-16)");
      
      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
        cDiagram.style("margin-left", "-610px");
      }

      var fill = d3.scale.ordinal()
        .domain(["Value 1", "Value 2", "Value 3", "Value 4"])
        .range(["#31a354", "#6baed6", "#f5dd5c"/*#B24700"*/, "#999999"]);

      var stroke = d3.scale.ordinal()
        .domain(["Value 1", "Value 2", "Value 3", "Value 4"])
        .range(["#2b904a", "#629fc4", "#9f3f00", "#777777"])

      // Initialize an empty square matrix
      var cDataMatrix = [];
      for(var h = 0; h < chordData.length; h++){
        cDataMatrix[h] = [];

        for(var k = 0; k < chordData.length; k++){
          cDataMatrix[h][k] = 0;
        }
      }

      // Populate the matrix
      var matrixElement = {};
      chordData.forEach(function(d){
        if(d.ind6.value1 != null && d.ind6.value2 != null && d.ind6.value3 != null && d.ind6.value4 != null){
          for(var a=0; a < chordData.length; a++){
            if(chordData[a].name == 'Value 1'){
              matrixElement = {
                "name" : d.name,
                "id" : d.id,
                "value" : d.ind6.value1,
                "valueOf" : value,
                "sectorName" : "Value 1",
                "ind1" : d.ind1,
                "ind1Year" : d.ind1Year,
                "population" : d.population,
                "popYear" : d.popYear
              };
              
              cDataMatrix[d.id][chordData[a].id] = matrixElement;
              cDataMatrix[chordData[a].id][d.id] = matrixElement;
            } else if(chordData[a].name == 'Value 2'){
              matrixElement = {
                "name" : d.name,
                "id" : d.id,
                "value" : d.ind6.value2,
                "valueOf" : value,
                "sectorName" : "Value 2",
                "ind1" : d.ind1,
                "ind1Year" : d.ind1Year,
                "population" : d.population,
                "popYear" : d.popYear
              };
              
              cDataMatrix[d.id][chordData[a].id] = matrixElement;
              cDataMatrix[chordData[a].id][d.id] = matrixElement;
            } else if(chordData[a].name == 'Value 3'){
              matrixElement = {
                "name" : d.name,
                "id" : d.id,
                "value" : d.ind6.value3,
                "valueOf" : value,
                "sectorName" : "Value 3",
                "ind1" : d.ind1,
                "ind1Year" : d.ind1Year,
                "population" : d.population,
                "popYear" : d.popYear
              };

              cDataMatrix[d.id][chordData[a].id] = matrixElement;
              cDataMatrix[chordData[a].id][d.id] = matrixElement;
            } else if(chordData[a].name == 'Value 4'){
              matrixElement = {
                "name" : d.name,
                "id" : d.id,
                "value" : d.ind6.value4,
                "valueOf" : value,
                "sectorName" : "Value 4",
                "ind1" : d.ind1,
                "ind1Year" : d.ind1Year,
                "population" : d.population,
                "popYear" : d.popYear
              };

              cDataMatrix[d.id][chordData[a].id] = matrixElement;
              cDataMatrix[chordData[a].id][d.id] = matrixElement;
            }
          }
        }
      });

      function value() {
        return this.value;
      }

      var chord = d3.layout.chord()
        .padding(0.01)
        .matrix(cDataMatrix);

      var layerScale = d3.scale.linear().domain(d3.extent(ind1)).range([340, 380]);

      var chordArc = d3.svg.arc()
        .innerRadius(340)
        .outerRadius(function(d, i){
          var outer = 360;
          if(chordData[i].ind1 != null){
            outer = layerScale(chordData[i].ind1);
          }

          return outer;
        });

      var ch = d3.svg.chord()
        .radius(336);

      var groups = cDiagram.selectAll("g.groups")
        .data(chord.groups)
        .enter().append("g")
        .attr("class", "groups");

      groups.append("path")
        .attr("id", function(d, i){
          return chordData[i].name;
        })
        .attr("d", chordArc)
        .style("fill", function(d, i){
          var color = "#5A0903";//colorCL(chordData[i].childLabor);
          switch(chordData[i].name){
            case "Value 1":
              color = fill("Value 1");
              break;
            case "Value 2":
              color = fill("Value 2");
              break;
            case "Value 3":
              color = fill("Value 3");
              break;
            case "Value 4":
              color = fill("Value 4");
              break;
            case "Spacer":
              color = "#fff";
              break;
          }
          return color;
        })
        .style("stroke", function(d, i){
          var color = d3.rgb("#5A0903").darker();//colorCL(chordData[i].childLabor)).darker();
          switch(chordData[i].name){
            case "Value 1":
              color = d3.rgb(fill("Value 1")).darker();//stroke("Agriculture");
              break;
            case "Value 2":
              color = d3.rgb(fill("Value 2")).darker();//stroke("Manufacturing");
              break;
            case "Value 3":
              color = d3.rgb(fill("Value 3")).darker();//stroke("Services");
              break;
            case "Value 4":
              color = d3.rgb(fill("Value 4")).darker();//stroke("Other");
              break;
            case "Spacer":
              color = "#fff";
              break;
          }
          return color;
        })
        .style("stroke-width", 2)
        .style("cursor", function(d, i){
          if(chordData[i].name !== "Spacer")
            return "pointer";
        })
        //.on("mouseover.fade", fade(.07))
        .on("mouseover.tooltip", function(d, i){
          if(chordData[i].name === "Spacer"){
            return;
          }

          var tipHtml = getHtml(chordData[i]);
          jQuery("#chordVizPopup").show().html(tipHtml);

          //Popoup position
          jQuery(document).mousemove(function(e){
              var tipBounds = {};

              tipBounds.left = e.pageX + 20,
              tipBounds.top = e.pageY - 10;

              tipBounds = detectBoundaries(tipBounds, "#chordVizPopup");

              jQuery("#chordVizPopup").css({"left":tipBounds.left,"top":tipBounds.top});
              jQuery("#chordVizPopup h4").css({"background": "#333333", "margin":0, "color":"#fff", "text-align":"center"});
          });
        })
        //.on("mouseout", fade(1))
        .on("click.fade", fade(.07))
        .on("click.mem", setChord);

      var chords = cDiagram.append("g")
        .attr("class", "chords")    
      
      chords.selectAll("path.chord")
        .data(chord.chords)
        .enter().append("svg:path")
        .attr("class", "chord")
        .style("fill", function(d){
          switch(d.target.value.sectorName){
            case "Value 1":
              color = fill("Value 1");
              break;
            case "Value 2":
              color = fill("Value 2");
              break;
            case "Value 3":
              color = fill("Value 3");
              break;
            case "Value 4":
              color = fill("Value 4");
              break;
          }
          return color;
        })
        .style("stroke", function(d){
          switch(d.target.value.sectorName){
            case "Value 1":
              color = d3.rgb(fill("Value 1")).darker();
              break;
            case "Value 2":
              color = d3.rgb(fill("Value 2")).darker();
              break;
            case "Value 3":
              color = d3.rgb(fill("Value 3")).darker();
              break;
            case "Value 4":
              color = d3.rgb(fill("Value 4")).darker();
              break;
          }
          return color;
        })
        .style("stroke-width", 1)
        .style("opacity", 0.5)
        .attr("d", ch);

      // Reset Chord Diagram
      d3.select("#chordReset").on("click", resetAnalViz);

      /********************************************************
       * resetAnalViz Function
       * Reset the Industry Sectors visualizations
       ********************************************************/
      function resetAnalViz(){
          cDiagram.selectAll("#chordViz .chords path")
              .transition().duration(500)
                .style("opacity", 0.5);

          isChordClicked = isBarClicked = false;
          chordMem = barMem = null;
      } // End resetAnalViz
}

/********************************************************
 * fade Function
 * Returns an event handler for fading a given chord 
 *     group -- from http://bl.ocks.org/mbostock/4062006
 ********************************************************/
function fade(opacity){
  return function(g, i){

    // If by any chance any of the spacer nodes are clicked, this will ensure nothing happens
    if(g.index || g.index == 0){
      if((g.index >= 0 && g.index < 30) || (g.index > 75 && g.index < 106))
        return;  
    }
    
    // Fade out all of the chords except for the one that has been clicked or that is related to the currently hovered bar
    d3.selectAll("#chordViz .chords path")
      .transition().duration(500)
        .style("opacity", function(d){
          // g.id is used for when a user is hovering over a bar from the bar chart, i is used for clicking on a chord node
          if(g.id){
            if(d.source.index != g.id && d.target.index != g.id)//} && (d.source.index != i && d.target.index != i)){
              return opacity;
          } else{
            if(d.source.index != i && d.target.index != i)
              return opacity;
          }
        });

    // Fade out all of the bars except for the one that is related to the chord that has been clicked or the one that is being overed over
    /*barLayer.selectAll("#stackedBarViz g g rect, #stackedBarViz g g text")
      .transition()
        .style("opacity", function(d, a){
          // If g.id, then we know a bar is being hovered over, otherwise there has been a click on a chord node
          if(g.id){
            if(a != i){
              return opacity + .23;
            }
          } else {
            if(d.id != i){
              return opacity + .23;
            }
          }
        });*/
  }
}

/********************************************************
 * fadeToPrev Function
 * Returns all elements (chords & bars) to full color 
 *     and highlights the previously selected chord/bar
 ********************************************************/
function fadeToPrev(opacity){
  return function(){
    if(!isChordClicked && !isBarClicked){
      resetAnalViz();
    } else{
      d3.selectAll("#chordViz .chords path")
        .transition().duration(500)
          .style("opacity", function(d, i){
            // g.id is used for when a user is hovering over a bar from the bar chart, i is used for clicking on a chord node
            if(chordMem){
              if(chordMem.index != d.source.index){ 
                return opacity; 
              }
            } else if(barMem){
              if(barMem.id != d.source.index)
                return opacity;
            }
          });

      /*barLayer.selectAll("#stackedBarViz g g rect, #stackedBarViz g g text")
        .transition()
          .style("opacity", function(d, a){
            // If g.id, then we know a bar is being hovered over, otherwise there has been a click on a chord node
            if(chordMem){
              if(chordMem.index != d.id){
                return opacity + .23;
              }
            } else if(barMem){
              if(barMem.id != d.id)
                return opacity + .23;
            }
          });*/
    }
  }
}

/********************************************************
 * setChord Function
 * Set the selected chord to a variable and clear the
 *     bar chart memory
 ********************************************************/
function setChord(data){
  chordMem = data;
  isChordClicked = true;
  barMem = null;
  isBarClicked = false;
}

/********************************************************
 * getHtml Function
 * Analyze the data of the hovered element, and return the
 *     HTML that goes into the tooltip
 ********************************************************/
function getHtml(data){
  var domSector, retHtml, povValue, attValue, pcValue;
  // Get the dominating sector for the current wedge
 /* for(var i = 0; i < cData.length; i++){
    if(data.name == cData[i].countryName){
      domSector = cData[i].domSectorName;
    }
  }

  // If there is no dominating sector, display not available
  if(!domSector){
    domSector = "Not Available";
  }*/

  // Check to see if the poverty value is NaN. If true, let the user know it's not available
  if(data.ind3){
    povValue = d3.round(data.ind3, 2);
    if(isNaN(povValue)){
      povValue = "Not Available";
    } else{
      povValue +="%";
    }
  }

  // Check to see if the net attendance value is NaN. If true, let the user know it's not available
  attValue = d3.round(data.ind5, 2);
  if(isNaN(attValue)){
    attValue = "Not Available";
  } else{
    attValue += "%";
  }

  pcValue = d3.round(data.ind4, 2);
  if(isNaN(pcValue)){
    pcValue = "Not Available";
  } else{
    pcValue += "%";
  }

  /*if(!data.population || data.population == "U")
    data.population = "No Data";

  if(!data.popYear || data.popYear == "U")
    data.popYear = "No Data";

  var popFormat = d3.format(",");*/
  
  // Compose the HTML for the tooltip
  retHtml = "<h4>"+data.name +"</h4>";
  
  // If it isn't a sector, include all the stats
  if(data.name != "Value 3" && data.name != "Value 4" && data.name != "Value 2" && data.name != "Value 1"){
    // Based on the data, the Working Children Year applies to the industry sectors as well
    var yearData = data.ind1Year ? data.ind1Year : "No Year Data";
    retHtml += //"<p><strong>Working Children Pop </strong>" + popFormat(data.population) + " (" + data.popYear + ")<br />" + 
        "<div><p><strong>Indicator 1 </strong>" + data.ind1 + "% (" + yearData + ")</p>" +
        //"<div id='sectorStats'><strong>Industry Sector Distribution (" + yearData + "):</strong>" +
        "<ul><li><strong>Value 1 </strong>" + data.ind6.value1 + "%</li>" +
        "<li><strong>Value 2 </strong>" + data.ind6.value2 + "%</li>" +
        "<li><strong>Value 3 </strong>" + data.ind6.value3 + "%</li>" +
        "<li><strong>Value 4 </strong>" + data.ind6.value4 + "%</li></ul></div>";
        /*"<p><strong>Child Labor: </strong>" + data.childLabor + "%<br />" +
        "<strong>Primary Completion: </strong>" + pcValue + "<br />" +
        //"<strong>Poverty: </strong>" + povValue + "<br />" +
        "<strong>Attendance: </strong>" + attValue + "<br />" +
        "<strong>Dominating Sector: </strong>" + domSector + "</p>";*/
  }

  return retHtml;
} // End getHtml