/********************************************************
* Arc Visualization
* Author: Robert Felder
* Version: 1.0
* Description:
* Changelog: 3.1.2013 - Initial Creation
* TODO: fix paths. The tooltip doesn't match actual path
********************************************************/

function drawArc(data){
  var r = 960 / 2,
      p = 35,
      rolodexData;
  // Begin Arc Visualization
  var indArcBody = d3.select("#arcVis").append("svg")
    .attr("width", 1110)
    .attr("height", 600)
    .append("g")
    .attr("transform", "translate(" + [523, 584] + ")");

  // Create the SVG element to house each indicator group
  var vis = d3.select("#rolodexVis").append("svg")
      .attr("width", r * 2 + p+35)
      .attr("height", r*2);

  // Append groups to draw 4 sorted rolodex's
  indArcBody.append("g")
    .attr("class", "aToZVis")
    //.style("opacity", 0)
    //.style("display", "none");

  indArcBody.append("g")
    .attr("class", "ind1Vis")
    .style("opacity", 0)
    .style("display", "none");

  indArcBody.append("g")
    .attr("class", "ind3Vis")
    .style("opacity", 0)
    .style("display", "none");

  indArcBody.append("g")
    .attr("class", "ind5Vis")
    .style("opacity", 0)
    .style("display", "none");

  indArcBody.append("g")
    .attr("class", "ind4Vis")
    .style("opacity", 0)
    .style("display", "none");

  // Innermost group of bars to represent the dominating sectors
  /*indArcBody.append("g")
    .attr("class", "domSectors")
    .style("opacity", 0)
    .style("display", "none");*/

  // Filter data to only countries that have all three (poverty, net attendance and gross enrollment) statistics
  var rolodexData = data.filter(function(d, i){
    if(d.ind4.value != null && d.ind1.value != null ){//&& d.grossEnrolment.values['2005-2010'] != null && d3.mean([d.netAttendance.values.male, d.netAttendance.values.female]) != null)
      return d;
    }
  });

  // Initialize scales to calculate the values needed to display each indicator
  // Scales for new arc
  var innerLayerScale = d3.scale.linear().domain(d3.extent(ind1)).range([304, 404]),
      middleLayerScale = d3.scale.linear().domain(d3.extent(ind4)).range([404, 504]),
      outerLayerScale = d3.scale.linear().domain(d3.extent(ind5)).range([504, 604]),
      arcScale = d3.scale.linear().range([-90*(Math.PI/180), 25.7*(Math.PI/180)]);//,
      //domSectorWidthScale = d3.scale.linear().domain(d3.extent(pCount)).range([0.2, 0.8]),
      //domSectorAngleScale = d3.scale.linear().domain(d3.extent(pCount)).range([179.8, 179.2]);

  // Create and define each layer of arcs. Each layer represents an indicator

  // Min/Max, A/Z labels
  var indArc = d3.svg.arc()
    .innerRadius(300)
    .outerRadius(304)
    .startAngle(90*(-Math.PI/180))
    .endAngle(90*(Math.PI/180));

  var arcTrim = indArcBody.append("g")
    .attr("class", "arcTrim");

  arcTrim.append("path")
    .attr("d", indArc)
    .style("shape-rendering", "geometricPrecision")
    .style("stroke-width", 0.6)
    .style("fill", "#fff");

  arcTrim.append("line")
    .attr("class", "arcBase")
    .attr("x1", 302)
    .attr("x2", 550)
    .attr("y1", 0)
    .attr("y2", 0)
    .style("stroke", "#000")
    .style("stroke-width", 2);

  arcTrim.append("text")
    .attr("class", "arcMax")
    .attr("dy", 15)
    .attr("x", 500)
    .text("Z")
    .style("font-weight", "bold");

  arcTrim.append("line")
    .attr("class", "arcBase")
    .attr("x1", -302)
    .attr("x2", -700)
    .attr("y1", 0)
    .attr("y2", 0)
    .style("stroke", "#000")
    .style("stroke-width", 2);

  arcTrim.append("text")
    .attr("class", "arcMin")
    .attr("dy", 15)
    .attr("x", -500)
    .text("A")
    .style("font-weight", "bold");

  // Indicator Arc Definitions for initial load
  var clArcLayer = d3.svg.arc()
    .startAngle(function(d, i){
      return arcScale(i*(Math.PI/179.2));
    })
    .endAngle(function(d, i){
      var degree = i+0.8;
      return arcScale(degree*(Math.PI/179.2));
    })
    .innerRadius(304)
    .outerRadius(function(d){
      return innerLayerScale(d.ind1.value);
    });

  var povArcLayer = d3.svg.arc()
    .startAngle(function(d, i){
      return arcScale(i*(Math.PI/179.2));
    })
    .endAngle(function(d, i){
      var degree = i+0.8;
      return arcScale(degree*(Math.PI/179.2));
    });
  
  var pcArcLayer = d3.svg.arc()
    .startAngle(function(d, i){
      return arcScale(i*(Math.PI/179.2));
    })
    .endAngle(function(d, i){
      var degree = i+0.8;
      return arcScale(degree*(Math.PI/179.2));
    })
    .innerRadius(function(d){
      return innerLayerScale(d.ind1.value);
    })
    .outerRadius(function(d){
      middleLayerScale.range([innerLayerScale(d.ind1.value), innerLayerScale(d.ind1.value) + 100]);
      return middleLayerScale(d.ind4.value);
    });

  var naArcLayer = d3.svg.arc()
    .startAngle(function(d, i){
      return arcScale(i*(Math.PI/179.2));
    })
    .endAngle(function(d, i){
      var degree = i+0.8;
      return arcScale(degree*(Math.PI/179.2));
    })
    .innerRadius(function(d){
      middleLayerScale.range([innerLayerScale(d.ind1.value), innerLayerScale(d.ind1.value) + 100]);
      return middleLayerScale(d.ind4.value);
    })
    .outerRadius(function(d){
      middleLayerScale.range([innerLayerScale(d.ind1.value), innerLayerScale(d.ind1.value) + 100]);
      if(d.ind5.value == null){
        return middleLayerScale(d.ind4.value);
      } else{
        outerLayerScale.range([middleLayerScale(d.ind4.value), middleLayerScale(d.ind4.value) + 100]);
        return outerLayerScale(d.ind5.value);
      }
    });

  // Draw each layer of bars
  var innerLayerGroup = d3.select(".aToZVis").append("g")
    .attr("class", "ind1");
    //.attr("transform", "translate(" + [600, 500] + ")");

  var middleLayerGroup = d3.select(".aToZVis").append("g")
    .attr("class", "ind3");
    //.attr("transform", "translate(" + [600, 500] + ")");

  var outerLayerGroup = d3.select(".aToZVis").append("g")
    .attr("class", "ind5");

  var innerLayerBars = innerLayerGroup.selectAll("path")
    .data(rolodexData)
    .enter().append("path")
    .attr("d", clArcLayer)
    .attr("class", function(d){
        return d.team.replace(/[\W\s]/g,"") + " ind1";
    })
    .style("stroke", "#fff")
    .style("shape-rendering", "geometricPrecision")
    .style("stroke-width", 0.6)
    .style("stroke-linecap", "butt")
    .style("cursor", "pointer")
    .style("fill", function(d){
          return colorCL(d.ind1.value);
    })
    .on("mouseover", function(d){
      var tipHtml = getHtml(d);
      jQuery("#arcVisPopup").show().html(tipHtml);

      //Popoup position
      jQuery(document).mousemove(function(e){
          var popLeft = e.pageX + 20;
          var popTop = e.pageY + -10;

          jQuery("#arcVisPopup").css({"left":popLeft,"top":popTop});
          jQuery("#arcVisPopup h4").css({"background": "#883630", "margin":0, "color":"#fff", "text-align":"center"});
      });
    })
    .on("click", clickSlice);

  var middleLayerBars = middleLayerGroup.selectAll("path")
    .data(rolodexData)
    .enter().append("path")
    .attr("d", pcArcLayer)
    .attr("class", function(d){
        return d.team.replace(/[\W\s]/g,"") + " ind4";
    })
    .style("stroke", "#fff")
    .style("shape-rendering", "geometricPrecision")
    .style("stroke-width", 0.6)
    .style("stroke-linecap", "butt")
    .style("cursor", "pointer")
    .style("fill", function(d){
          return colorPc(d.ind4.value);
    })
    .on("mouseover", function(d){
      var tipHtml = getHtml(d);
      jQuery("#arcVisPopup").show().html(tipHtml);

      //Popoup position
      jQuery(document).mousemove(function(e){
          var popLeft = e.pageX + 20;
          var popTop = e.pageY + -10;

          jQuery("#arcVisPopup").css({"left":popLeft,"top":popTop});
          jQuery("#arcVisPopup h4").css({"background": "#333333", "margin":0, "color":"#fff", "text-align":"center"});
      });
    })
    .on("mouseout", function(d){
      jQuery("#arcVisPopup").hide();
    })
    .on("click", clickSlice);

  var outerLayerBars = outerLayerGroup.selectAll("path")
    .data(rolodexData)
    .enter().append("path")
    .attr("d", naArcLayer)
    .attr("class", function(d){
        return d.team.replace(/[\W\s]/g,"") + " ind5";
    })
    .style("stroke", "#fff")
    .style("shape-rendering", "geometricPrecision")
    .style("stroke-width", 0.6)
    .style("stroke-linecap", "butt")
    .style("cursor", "pointer")
    .style("fill", function(d){
          return colorNA(d.ind5.value);
    })
    .on("mouseover", function(d){
      var tipHtml = getHtml(d);
      jQuery("#arcVisPopup").show().html(tipHtml);

      //Popoup position
      jQuery(document).mousemove(function(e){
          var popLeft = e.pageX + 20;
          var popTop = e.pageY + -10;

          jQuery("#arcVisPopup").css({"left":popLeft,"top":popTop});
          jQuery("#arcVisPopup h4").css({"background": "#1E6489", "margin":0, "color":"#fff", "text-align":"center"});
      });
    })
    .on("mouseout", function(d){
      jQuery("#arcVisPopup").hide();
    })
    .on("click", clickSlice);

  // New Sorting
  jQuery("#sortRolodex button").on("click", sortArc);

  function sortArc(){
    var clickedVal = jQuery(this).val(), layerInfo = {};

    // Set up the scales for the arcs. These are specifically for A to Z and Child Labor
    innerLayerScale.domain(d3.extent(ind1));
    middleLayerScale.domain(d3.extent(ind4));
    outerLayerScale.domain(d3.extent(ind5));

    // Set the innerRadius and outerRadius for each layer.
    clArcLayer.innerRadius(304)
      .outerRadius(function(d){
        return innerLayerScale(d.ind1.value);
      });

    pcArcLayer.innerRadius(function(d){
        return innerLayerScale(d.ind1.value);
      })
      .outerRadius(function(d){
        middleLayerScale.range([innerLayerScale(d.ind1.value), innerLayerScale(d.ind1.value) + 100]);
        return middleLayerScale(d.ind4.value);
      });

    naArcLayer.innerRadius(function(d){
        middleLayerScale.range([innerLayerScale(d.ind1.value), innerLayerScale(d.ind1.value) + 100]);
        return middleLayerScale(d.ind4.value);
      })
      .outerRadius(function(d){
        middleLayerScale.range([innerLayerScale(d.ind1.value), innerLayerScale(d.ind1.value) + 100]);
        if(d.ind5.value == null){
          return middleLayerScale(d.ind4.value);
        } else{
          outerLayerScale.range([middleLayerScale(d.ind4.value), middleLayerScale(d.ind4.value) + 100]);
          return outerLayerScale(d.ind5.value);
        }
      });
    
    // Sort the data based off of the button that was clicked
    switch(clickedVal){
      case 'aToZ':
        rolodexData.sort(function(a, b){
          return d3.ascending(a.team, b.team);
        });

        innerLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", clArcLayer)
          .style("fill", function(d){ return colorCL(d.ind1.value); });

        middleLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", pcArcLayer)
          .style("fill", function(d){ return colorPc(d.ind4.value); });

        outerLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", naArcLayer)
          .style("fill", function(d){ return colorNA(d.ind5.value); });

        d3.select(".arcMin").text("Min");
        d3.select(".arcMax").attr("x", 481).text("Max");

        d3.select(".arcMin").text("A");
        d3.select(".arcMax").attr("x", 500).text("Z");
        break;
      case 'ind1':
        rolodexData.sort(function(a, b){
          return a.ind1.value - b.ind1.value;
        });

        innerLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", clArcLayer)
          .style("fill", function(d){ return colorCL(d.ind1.value); });

        middleLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", pcArcLayer)
          .style("fill", function(d){ return colorPc(d.ind4.value); });

        outerLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", naArcLayer)
          .style("fill", function(d){ return colorNA(d.ind5.value); });

        d3.select(".arcMin").text("Min");
        d3.select(".arcMax").attr("x", 478).text("Max");
        break;
      case 'ind5':
        rolodexData.sort(function(a, b){
          return a.ind5.value - b.ind5.value;
        });
        
        // Set up the scales for the arcs
        innerLayerScale.domain(d3.extent(ind5));
        middleLayerScale.domain(d3.extent(ind4));
        outerLayerScale.domain(d3.extent(ind1));

        naArcLayer.innerRadius(304)
          .outerRadius(function(d){
            if(d.ind5.value == null){
              return 304;
            } else{
              return innerLayerScale(d.ind5.value);
            }
          });

        pcArcLayer.innerRadius(function(d){
            if(d.ind5.value == null){
              return 304;
            } else{
              return innerLayerScale(d.ind5.value);
            }
          })
          .outerRadius(function(d){
            if(d.ind5.value == null){
              middleLayerScale.range([304, 404]);
            } else{
              middleLayerScale.range([innerLayerScale(d.ind5.value), innerLayerScale(d.ind5.value) + 100]);
            }
            return middleLayerScale(d.ind4.value);
          });

        clArcLayer.innerRadius(function(d){
            if(d.ind5.value == null){
              middleLayerScale.range([304, 404]);
            } else{
              middleLayerScale.range([innerLayerScale(d.ind5.value), innerLayerScale(d.ind5.value) + 100]);
            }
            return middleLayerScale(d.ind4.value);
          })
          .outerRadius(function(d){
            if(d.ind5.value == null){
              middleLayerScale.range([304, 404]);
            } else{
              middleLayerScale.range([innerLayerScale(d.ind5.value), innerLayerScale(d.ind5.value) + 100]);
            }
            outerLayerScale.range([middleLayerScale(d.ind4.value), middleLayerScale(d.ind4.value) + 100]);

            return outerLayerScale(d.ind1.value);
          });

        innerLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", naArcLayer)
          .style("fill", function(d){ return colorNA(d.ind5.value); });

        middleLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", pcArcLayer)
          .style("fill", function(d){ return colorPc(d.ind4.value); });

        outerLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", clArcLayer)
          .style("fill", function(d){ return colorCL(d.ind1.value); });

        d3.select(".arcMin").text("Min");
        d3.select(".arcMax").attr("x", 478).text("Max");
        break;
      case 'ind4':
        rolodexData.sort(function(a, b){
          return a.ind4.value - b.ind4.value;
        });

        innerLayerScale.domain(d3.extent(ind4));
        middleLayerScale.domain(d3.extent(ind5));
        outerLayerScale.domain(d3.extent(ind1));

        pcArcLayer.innerRadius(304)
          .outerRadius(function(d){
            return innerLayerScale(d.ind4.value);
          });

        naArcLayer.innerRadius(function(d){
            return innerLayerScale(d.ind4.value);
          })
          .outerRadius(function(d){
            if(d.ind5.value == null){
              return innerLayerScale(d.ind4.value);
            } else{
              middleLayerScale.range([innerLayerScale(d.ind5.value), innerLayerScale(d.ind5.value) + 100]);
              return middleLayerScale(d.ind4.value);
            }
          });

        clArcLayer.innerRadius(function(d){
             if(d.ind5.value == null){
              return innerLayerScale(d.ind4.value);
            } else{
              middleLayerScale.range([innerLayerScale(d.ind5.value), innerLayerScale(d.ind5.value) + 100]);
              return middleLayerScale(d.ind4.value);
            }
          })
          .outerRadius(function(d){
            if(d.ind5.value == null){
              outerLayerScale.range([innerLayerScale(d.ind4.value), innerLayerScale(d.ind4.value) + 100])
            } else{
              middleLayerScale.range([innerLayerScale(d.ind4.value), innerLayerScale(d.ind4.value) + 100]);
              outerLayerScale.range([middleLayerScale(d.ind5.value), middleLayerScale(d.ind5.value) + 100]);
            }
            return outerLayerScale(d.ind1.value);
          });

        innerLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", pcArcLayer)
          .style("fill", function(d){ return colorPc(d.ind4.value); });

        middleLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", naArcLayer)
          .style("fill", function(d){ return colorNA(d.ind5.value); });

        outerLayerBars.data(rolodexData)
          .transition().duration(2000)
          .attr("d", clArcLayer)
          .style("fill", function(d){ return colorCL(d.ind1.value); });

        d3.select(".arcMin").text("Min");
        d3.select(".arcMax").attr("x", 478).text("Max");
        break;
    }
  }

  // User clicks a slice of the arc visualization
  function clickSlice(data){      
    d3.selectAll("#arcVis g g path")
      .transition()
        .duration(750)
        .style("stroke", "#fff")
        .style("opacity", 0.6);

    d3.selectAll("#arcVis text").style("fill", "#000000");

    d3.selectAll("path." + data.team.replace(/[\W\s]/g,""))
      .transition()
        .duration(750)
        .style("opacity", 1)
        .style("stroke", "red");
    
    d3.selectAll("text." + data.team.replace(/[\W\s]/g,""))
      .transition()
        .duration(500)
        .style("fill", "red");

    d3.selectAll("path." + data.team.replace(/[\W\s]/g,"")).call(moveToFront);
  }

  // Analyze the data of the hovered wedge, and return the HTML that goes into the tooltip
  function getHtml(data){
    var domSector, retHtml, povValue, netValue;

    // Check to see if the poverty value is NaN. If true, let the user know it's not available
    povValue = d3.round(data.ind3.value, 2);
    if(isNaN(povValue)){
      povValue = "Not Available";
    } else{
      povValue +="%";
    }

    // Check to see if the net ind5 value is NaN. If true, let the user know it's not available
    netValue = d3.round(data.ind5.value, 2)
    if(isNaN(netValue)){
      netValue = "Not Available";
    } else{
      netValue += "%";
    }

    // Compose the HTML for the tooltip
    retHtml = "<h4>"+data.team +"</h4>" +
        "<div><p><strong>Indicator 1: </strong>" + data.ind1.value + "%<br />" +
        "<strong>Indicator 2: </strong>" + netValue + "<br />" +
        "<strong>Indicator 3: </strong>" + povValue + "<br /></p></div>";/* +
        "<strong>Dominating Sector: </strong>" + domSector + "</p>";*/

    return retHtml;
  }

  function moveToFront(){
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  }

  d3.select("#arcReset").on("click", resetViz);
  // Reset the stats, arc, and tree map visualizations
  function resetViz(){
    d3.selectAll("#arcVis g g path")
      .transition()
        .duration(500)
        .style("stroke", "#fff")
        .style("opacity", 1);
  }
}