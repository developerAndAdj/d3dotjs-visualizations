// Common definitions
// Arrays to hold indicator info for determining min, max and avg
var ind1 = [], //childLabor
  ind3 = [], //poverty
  ind5 = [], //attendance
  //grossEnroled = [],
  ind7 = [], //gdp
  ind4 = []; //primaryComp
  
// Color scale for Child Labour statistics for globe
var colorCL, colorNA, colorPov, colorPc;
jQuery(document).ready(function() {
	// Hide popups
	jQuery("#arcVis").on("mouseout", function(){
		jQuery("#arcVisPopup").hide();
	});

	jQuery("#dendrogramViz, #fullStreamViz").on("mouseout", function(){
		jQuery("#correlationPopup").hide();
	});

	jQuery("#chordViz").on("mouseout", function(){
		jQuery("#chordVizPopup").hide();
	});

	jQuery("#stackedBarViz").on("mouseout", function(){
		jQuery("#popBarPopup").hide();
	});
});

/********************************************************
 * detectBoundaries Function
 * Determines if the tooltip will display past the edge
 *     of the current browser window
 ********************************************************/
function detectBoundaries(tipBounds, elem){
	tipBounds.left = (tipBounds.left + jQuery(elem).width()) > window.innerWidth ? tipBounds.left - jQuery(elem).width() - 30 : tipBounds.left;
	tipBounds.left = (tipBounds.left - jQuery(elem).width()) < 0 ? jQuery(elem).width() : tipBounds.left;

	tipBounds.top = (tipBounds.top + jQuery(elem).height()) > window.innerHeight ? tipBounds.top - jQuery(elem).height() + 10 : tipBounds.top;
	tipBounds.top = tipBounds.top < 0 ? jQuery(elem).height() : tipBounds.top;

	return tipBounds;
}

// Load json data and call viz functions
d3.json(template_url+"/js/data/data-teams.json", function(data){
	// Populate array with all non-null indicator stats
	for(i = 0; i < data.length; i++){
		if(data[i]['ind1']['value'] !== null){
		  ind1.push(data[i]['ind1']['value']);            
		}

		/*var filteredPov = [];
		if(data[i].ind3.children){
		  data[i].ind3.children.forEach(function(d, i){
		    if(d.value != null){
		      filteredPov.push(d.value);
		    }
		  })
		}
		console.log(filteredPov.length);*/

		//if(data[i]['ind3']['values']['2005-2010'] !== null){
		if(data[i]['ind3']['value'] !== null){  
		  //ind3.push(data[i]['ind3']['value']['2005-2010']);
		  ind3.push(data[i]['ind3']['value']);
		}

		if(data[i]['ind5']['value'] !== null){
		  ind5.push(data[i]['ind5']['value']);
		}

		/*if(data[i]['grossEnrolment']['values']["2005-2010"] !== null){
		  grossEnroled.push(data[i]['grossEnrolment']['values']["2005-2010"]);
		}*/

		/*if(data[i]['ind7']['values']['2005-2010'] !== null){
		  ind7.push(data[i]['ind7']['values']['2005-2010']);
		}*/
		if(data[i]['ind7']['value'] !== null){
		  ind7.push(data[i]['ind7']['value']);
		}

		if(data[i]['ind4']['value'] !== null){
		  ind4.push(data[i]['ind4']['value']);
		}
	}

	colorCL = d3.scale.linear().domain(d3.extent(ind1)).range(['#fca6a1', '#5A0903']);//'#c2362e']);//'#FFCDCD', '#CF0000']); //was #FF0303
	colorNA = d3.scale.linear().domain(d3.extent(ind5)).range(['#83d1fa', '#1C6287']);//'#EAE859', '#06C9C9']);//'#83d1fa', '#1C6287']);//'#fff', '#fff']);//'#ccff99', '#00FF00']);
	colorPov = d3.scale.linear().domain(d3.extent(ind3)).range(['#ffff99', '#948500']); // '#c6c6c6', '#333333' '#996b68', '#5A0903'
	colorPc = d3.scale.linear().domain(d3.extent(ind4)).range(['#c6c6c6', '#333333']);//['#ccff99', '#006600']);/*#c6c6c6', '#333333']);*/

	drawArc(data);
	drawDendrogramNoChild(data);
	drawDendrogramWithChild(data);
	drawStreamGraph(data);
	drawChordDiagram(data);
	drawStackedBar(data);
});