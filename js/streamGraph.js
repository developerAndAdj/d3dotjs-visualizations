/********************************************************
* Stream Graph
* Author: Robert Felder
* Version: 1.0
* Description:
* Changelog: 3.13.2014 - Initial Creation
********************************************************/

function drawStreamGraph(data){
      // Filter out null data
      var streamFilteredData = data.filter(function(d){
        if(d.ind4.value != null && d.ind1.value != null && d.ind3.value != null){//s['2005-2010'] != null){
          return d;
        }
      });

      // Sort data from A to Z
      streamFilteredData.sort(function(a, b){
        return d3.ascending(a.team, b.team);
      });

      // Stream Graph visualization
      var streamW = 1065,
          streamH = 355,
          corHeight = 200,
          offset = 45,
          isCombined = true,
          ind1Arr = [],
          ind3Arr = [],
          ind4Arr = [],
          streamMed = [],
          sortInd = 3;

      // Get the ranges corresponding to the filtered data set
      streamFilteredData.forEach(function(d){
        if(d.ind1.value != null)
          ind1Arr.push(d.ind1.value);

        if(d.ind3.value != null)//s['2005-2010'] != null)
          ind3Arr.push(d.ind3.value);//s['2005-2010']);

        if(d.ind4.value != null)
          ind4Arr.push(d.ind4.value);
      });

      streamMed[0] = d3.median(ind1Arr);
      streamMed[1] = d3.median(ind4Arr);
      streamMed[2] = d3.median(ind3Arr);

      // Create the 3 layers for each indicator
      var streamStack = d3.layout.stack().offset("silhouette");
      var streamLayers = streamStack(["ind1", "ind4", "ind3"].map(function(stream){
        return streamFilteredData.map(function(d){
          var yVal;
          switch(stream){
            case "ind1":
              yVal = d[stream].value;
              break;
            case "ind3":
              yVal = d[stream].value;//s['2005-2010'];
              break;
            case "ind4":
              yVal = d[stream].value;
              break;
          }

          return {x: d.team, y: yVal, name: stream, year: d[stream].year};
        });
      }));

      var xStream = d3.scale.ordinal()
          .domain(streamFilteredData.map(function(d){ return d.team; }))
          .rangeRoundBands([0, (streamW-4)], .1);

      var yStream = d3.scale.linear()
          .domain([0, d3.max(streamLayers[streamLayers.length - 1], function(d){return d.y0 + d.y})])
          .range([1, streamH + offset]);

      var y = d3.scale.linear()
          .domain(d3.extent(ind1Arr))
          .range([1, (corHeight/2)]);

      var streamColor = d3.scale.ordinal()
          .domain(["ind1", "ind4", "ind3"])
          .range(["#883630", "#31A354", "#F5DD5C"]);

      var streamArea = d3.svg.area()
          .x(function(d){ return xStream(d.x); })
          .y0(function(d, i){ return yStream(d.y0); })
          .y1(function(d){ return yStream(d.y0 + d.y); });

      var area = d3.svg.area()
          .x(function(d){ return xStream(d.x); })
          .y0(function(d){ return y(d.y); }) //baseline
          .y1(function(d){ return -y(d.y); }); //topline

      var fullStream = d3.select("#fullStreamViz").append("svg")
          .attr("width", streamW)
          .attr("height", 690)//862)//810)
          .append("g")
            .attr("transform", "translate(0, 182)")
            .attr("class", "streamGroup");

      var lowHighInd = fullStream.append("g")
          .style("display", "none");

      var lowInd = lowHighInd.append("text")
          .text("L")
          .attr("transform", "translate(16, 0)");

      var highInd = lowHighInd.append("text")
          .text("H")
          .attr("transform", "translate(1020, 0)");

      var fullStreamPath = fullStream.selectAll("path")
          .data(streamLayers)
          .enter().append("path")
          .attr("class", function(d, i){ return d[i].name; })
          .attr("d", streamArea)
          .attr("fill", function(d, i){ return streamColor(d[i].name); })
          .attr("stroke", function(d, i){ return d3.rgb(streamColor(d[i].name)).darker(); })
          .attr("stroke-width", 1.5)
          .on("mouseenter", showStreamTip());

      var streamXaxis = d3.svg.axis()
          .scale(xStream)
          .tickSize((streamH+offset+14), 0, 0)
          .orient("bottom");

      fullStream.append("g")
          .attr("class", "streamXaxis")
          .attr("transform", "translate(-7, 0)")
          .call(streamXaxis)
          .selectAll("text")
            .attr("transform", "rotate(-90)")
            .attr("x", function(d, i){ var pathNode = getPathNode(d); return i%2 ? -yStream(pathNode[0].y0) + 48 : -yStream(pathNode[2].y0 + pathNode[2].y) - 48; })//-(streamLayers[0][i].y0 - (streamLayers[0][i].y - 10)) : -(streamLayers[2][i].y0 + 310); })
            .attr("y", -4)
            .style("text-anchor", function(d, i){ return i%2 ? "start" : "end"; });

      d3.selectAll(".streamXaxis line")
        .attr("class", function(d){ return d.replace(/[\W\s]/g,"");})
        .attr("y1", function(d, i){ var pathNode = getPathNode(d); return yStream(pathNode[0].y0) - 40; })
        .attr("y2", function(d, i){ var pathNode = getPathNode(d); return yStream(pathNode[2].y0 + pathNode[2].y) + 40; });

      d3.selectAll(".streamXaxis .tick")
        .append("circle")
          .attr("r", 3)
          .attr("cy", function(d, i){ var pathNode = getPathNode(d); return i%2 ? yStream(pathNode[0].y0) - 42 : yStream(pathNode[2].y0 + pathNode[2].y) + 42; })
          .style({"fill" : "#000", "cursor" : "pointer"})
          .style("stroke", "#000")
          .on("mouseover", function(d, i){
            var teamData = {};
            streamFilteredData.forEach(function(k){
              if(k.team == d){
                teamData.ind1 = k.ind1.value;
                teamData.ind1Year = k.ind1.year;
                teamData.ind4 = k.ind4.value;
                teamData.ind4Year = k.ind4.year;
                teamData.ind3 = k.ind3.value;//s['2005-2010'];
                teamData.ind3Year = k.ind3.year;
              }
            });

            jQuery("#correlationPopup").show().html(
              "<h4>" + d + "</h4>" +
              "<ul><li><strong>Indicator 1: </strong>" + d3.round(teamData.ind1, 2) + "% (" + teamData.ind1Year + ")</li>" +
              "<li><strong>Indicator 2: </strong>" + d3.round(teamData.ind4, 2) + "% (" + teamData.ind4Year + ")</li>" +
              "<li><strong>Indicator 3: </strong>" + d3.round(teamData.ind3, 2) + "% (" + teamData.ind3Year + ")</li></ul>");

            // Grab the height of the generated tooltip
            var tmPopHeight = jQuery("#correlationPopup").height();
            var tmPopWidth = jQuery("#correlationPopup").width() / 2;
            var mouseLocate = d3.mouse(this.parentNode.parentNode)[0];

            // Style the title for the tooltip
            jQuery("#correlationPopup h4").css({"background": "#000", "margin":0, "text-align":"center", "color":"#fff"});

            // Position the tooltip based on mouse position
            jQuery(document).mousemove(function(e){
              var tipBounds = {};

              tipBounds.left = e.pageX + 20,
              tipBounds.top = e.pageY - 10;

              tipBounds = detectBoundaries(tipBounds, "#correlationPopup");

              // If the mouse is on the left half of the stream graph, show the tooltip on the left              
              if(mouseLocate < ((streamW/2) - 4)){
                tipBounds.left = tipBounds.left - jQuery("#correlationPopup").width() - 30;
              }

              jQuery("#correlationPopup").css({"left":tipBounds.left,"top":tipBounds.top, "opacity":0.9});
            });
          });

      function getPathNode(team){
        var pathNode = [];
        
        streamLayers.forEach(function(d, i){
          for(g = 0; g < d.length; g++){
            if(d[g].x == team)
              pathNode[i] = d[g];
          }
        });
        
        return pathNode;
      }

      function showStreamTip(){
        return (function(g, i){
          mouseContainer = this;

          d3.selectAll(".streamXaxis line")
            .on("mouseover", function(d, r){
              var name, color, upper, lower, pathNode = getPathNode(d), mouseLoc = d3.mouse(mouseContainer);

              // Grab the correct element that is being hovered over. 
              // Can't rely on r because the index of the line doesn't change when sorted.
              // Ex. pre-sort: jordan - r == 32 ... sorted by CL: jordan - r == 32, g[0] == 
              /*g.forEach(function(k, l){
                if(k.x == d){
                  pathNode = k;
                }
              });*/

              switch(g[i].name){
                case 'ind1':
                  name = "Indicator 1";
                  y.domain(d3.extent(ind1Arr));
                  i=0;
                  break;
                case 'ind3':
                  name = "Indicator 2";
                  y.domain(d3.extent(ind3Arr));
                  i=2;
                  break;
                case 'ind4':
                  name = "Indicator 3";
                  y.domain(d3.extent(ind4Arr));
                  i=1;
                  break;
              }

              upper = yStream(pathNode[i].y0) - 2;
              lower = yStream(pathNode[i].y0 + pathNode[i].y);
              color = streamColor(g[i].name);

              if(!isCombined){
                upper = -y(pathNode[i].y);
                lower = y(pathNode[i].y);
              }

              if(mouseLoc[1] > upper && mouseLoc[1] < lower){
                jQuery(this).css({"cursor" : "pointer"});
                jQuery("#correlationPopup").show().html(
                "<h4>" + pathNode[i].x + "</h4>" +
                "<ul><li><strong>" + name + ": </strong>" + d3.round(pathNode[i].y, 2) + "% (" + pathNode[i].year + ")</li></ul>");

                // Grab the height of the generated tooltip
                var tmPopHeight = jQuery("#correlationPopup").height();
                var tmPopWidth = jQuery("#correlationPopup").width() / 2;

                // Style the title for the tooltip
                jQuery("#correlationPopup h4").css({"background": color, "margin":0, "text-align":"center", "color":"#000"});

                // Position the tooltip based on mouse position
                jQuery(document).mousemove(function(e){
                  var tipBounds = {};

                  tipBounds.left = e.pageX + 20,
                  tipBounds.top = e.pageY - 10;

                  tipBounds = detectBoundaries(tipBounds, "#correlationPopup");

                  // If the mouse is on the left half of the stream graph, show the tooltip on the left
                  if(mouseLoc[0] < ((streamW/2) - 4)){
                    tipBounds.left = tipBounds.left - jQuery("#correlationPopup").width() - 30;
                  }

                  jQuery("#correlationPopup").css({"left":tipBounds.left,"top":tipBounds.top, "opacity":0.9});
                });
              }
            });
        });
        

      }

      // Stream Graph Click Events
      d3.selectAll("#corrSort li").on("click", sortStream);
      d3.select("#corrNav .splitBtn").on("click", splitStream);
      d3.select("#corrNav .combineBtn").on("click", combineStream);

      /********************************************************
       * sortStream Function
       * Handles the logic that sorts the stream graph whether
       *     it is combined or not
       ********************************************************/
      function sortStream(){
        var btnClicked = jQuery(this).children("button").val(), lineTop, lineBottom;

        jQuery("#corrSort li").removeClass("active removePointer").children().removeClass("removePointer");
        jQuery(this).addClass("active removePointer").children().addClass("removePointer");

        jQuery("#corrSort button").css("border-color", "#000");
        jQuery("." + btnClicked + "Btn").css("border-color", "#fff");
        
        if(btnClicked){
          switch(btnClicked){
            case 'aToZ':
              streamFilteredData.sort(function(a, b){
                return d3.ascending(a.team, b.team);
              });
              sortInd = 3;
              lowHighInd.transition().duration(2000).style("display", "none");
              break;
            case 'ind1':
              streamFilteredData.sort(function(a, b){
                return a.ind1.value - b.ind1.value;
              });
              sortInd = 0;
              if(isCombined) lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#883630", "stroke" : d3.rgb("#883630").darker()}).attr("transform", "translate(0, 82)");
              else lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#883630", "stroke" : d3.rgb("#883630").darker()}).attr("transform", "translate(0, 103)");

              //lowHighInd.transition().duration(2000)
                //  .style("fill", "#883630");
              break;
            case 'ind3':
              streamFilteredData.sort(function(a, b){
                  return a.ind3.value - b.ind3.value; //s['2005-2010'] - b.ind3.values['2005-2010'];
              });
              sortInd = 2;
              if(isCombined) lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#F5DD5C", "stroke" : d3.rgb("#F5DD5C").darker()}).attr("transform", "translate(0, 284)");
              else lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#F5DD5C", "stroke" : d3.rgb("#F5DD5C").darker()}).attr("transform", "translate(0, 504)");

              //lowHighInd.transition().duration(2000)
                //  .style("fill", "#F5DD5C");
              break;
            case 'ind4':
              streamFilteredData.sort(function(a, b){
                  return a.ind4.value - b.ind4.value;
              });
              sortInd = 1;
              if(isCombined) lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#31A354", "stroke" : d3.rgb("#31A354").darker()}).attr("transform", "translate(0, 174)");
              else lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#31A354", "stroke" : d3.rgb("#31A354").darker()}).attr("transform", "translate(0, 303)");

              //lowHighInd.transition().duration(2000)
                //  .style("fill", "#31A354");
              break;
          }

          streamLayers = streamStack(["ind1", "ind4", "ind3"].map(function(stream){
            return streamFilteredData.map(function(d){
              var yVal;
              switch(stream){
                case "ind1":
                  yVal = d[stream].value;
                  break;
                case "ind3":
                  yVal = d[stream].value;//s['2005-2010'];
                  break;
                case "ind4":
                  yVal = d[stream].value;
                  break;
              }

              return {x: d.team, y: yVal, name: stream};
            });
          }));

          xStream.domain(streamFilteredData.map(function(d){ return d.team; }));
          //x.domain(streamFilteredData.map(function(d){ return d.country; }));

          if(isCombined){
            /*var offsetTop = 0, offsetBottom = 0;
            switch(sortInd){
              case 0:
                offsetTop = 0;
                offsetBottom = 250;
                break;
              case 1:
                offsetTop = 125;
                offsetBottom = 125;
                break;
              case 2:
                offsetTop = 250;
                offsetBottom = 0;
                break;
            }*/
            d3.selectAll("#fullStreamViz path")
              .data(streamLayers)
              .transition().duration(2000)
              .attr("d", streamArea);

            streamXaxis.tickSize(414, 0, 0);

            fullStream.select(".streamXaxis")
              .transition().duration(2000)
              .call(streamXaxis);

            d3.selectAll(".streamXaxis line")
              .transition().duration(2000)
                /*.attr("y1", function(d){
                  var pathNode = getPathNode(d);
                  if(sortInd < 3){
                    return yStream(pathNode[sortInd].y0) - 40 - offsetTop;
                  } else {
                    return yStream(pathNode[0].y0) - 40;
                  }
                })*/
                .attr("y2", function(d){
                  var pathNode = getPathNode(d);
                  /*if(sortInd < 3){
                    return yStream(pathNode[sortInd].y0 + pathNode[sortInd].y) + 40 + offsetBottom;
                  } else {*/
                    return yStream(pathNode[2].y0 + pathNode[2].y) + 40;
                  //}
                });

            fullStream.selectAll(".streamXaxis text")
            .attr("y", -4)
            .transition().duration(2000)
              .style("text-anchor", function(d, i){
                var pathNode = getPathNode(d);
                if(sortInd < 3){
                  return pathNode[sortInd].y > streamMed[sortInd] ? "start" : "end";
                } else{
                  return i%2 ? "start" : "end";
                }
              })
              .attr("x", function(d, i){ 
                var pathNode = getPathNode(d);
                if(sortInd < 3){
                  return pathNode[sortInd].y > streamMed[sortInd] ? -yStream(pathNode[0].y0) + 48 /*+ offsetTop*/ : -yStream(pathNode[2].y0 + pathNode[2].y) - 48;/* - offsetBottom;*/
                } else {
                  return i%2 ? -yStream(pathNode[0].y0) + 48 : -yStream(pathNode[2].y0 + pathNode[2].y) - 48; 
                }
              });

            d3.selectAll(".streamXaxis .tick circle")
            .transition().duration(2000)
              .attr("cy", function(d, i){
                var pathNode = getPathNode(d);
                if(sortInd < 3){
                  return pathNode[sortInd].y > streamMed[sortInd] ? yStream(pathNode[0].y0) - 42  /*- offsetTop*/ : yStream(pathNode[2].y0 + pathNode[2].y) + 42;/* + offsetBottom;*/
                } else{
                  return i%2 ? yStream(pathNode[0].y0) - 42 : yStream(pathNode[2].y0 + pathNode[2].y) + 42;
                }
              });
          } else {
            y.domain(d3.extent(ind1Arr));

            d3.select("#fullStreamViz .ind1")
              .data([streamLayers[0]])
              .transition().duration(2000)
              .attr("d", area);

            y.domain(d3.extent(ind4Arr));

            d3.select("#fullStreamViz .ind4")
              .data([streamLayers[1]])
              .transition().duration(2000)
              .attr("d", area);

            y.domain(d3.extent(ind3Arr));

            d3.select("#fullStreamViz .ind3")
              .data([streamLayers[2]])
              .transition().duration(2000)
              .attr("d", area);

            //streamXaxis.tickSize(614, 0, 0);

            fullStream.select(".streamXaxis")
              .transition().duration(2000)
              .call(streamXaxis);

            fullStream.selectAll(".streamXaxis line")
              .transition().duration(2000)
                .attr("y1", function(d){
                  var pathNode = getPathNode(d);
                  if(sortInd < 3){
                    return -y(pathNode[sortInd].y - 36);
                  } else {
                    return -y(pathNode[0].y - 36);
                  }
                })
                .attr("y2", function(d){ 
                  var pathNode = getPathNode(d);
                  if(sortInd < 3){
                    return y(pathNode[sortInd].y - 3) + 595;
                  } else {
                    return y(pathNode[2].y - 3) + 595;
                  }
                });//575; });

            fullStream.selectAll(".streamXaxis text")
            .attr("y", -4)
            .transition().duration(2000)
              .style("text-anchor", function(d, i){
                var pathNode = getPathNode(d);
                if(sortInd < 3){
                  return pathNode[sortInd].y > streamMed[sortInd] ? "start" : "end";
                } else{
                  return i%2 ? "start" : "end";
                }
              })
              .attr("x", function(d, i){ 
                var pathNode = getPathNode(d);
                if(sortInd < 3){
                  return pathNode[sortInd].y > streamMed[sortInd] ? y(pathNode[sortInd].y - 30) : -y(pathNode[sortInd].y - 3) - 604;//584;
                } else {
                  return i%2 ? y(pathNode[0].y - 30) : -y(pathNode[2].y - 3) - 604;//584;
                }
              });

            d3.selectAll(".streamXaxis .tick circle")
              .transition().duration(2000)
                .attr("cy", function(d, i){
                  var pathNode = getPathNode(d);
                    if(sortInd < 3){
                      return pathNode[sortInd].y > streamMed[sortInd] ? -y(pathNode[sortInd].y - 38) : y(pathNode[sortInd].y - 3) + 597;//577;
                    } else {
                      return i%2 ? -y(pathNode[0].y - 38) : y(pathNode[2].y - 3) + 597;//577;
                    }
                  });
          }

          /* Sort Bar Chart 
          streamFilteredData.forEach(function(d){
            barData.push({
              "country":d.country,
              "countryCode":d.countryCode.threeDigit,
              "name":d.reportInfo.statistics.children[4].name,
              "popYear":d.reportInfo.statistics.children[4].year,
              "population":d.reportInfo.statistics.children[4].value,
              "popAge":d.reportInfo.statistics.children[4].age,
              "workStudy":d.workstudy.value,
              "workStudyYear":d.workstudy.year,
              "workStudyAge":d.workstudy.age
            });
          });

          wsBars.data(barData)
            .transition().duration(2000)
            .attr("x", function(d, i, j){ return xStream(d.country); });

          popBars.data(barData)
            .transition().duration(2000)
            .attr("x", function(d){ return xStream(d.country); });*/
        }
      }

      /********************************************************
       * splitStream Function
       * Handles the logic that splits the stream into
       *     individual streams
       ********************************************************/
      function splitStream(){
        if(!isCombined)
          return;

        isCombined = false;

        //jQuery("#fullStreamViz").height(1090);//1038);
        d3.select("#fullStreamViz")
          .transition().duration(2000)
          .style("height", 990);

        d3.select("#fullStreamViz svg")
          .transition().duration(2000)
            .attr("height", 990);//1038);

        y.domain(d3.extent(ind1Arr));

        fullStream.select("#fullStreamViz .ind1")
          .data([streamLayers[0]])
          .on("mouseover", showStreamTip())
          .transition().duration(2000)
          .attr("d", area)
          .attr("transform", "translate(0, 100)");

        y.domain(d3.extent(ind4Arr));

        fullStream.select("#fullStreamViz .ind4")
          .data([streamLayers[1]])
          .on("mouseover", showStreamTip())
          .transition().duration(2000)
          .attr("d", area)
          .attr("transform", "translate(0, 300)");

        y.domain(d3.extent(ind3Arr));

        fullStream.select("#fullStreamViz .ind3")
          .data([streamLayers[2]])
          .on("mouseover", showStreamTip())
          .transition().duration(2000)
          .attr("d", area)
          .attr("transform", "translate(0, 500)");

        //streamXaxis.tickSize(514, 0, 0);

        fullStream.select(".streamXaxis")
          .transition().duration(2000)
          .call(streamXaxis);

        fullStream.selectAll(".streamXaxis text")
          .attr("y", -4)
          .transition().duration(2000)
            .style("text-anchor", function(d, i){
              var pathNode = getPathNode(d);
              if(sortInd < 3){
                return pathNode[sortInd].y > streamMed[sortInd] ? "start" : "end";
              } else {
                return i%2 ? "start" : "end";
              }
            })
            .attr("x", function(d, i){
              var pathNode = getPathNode(d);
              if(sortInd < 3){
                return pathNode[sortInd].y > streamMed[sortInd] ? y(pathNode[sortInd].y - 30) : -y(pathNode[sortInd].y - 3) - 584;//604;//return pathNode[sortInd].y > streamMed[sortInd] ? y(pathNode[0].y - 30) : -y(pathNode[2].y - 3) - 584;
              } else {
                return i%2 ? y(pathNode[0].y - 30) : -y(pathNode[2].y - 3) - 584;//604;//584;
              }
            });

        d3.selectAll(".streamXaxis line")
          .transition().duration(2000)
            .attr("y1", function(d){
                  var pathNode = getPathNode(d);
                  if(sortInd < 3){
                    return -y(pathNode[sortInd].y - 36);
                  } else {
                    return -y(pathNode[0].y - 36);
                  }
                })
                .attr("y2", function(d){ 
                  var pathNode = getPathNode(d);
                  if(sortInd < 3){
                    return y(pathNode[sortInd].y - 3) + 575;
                  } else {
                    return y(pathNode[2].y - 3) + 575;
                  }
                });
            /*.attr("y1", function(d){ var pathNode = getPathNode(d); return -y(pathNode[0].y - 36); })
            .attr("y2", function(d){ var pathNode = getPathNode(d); return y(pathNode[2].y - 3) + 575; });*/

        d3.selectAll(".streamXaxis .tick circle")
          .transition().duration(2000)
            .attr("cy", function(d, i){
                  var pathNode = getPathNode(d);
                    if(sortInd < 3){
                      return pathNode[sortInd].y > streamMed[sortInd] ? -y(pathNode[sortInd].y - 38) : y(pathNode[sortInd].y - 3) + 577;
                    } else {
                      return i%2 ? -y(pathNode[0].y - 38) : y(pathNode[2].y - 3) + 577;
                    }
                  });
            /*.attr("cy", function(d, i){
              var pathNode = getPathNode(d);
                if(sortInd < 3){
                  return pathNode[sortInd].y > streamMed[sortInd] ? -y(pathNode[0].y - 38) : y(pathNode[2].y - 3) + 577;
                } else {
                  return i%2 ? -y(pathNode[0].y - 38) : y(pathNode[2].y - 3) + 578;
                }
              });*/

        switch(sortInd){
          case 0:
            lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#883630", "stroke" : d3.rgb("#883630").darker()}).attr("transform", "translate(0, 103)");
            break;
          case 1:
            lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#31A354", "stroke" : d3.rgb("#31A354").darker()}).attr("transform", "translate(0, 303)");
            break;
          case 2:
            lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#F5DD5C", "stroke" : d3.rgb("#F5DD5C").darker()}).attr("transform", "translate(0, 504)");
            break;
        }

        /*popWorkStudy.transition().duration(2000)
          .attr("transform", "translate(-5, 752)");

        popWsBarLegend.transition().duration(2000)
          .style("margin-top", "308px");*/
      }

      /********************************************************
       * combineStream Function
       * Handles the logic that combines the individual streams
       *     into a stacked stream
       ********************************************************/
      function combineStream(){
        if(isCombined)
          return;

        isCombined = true;

        //jQuery("#fullStreamViz").height(862);
        d3.select("#fullStreamViz")
          .transition().duration(2000)
          .attr("height", 862);

        d3.select("#fullStreamViz svg")
          .transition().duration(2000)
            .attr("height", 862);

        fullStream.selectAll("#fullStreamViz path")
          .data(streamLayers)
          .transition().duration(2000)
          .attr("d", streamArea)
          .attr("transform", "translate(0, 0)");

        //streamXaxis.tickSize(414, 0, 0);

        fullStream.select(".streamXaxis")
          .transition().duration(2000)
          .call(streamXaxis);

        fullStream.selectAll(".streamXaxis text")
          .attr("y", -4)
          .transition().duration(2000)
            .style("text-anchor", function(d, i){
              var pathNode = getPathNode(d);
              if(sortInd < 3){
                return pathNode[sortInd].y > streamMed[sortInd] ? "start" : "end";
              } else{
                return i%2 ? "start" : "end";
              }
            })
            .attr("x", function(d, i){
              var pathNode = getPathNode(d);
              if(sortInd < 3){
                return pathNode[sortInd].y > streamMed[sortInd] ? -yStream(pathNode[0].y0) + 48 : -yStream(pathNode[2].y0 + pathNode[2].y) - 48;
              } else{
                return i%2 ? -yStream(pathNode[0].y0) + 48 : -yStream(pathNode[2].y0 + pathNode[2].y) - 48;
              }
            });

        d3.selectAll(".streamXaxis line")
          .transition().duration(2000)
            .attr("y1", function(d){ var pathNode = getPathNode(d); return yStream(pathNode[0].y0) - 40; })
            .attr("y2", function(d){ var pathNode = getPathNode(d); return yStream(pathNode[2].y0 + pathNode[2].y) + 40; });

        d3.selectAll(".streamXaxis .tick circle")
          .transition().duration(2000)
            .attr("cy", function(d, i){
                var pathNode = getPathNode(d);
                if(sortInd < 3){
                  return pathNode[sortInd].y > streamMed[sortInd] ? yStream(pathNode[0].y0) - 42 : yStream(pathNode[2].y0 + pathNode[2].y) + 42;
                } else{
                  return i%2 ? yStream(pathNode[0].y0) - 42 : yStream(pathNode[2].y0 + pathNode[2].y) + 42;
                }
              });

        switch(sortInd){
          case 0:
            lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#883630", "stroke" : d3.rgb("#883630").darker()}).attr("transform", "translate(0, 82)");
            break;
          case 1:
            lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#31A354", "stroke" : d3.rgb("#31A354").darker()}).attr("transform", "translate(0, 174)");
            break;
          case 2:
            lowHighInd.transition().duration(2000).style({"display" : "block", "fill" : "#F5DD5C", "stroke" : d3.rgb("#F5DD5C").darker()}).attr("transform", "translate(0, 284)");
            break;
        }

        /*popWorkStudy.transition().duration(2000)
          .attr("transform", "translate(-5, 524)");

        popWsBarLegend.transition().duration(2000)
          .style("margin-top", "80px");*/
      }
}
      /* End Correlation Viz */