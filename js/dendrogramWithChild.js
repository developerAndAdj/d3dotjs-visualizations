/********************************************************
* Dendrogram with children
* Author: Robert Felder
* Version: 1.0
* Description:
* Changelog: 7.22.2013 - Initial Creation
********************************************************/
/******* TODO: Add sorting, and better load transition for the links, and reset *******/
function drawDendrogramWithChild(data){
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
		var subChildArr = [];

		subChildArr.push({"name":"ind1", "size":d.ind1.value},
		                 {"name":"ind3", "size":d.ind3.value},
		                 {"name":"ind4", "size":d.ind4.value})

		childrenArr.push({"name":d.team,
		                  "children":subChildArr});
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
	var diameter = 960, i=0;

	var tree = d3.layout.tree()
		.size([360, diameter / 2 - 120])
		//.nodeSize([360, diameter /2 - 120]);
		.separation(function(a, b){
		var size = 4.5;
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
		return (a.parent == b.parent ? 3 : size); })
		.sort(function(a, b){
			return a.name - b.name;
		});
		/*.sort(function(a, b){
		  return b.size - a.size;
		});*/

	var diagonal = d3.svg.diagonal.radial()
		.projection(function(d){ return [d.y, d.x / 180 * Math.PI]; });

	var dendrogramViz = d3.select("#dendrogramViz2").append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.append("g")
		  .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

	dendroData.x0 = 960/2;
	dendroData.y0 = 960/2;

	function collapse(d){
		if(d.children){
		  d._children = d.children;
		  d._children.forEach(collapse);
		  d.children = null;
		}
	}

	dendroData.children.forEach(collapse);
	update(dendroData);

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

	//d3.selectAll("#corrSort li").on("click", sortNodes);

	function update(source){
		var nodes = tree.nodes(dendroData),
		    links = tree.links(nodes);

		nodes.forEach(function(d){
		  var radSpace = 210;

		  if(d.depth > 1)
		    radSpace = 220;

		  d.y = d.depth * radSpace;
		});

		var node = dendrogramViz.selectAll(".node")
		  .data(nodes, function(d){
		    return d.id || (d.id = ++i);
		  });

		var nodeEnter = node.enter().append("g")
		  .attr("class", "node")
		  .attr("transform", function(d){ return "rotate(" + (d.x - 90) + ")translate(" + source.y0 + ")"; })
		  .on("click", click);

		nodeEnter.append("circle")
		  .attr("r", function(d){
		    var size = 4.5;

		    //if(d._children)
		      //return clCircle(d._children[0].size);

		    switch(d.name){
		      case "ind1":
		        size = clCircle(d.size);
		        break;
		      case "ind3":
		        size = povCircle(d.size);
		        break;
		      case "ind4":
		        size = pcCircle(d.size);
		        break;
		      default :
		        size = 4.5;
		    }

		    return size;
		  })
		  .style("fill", function(d){
		    var color;
		    switch(d.name){
		      case "ind1":
		        color = "#883630";
		        break;
		      case "ind3":
		        color = "#333333";
		        break;
		      case "ind4":
		        color = "#31A354";
		        break;
		    }

		    return color;
		  })
		  .style("stroke", function(d){
		    var color;
		    switch(d.name){
		      case "ind1":
		        color = d3.rgb("#883630").darker();
		        break;
		      case "ind3":
		        color = d3.rgb("#333333").darker();
		        break;
		      case "ind4":
		        color = d3.rgb("#31A354").darker();
		        break;
		    }

		    return color;
		  });

		nodeEnter.append("text")
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

		var nodeUpdate = node.transition()
		  .duration(1000)
		  .attr("transform", function(d){ return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

		nodeUpdate.select("circle")
		  .attr("r", function(d){
		    //if(d._children)
		      //return clCircle(d._children[0].size);
		    var size;
		    switch(d.name){
		      case "ind1":
		        size = clCircle(d.size);
		        break;
		      case "ind3":
		        size = povCircle(d.size);
		        break;
		      case "ind4":
		        size = pcCircle(d.size);
		        break;
		      default :
		        size = 4.5;
		    }

		    return size;
		  })
		  .style("fill", function(d){
		    var color;
		    switch(d.name){
		      case "ind1":
		        color = "#883630";
		        break;
		      case "ind3":
		        color = "#333333";
		        break;
		      case "ind4":
		        color = "#31A354";
		        break;
		    }

		    return d._children ? "steelblue" : color;
		  })
		  .style("stroke", function(d){
		    var color;
		    switch(d.name){
		      case "ind1":
		        color = d3.rgb("#883630").darker();
		        break;
		      case "ind3":
		        color = d3.rgb("#333333").darker();
		        break;
		      case "ind4":
		        color = d3.rgb("#31A354").darker();
		        break;
		    }

		    return color;
		  });

		nodeUpdate.select("text")
		  .style("fill-opacity", 1);

		var nodeExit = node.exit().transition()
		  .duration(1000)
		  .attr("transform", function(d){ return "rotate(" + (d.x - 90) + ")translate(" + source.y0 + ")"; })
		  .remove();

		nodeExit.select("circle")
		  .attr("r", function(d){
		    var size;
		    switch(d.name){
		      case "ind1":
		        size = clCircle(d.size);
		        break;
		      case "ind3":
		        size = povCircle(d.size);
		        break;
		      case "ind4":
		        size = pcCircle(d.size);
		        break;
		      default :
		        size = 4.5;
		    }

		    return size;
		    //if(d._children)
		      //return clCircle(d._children[0].size);
		  })
		  .style("fill", function(d){
		    var color;
		    switch(d.name){
		      case "ind1":
		        color = "#883630";
		        break;
		      case "ind3":
		        color = "#333333";
		        break;
		      case "ind4":
		        color = "#31A354";
		        break;
		    }

		    return color;
		  })
		  .style("stroke", function(d){
		    var color;
		    switch(d.name){
		      case "ind1":
		        color = d3.rgb("#883630").darker();
		        break;
		      case "ind3":
		        color = d3.rgb("#333333").darker();
		        break;
		      case "ind4":
		        color = d3.rgb("#31A354").darker();
		        break;
		    }

		    return color;
		  });

		nodeExit.select("text");

		var link = dendrogramViz.selectAll(".link")
		  .data(links);

		link.enter().insert("path", "g")
		  .attr("class", "link")
		  .attr("d", function(d){
		    var o = {
		      x: source.x0,
		      y: source.y0
		    };

		    return diagonal({
		      source: o,
		      target: o
		    });
		  });

		link.transition()
		  .duration(1000)
		  .attr("d", diagonal);

		link.exit().transition()
		  .duration(1000)
		  .attr("d", function(d){
		    var o = {
		      x: source.x,
		      y: source.y
		    };

		    return diagonal({
		      source: o,
		      target: o
		    });
		  })
		  .remove();

		nodes.forEach(function(d){
		  d.x0 = d.x;
		  d.y0 = d.y;
		});
	}

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


	/*var force = d3.layout.force()
	//.charge(-420)
	//.linkDistance(10)
	.size([diameter, diameter]);*/



	/*var node = dendrogramViz.selectAll(".node")
	.data(nodes)
	.enter()*/

	//.attr("transform", "translate(" + -diameter / 2 + "," + -diameter / 2 + ")");



	/*force.nodes(nodes)
	.links(links)
	.on("tick", tick)
	.start();

	function tick(){
	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node.attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	}

	function tick(){
	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node.attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	}*/
}