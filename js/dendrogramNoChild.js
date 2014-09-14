/********************************************************
* Dendrogram without children
* Author: Robert Felder
* Version: 1.0
* Description:
* Changelog: 6.1.2013 - Initial Creation
********************************************************/
/******* TODO: Add reset *******/
function drawDendrogramNoChild(data){
	// Filter out null data
	var dendroFilteredData = data.filter(function(d){
		if(d.ind4.value != null && d.ind1.value != null && d.ind3.value != null){
		  return d;
		}
	});

	dendroFilteredData.sort(function(a, b){
		return d3.ascending(a.team, b.team);
	});

	// Create an object formatted for D3's layout.tree()
	var dendroData = {}, dendroChildren = {}, childrenArr = [];
	dendroData['name'] = " ";

	dendroFilteredData.forEach(function(d){
		var clChildArr = [], povChildArr = [], pcChildArr = [];

	    pcChildArr.push({"name":"ind4", "size":d.ind4.value});
	    povChildArr.push({"name":"ind3", "size":d.ind3.value, "children":pcChildArr});
	    childrenArr.push({"name":d.team, "size":d.ind1.value, "children":povChildArr});
	});

	dendroData['children'] = childrenArr;

	// Define scale for the circles
	var clCircle = d3.scale.linear()
		.domain(d3.extent(ind1))
		.range([2, 12]);

	var povCircle = d3.scale.linear()
		.domain(d3.extent(ind3))
		.range([2, 12]);

	var pcCircle = d3.scale.linear()
		.domain(d3.extent(ind4))
		.range([2, 12]);

	// Set how large to make the dendrogram
	var diameter = 1060, i=0;

	var tree = d3.layout.tree()
		.size([360, diameter / 2 - 60])
		.separation(function(a, b){
		var size; 
		switch(a.name){
			case "ind1":
			  size = clCircle(a.size);
			  break;
			case "ind3":
			  size = povCircle(a.size);
			  break;
			case "ind4":
			  size = pcCircle(a.size);
			  break;
		}
		return (a.parent == b.parent ? 3 : 4) / a.depth; })
		.sort(function(a, b){
			return a.name - b.name;
		});

	var diagonal = d3.svg.diagonal.radial()
		.projection(function(d){ return [d.y, d.x / 180 * Math.PI]; });

	var dendrogramViz = d3.select("#dendrogramViz").append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.append("g")
		  .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

	/*dendroData.x0 = 960/2;
	dendroData.y0 = 960/2;*/

	function collapse(d){
		if(d.children){
		  d._children = d.children;
		  d._children.forEach(collapse);
		  d.children = null;
		}
	}

	//dendroData.children.forEach(collapse);
	//update(dendroData);

	var nodes = tree.nodes(dendroData),
		links = tree.links(nodes);

	nodes.forEach(function(d){
		var radSpace = 0;

		if(d.depth == 1){
		  radSpace = 390;
		} else if(d.depth == 2){
		  radSpace = 355;
		} else if(d.depth == 3){
		  radSpace = 320;
		}

		d.y = radSpace;
	});

	links.forEach(function(d){
		var radSpace = 270;

		d.y = radSpace;
	});

	/*var link = dendrogramViz.selectAll(".link")
	.data(links)
	.enter().append("path")
	.attr("class", "link")
	//.attr("transform", "translate(" + -diameter / 2 + "," + -diameter / 2 + ")")
	.attr("d", diagonal);*/

	var node = dendrogramViz.selectAll(".node")
		.data(nodes, function(d){
			return d.id || (d.id = ++i);
		})
		.enter().append("g")
		.attr("class", function(d){
			return "node " + d.name.replace(/[\W\s]/g,"");
		})
		.attr("id", function(d){
			return "node"+d.id;
		})
		.attr("transform", function(d){ return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

	node.append("circle")
		.attr("r", function(d){
			var size = clCircle(d.size);
			if(d.name == "ind3"){
				size = povCircle(d.size);
			} else if(d.name == "ind4"){
				size = pcCircle(d.size);
			}

			return size;
		})
		.style("fill", function(d){
			var color = "#883630";
			if(d.name == "ind3"){
				color = "#948500";//"#333333";
			} else if (d.name == "ind4"){
				color = "#006600";
			}

			return color;
		})
		.style("stroke", function(d){
			var color = d3.rgb("#883630").darker();
			if(d.name == "ind3"){
				color = d3.rgb("#948500").darker();
			} else if(d.name == "ind4"){
				color = d3.rgb("#006600").darker();
			}

			return color;
		})
		.style("cursor", "pointer")
		.on("click", transitionCircles)
		.on("mouseover", function(d){
			var nodeTitle, indName;
			switch(d.depth){
			case 1:
				nodeTitle = d.name;
			    indName = "Indicator 1";
			    break;
			case 2:
			    nodeTitle = d.parent.name;
			    indName = "Indicator 2";
			    break;
			case 3:
			    nodeTitle = d.parent.parent.name;
			    indName = "Indicator 3";
			    break;
			}
			jQuery("#correlationPopup").show().html(
				"<h4>" + nodeTitle + "</h4>" +
				"<p><strong>" + indName + ": " + d.size + "%</strong></p>");

			// Grab the height of the generated tooltip
			var tmPopHeight = jQuery("#correlationPopup").height();
			var tmPopWidth = jQuery("#correlationPopup").width() / 2;

			var color = "#883630";
			if(d.name == "ind3"){
				color = "#948500";//"#333333";
			} else if (d.name == "ind4"){
				color = "#006600";
			}

			// Style the title for the tooltip
			jQuery("#correlationPopup h4").css({"background": color, "margin":0, "text-align":"center", "color":"#fff"});

				// Position the tooltip based on mouse position
			jQuery(document).mousemove(function(e){
				var tipBounds = {};

				tipBounds.left = e.pageX + 20,
				tipBounds.top = e.pageY - 10;

				tipBounds = detectBoundaries(tipBounds, "#correlationPopup");

				jQuery("#correlationPopup").css({"left":tipBounds.left,"top":tipBounds.top, "opacity":0.9, "padding-bottom":"10px"});
			});
		});

	node.append("text")
	  .attr("dy", ".31em")
	  .attr("text-anchor", function(d){ return d.x < 180 ? "start" : "end"; })
	  .attr("transform", function(d){ 
	    if(d.name != "Is Education A Factor?"){
	      return d.x < 180 ? "translate(16)" : "rotate(180)translate(-16)";
	    } else {
	      return "rotate(270)translate(65, 14)";
	    }
	  })
	  .text(function(d, i){
	    if(d.name != "ind1" && d.name != "ind3" && d.name != "ind4")
	      return d.name; 
	  });

	function sortNodes(){
		var btnClicked = jQuery(this).children("button").val();

		jQuery("#corrSort li").removeClass("active removePointer").children().removeClass("removePointer");
		jQuery(this).addClass("active removePointer").children().addClass("removePointer");

		jQuery("#corrSort button").css("border-color", "#000");
		jQuery("." + btnClicked + "Btn").css("border-color", "#fff");

		if(btnClicked){
			switch(btnClicked){
			    case 'aToZ':
			      	tree.sort(function(a, b){
			        	return a.id - b.id;
			      	});
			      	break;
			    case 'ind1':
			      	tree.sort(function(a, b){
			        	return a.size - b.size;
			      	});
			      	break;
			    case 'ind3':
			      	tree.sort(function(a, b){
			        	if(a.children){
			        		return a.children[0].size - b.children[0].size;
			        	}
			      	});
			      	break;
			    case 'ind4':
			        tree.sort(function(a, b){
			        	if(a.children[0].children[0]){
			          		return a.children[0].children[0].size - b.children[0].children[0].size;
			        	}
			        });
			    	break;
		 	}
		}

		var nodes = tree.nodes(dendroData),
		    links = tree.links(nodes);

		nodes.forEach(function(d){
		  var radSpace = 0;

		  if(d.depth == 1){
		    radSpace = 350;
		  } else if(d.depth == 2){
		    radSpace = 315;
		  } else if(d.depth == 3){
		    radSpace = 280;
		  }

		  d.y = radSpace;
		});

		node.transition().duration(1000)
		  .attr("transform", function(d){ return "rotate(" + (d.x - 90) + ")translate(" + (d.y) + ")"; });

		node.selectAll("text")
		  .transition().delay(500).duration(1000)
		  .attr("dy", ".31em")
		    .attr("text-anchor", function(d){ return d.x < 180 ? "start" : "end"; })
		    .attr("transform", function(d){ 
		      if(d.name != "Is Education A Factor?"){
		        return d.x < 180 ? "translate(16)" : "rotate(180)translate(-16)";
		      } else {
		        return "rotate(270)translate(65, 14)";
		      }
		    })
		    .text(function(d){
		      if(d.name != "ind1" && d.name != "ind3" && d.name != "ind4")
		        return d.name; 
		    });
	}

	var teamObj = null;

	function transitionCircles(data){
		if(teamObj){
		  d3.select("g#node" + teamObj.id)
		    .transition().duration(1000)
		    .attr("transform", function(d){ return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

		  d3.select("g#node" + (teamObj.id+1))
		    .transition().duration(1000)
		    .attr("transform", function(d){ return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

		  d3.select("g#node" + (teamObj.id+2))
		    .transition().duration(1000)
		    .attr("transform", function(d){ return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

		  d3.select("#dendrogramViz g#node" + teamObj.id + " text")
		    .transition().duration(1000)
		    .attr("transform", function(d){ 
		          return teamObj.x < 180 ? "translate(16)" : "rotate(180)translate(-16)";
		      })
		    .attr("text-anchor", function(d){ return d.x < 180 ? "start" : "end"; });

		  d3.select("g#node" + teamObj.id + " circle")
		  .style("cursor", "pointer")

		  d3.select("g#node" + (teamObj.id+1) + " circle")
		    .style("cursor", "pointer")

		  d3.select("g#node" + (teamObj.id+2) + " circle")
		    .style("cursor", "pointer")
		}

		switch(data.depth){
		  case 1:
		    teamObj = data;
		    break;
		  case 2:
		    teamObj = data.parent;
		    break;
		  case 3:
		    teamObj = data.parent.parent;
		    break;
		}

		d3.select("g#node" + teamObj.id)
		  .transition().duration(1000)
		  .attr("transform", "translate(-25, 0)");

		d3.select("g#node" + (teamObj.id+1))
		  .transition().duration(1000)
		  .attr("transform", "translate(0, 0)");

		d3.select("g#node" + (teamObj.id+2))
		  .transition().duration(1000)
		  .attr("transform", "translate(25, 0)");

		d3.select("#dendrogramViz g#node" + teamObj.id + " text")
		  .transition().duration(1000)
		  .attr("transform", "rotate(0)translate(25, 25)")
		  .attr("text-anchor", "middle");

		d3.select("g#node" + teamObj.id + " circle")
		  .style("cursor", "auto");

		d3.select("g#node" + (teamObj.id+1) + " circle")
		  .style("cursor", "auto");

		d3.select("g#node" + (teamObj.id+2) + " circle")
		  .style("cursor", "auto");
	}

	//d3.selectAll("#corrSort li").on("click", sortNodes);
	
	function click(d){
	if(d.children){
	  d._children = d.children;
	  d.children = null;
	} else{
	  d.children = d._children;
	  d._children = null;
	}
	update(d);
	}
}