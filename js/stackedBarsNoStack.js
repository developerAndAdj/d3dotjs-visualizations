/********************************************************
* Stream Graph
* Author: Robert Felder
* Version: 1.0
* Description:
* Changelog: 4.20.2014 - Initial Creation
********************************************************/
/*
 * Note: Elected not to use d3.stack() simply because it 
 *       required more lines of code
 */

 function drawStackedBar(data){
      var barData = [],
          bHeight = 200,
          bWidth = 1065;

      data.forEach(function(d){
        barData.push({
          "team":d.team,
          //"countryCode":d.countryCode.threeDigit,
          //"name":d.reportInfo.statistics.children[4].name,
          "ind1Year":d.ind1.year,
          "ind1":d.ind1.value,
          //"popAge":d.reportInfo.statistics.children[4].age,
          "ind2":d.ind2.value,
          "ind2Year":d.ind2.year//,
          //"workStudyAge":d.workstudy.age
        });
      });

      // Define the y scales for the bars
      var bInd1Scale = d3.scale.linear()
          .domain([0, d3.max(barData, function(d){ return d.ind1; })])
          .range([1, (bHeight-50)-60]);

      var bInd2Scale = d3.scale.linear()
          .domain([0, d3.max(barData, function(d){ return d.ind2; })])
          .range([1, (bHeight-50)-60]);

      // Define the x scale for the bars
      var bXvals = d3.scale.ordinal()
          .domain(barData.map(function(d){ return d.team; }))
          .rangeRoundBands([0, bWidth - 4], .2);

      // Scale for the x axis
      var popXaxis = d3.svg.axis()
          .scale(bXvals)
          .tickSize(0, 1)
          .tickPadding(4)
          .tickFormat(function(d){ return ''; })
          .orient("bottom");

      // Draw the bars            
      var popWorkStudy = d3.select("#stackedBarViz").append("svg")
          .attr("width", bWidth)
          .attr("height", bHeight);//.append("g")
          //.attr("transform", "translate(-5, 524)");

      var wsBarGroup = popWorkStudy.append("g")
          .attr("class", "popWorkStudy ind2");

      var wsBars = wsBarGroup.selectAll("rect")
          .data(barData)
          .enter().append("rect")
          .attr("x", function(d, i, j){ return bXvals(d.team); })
          .attr("y", function(d){ return bHeight - bInd2Scale(d.ind2); })
          .attr("width", bXvals.rangeBand())
          .attr("height", function(d){ return bInd2Scale(d.ind2); })
          .attr("transform", "translate(0, -50)")
          .style("fill", "#4387ff")
          .style("stroke", d3.rgb("#4387ff").darker())
          .on("mousemove", function(d){
            var mouseLoc = d3.mouse(this.parentNode);
            // Display the tooltip
            corrBarTooltip(d, "ind2");

            // Position the tooltip based on mouse position
            jQuery(document).mousemove(function(e){
              var tipBounds = {};

              tipBounds.left = e.pageX + 10;
              tipBounds.top = e.pageY - 30;

              tipBounds = detectBoundaries(tipBounds, "#popBarPopup");

              if(mouseLoc[0] < (bWidth/2)) {
                tipBounds.left = tipBounds.left - jQuery("#popBarPopup").width() - 20;
              }

              // Style the title for the tooltip
              jQuery("#popBarPopup").css({
                "left":tipBounds.left,
                "top":tipBounds.top,
                "opacity":0.9,
                "text-align":"center",
                "color":"#000"
              });
            });
          })
          /*.on("mouseover", function(d){
            d3.select("#fullStreamViz .streamXaxis ." + d.country.replace(/[\W\s]/g,""))
              .transition().duration(2000)
                .style({"stroke" : "#888",
                        "opacity" : 1})
                .attr("y2", function(){
                  var bottomLine = isCombined ? 673 - bInd2Scale(d.ind2) : 904 - bInd2Scale(d.ind2);
                  return bottomLine;
                });
          })
          .on("mouseout", function(d){
            d3.select("#fullStreamViz .streamXaxis ." + d.country.replace(/[\W\s]/g,""))
              .transition().duration(2000)
                .style({"stroke" : "#000",
                        "opacity" : 0.15})
                .attr("y2", function(g){
                  var pathNode = getPathNode(g);
                  if(isCombined){
                    return yStream(pathNode[2].y0 + pathNode[2].y) + 40;
                  } else {
                    return y(pathNode[2].y - 3) + 575;
                  }
                });

            jQuery("#popBarPopup").hide();
          });*/

      var popBarGroup = popWorkStudy.append("g")
          .attr("class", "popWorkStudy ind1");

      var popBars = popBarGroup.selectAll("rect")
          .data(barData)
          .enter().append("rect")
          .attr("x", function(d){ return bXvals(d.team); })
          .attr("y", function(d, i){ return (bHeight - bInd1Scale(d.ind1)) - bInd2Scale(d.ind2); })
          .attr("width", bXvals.rangeBand())
          .attr("height", function(d){ return bInd1Scale(d.ind1); })
          .attr("transform", "translate(0, -50)")
          .style("fill", "#888")
          .style("stroke", d3.rgb("#888").darker())
          .on("mousemove", function(d){
            var mouseLoc = d3.mouse(this.parentNode);
            // Display the tooltip
            corrBarTooltip(d, "ind1");

            // Position the tooltip based on mouse position
            jQuery(document).mousemove(function(e){
              var tipBounds = {};

              tipBounds.left = e.pageX + 10;
              tipBounds.top = e.pageY - 30;

              tipBounds = detectBoundaries(tipBounds, "#popBarPopup");

              if(mouseLoc[0] < (bWidth/2)) {
                tipBounds.left = tipBounds.left - jQuery("#popBarPopup").width() - 20;
              }
              
              // Style the title for the tooltip
              jQuery("#popBarPopup").css({
                "left":tipBounds.left,
                "top":tipBounds.top,
                "opacity":0.9,
                "text-align":"center",
                "color":"#000"                
              });
            });
          })
          .on("mouseover", function(d){
            d3.select("#fullStreamViz .streamXaxis ." + d.team.replace(/[\W\s]/g,""))
              .transition().duration(2000)
                .style({"stroke" : "#888",
                        "opacity" : 1})
                .attr("y2", function(){
                  var bottomLine = isCombined ? 673 - bInd1Scale(d.ind1) : 904 - bInd1Scale(d.ind1);
                  return bottomLine;
                });
          })
          .on("mouseout", function(d){
            d3.select("#fullStreamViz .streamXaxis ." + d.team.replace(/[\W\s]/g,""))
              .transition().duration(2000)
                .style({"stroke" : "#000",
                        "opacity" : 0.15})
                .attr("y2", function(g){
                  var pathNode = getPathNode(g);
                  if(isCombined){
                    return yStream(pathNode[2].y0 + pathNode[2].y) + 40;
                  } else {
                    return y(pathNode[2].y - 3) + 575;
                  }
                });

            jQuery("#popBarPopup").hide();
          });

      // Draw the axis
      var bXaxis = popWorkStudy.append("g")
          .attr("class", "popXaxis")
          .attr("transform", "translate(0, " + (bHeight - 50) + ")")
          .call(popXaxis)
          .selectAll("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -4)
            .attr("y", -4)
            .style("text-anchor", "end");

      /*d3.select("#fullStreamViz").append("h4")
          .attr("class", "popBarTitle")
          .html("<strong>Working Children Population by Country</strong>");*/

      /********************************************************
       * corrBarTooltip Function
       * Constructs the tooltip html for the bar chart and 
       * displays
       ********************************************************/
      function corrBarTooltip(data, name){
        var popFormat = d3.format(","), value, year;

        // Prepare the data for the tooltip
        switch(name){
          case "ind1":
            name = "Indicator 1";
            value = popFormat(data.ind1);
            year = data.ind1Year;
            break;
          case "ind2":
            name = "Indicator 2";
            value = data.ind2 + "%";
            year = data.ind2Year;
        }

        // Show the tooltip
        jQuery("#popBarPopup").show().html("<h4>" + data.team + "</h4>" +
          "<p><strong>" + name + ": " + value + " (" + year + ")</strong></p>");
                            
        // Style the title for the tooltip
        jQuery("#popBarPopup h4").css({"background": "#000", "color":"#fff", "margin":0, "text-align":"center"});
      }

      /*var popWsBarLegend = d3.select("#corrViz").append("div")
          .attr("id", "popWsBarLegend");

      popWsBarLegend.append("ul")
        .html("<li><div id='popLeg' class='popWsLegEle'></div>Working Children Population</li>" +
          "<li><div id='ind2Leg' class='popWsLegEle'></div>Children Working and Studying</li>");*/

      /* End Population Bar Viz */
}