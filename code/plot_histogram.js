function plotHist(data, column_name, num_bins) {
  console.log("plotHist", column_name);
  const margin = {top: 100, right: 50, bottom: 100, left: 50};
  var width = 600;
  var height = 400;

  d3.select("#graph_plot").select("svg").remove(); // remove svg object if it exists
  // add a new svg object inside the graph_plot division
  var svg = d3.select("#graph_plot")
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom);
  // creating a grey rectangle for beauty
  svg.append("rect")
      .attr("id", "display")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top)
      .attr("y", margin.right + 20)
      .attr("fill", "#f2f2f2");
  // giving a heading for understandablity
  svg.append("text")
       .attr("transform", "translate(75,0)")
       .attr("x", width/2)
       .attr("y", margin.top/2) // x, y coordinate
       .attr("text-anchor", "middle")  
       .attr("font-size", "24px") 
       .attr("text-decoration", "underline") // underline
       .text("Histogram for Feature: " + column_name);
  // adding instruction for changing bin size
  svg.append("text")
       .attr("transform", "translate(75,0)")
       .attr("x", width/2)
       .attr("y", margin.top/2 + 14) // x, y coordinate
       .attr("text-anchor", "middle")  
       .attr("font-size", "12px")
       .text("Drag and release to change bin size: right to increase, left to decrease.");

  var max_val = d3.max(data); // get max value

  // defining x scale 
  var x_scale = d3.scaleLinear().domain([0, max_val]).range([0, width]);
  // drawing x axis
  svg.append("g")
      .attr("transform", `translate(${margin.right}, ${height + margin.top})`)
      .call(d3.axisBottom(x_scale));
  // naming x axis
  svg.append("text").attr("y", margin.top + height + margin.bottom/2).attr("x", width/2).attr("font-size", "18px").text(column_name);
  
  // setting up the histogram function with the required parameters
  var histogram = d3.histogram().value(function(d) { return d; })
      .domain(x_scale.domain()) 
  		.thresholds(x_scale.ticks(num_bins)); // specify the numbers of bins

  // apply the histogram function with the above parameters to divide the data into bins
  var bins = histogram(data);

  // defining the y scale
  var y_scale = d3.scaleLinear().range([height, 0]).domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  // drawing y axis
  svg.append("g")
      .call(d3.axisLeft(y_scale))
      .attr("transform", `translate(${margin.right}, ${margin.top})`);
  // naming y axis
  svg.append("text").attr("font-size", "14px") .attr("text-anchor", "middle").attr("transform", "translate(12, 120) rotate(-90)").text("Count");
  
  // I am using the tooltip script for version4 which a github user was kind enough to share
  // Reference: https://github.com/VACLab/d3-tip, local: /d3-tip-master/d3-tip.js
  var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-15, 0]);
  svg.call(tool_tip);

  var bin_mid_values = []; // to store the middle value of each bin
  bins.forEach(function(d) {
  	bin_mid_values.push((d.x1+d.x0)/2);
  });
  // console.log(bin_mid_values);

  // append the bar rectangles to the svg element
  svg.selectAll(".bar")
      .data(bins)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", function(d) { return x_scale(d.x1) - x_scale(d.x0) - 4; })
      .attr("height", function(d) { return height - y_scale(d.length); })
      .attr("x",  function(d) { return x_scale(d.x0) + margin.right + 2})
      .attr("y",  function(d) { return y_scale(d.length) + margin.top})
      .attr("fill", "#acbb21")
      .on("mouseover", function(d, i) {
      	// show the actual count and mid value of selected bin
        tool_tip.html(bins[i].length + ", mid: " + bin_mid_values[i]).show();
        d3.select(this).attr("fill", "red") // making it red to look like its been selected
        								// making it look like the selected bar's height and width increases
                       .attr("width", function(d) { return x_scale(d.x1) - x_scale(d.x0) + 2; })
                       .attr("height", function(d) { return height - y_scale(d.length) + 15; })
                       .attr("x",  function(d) { return x_scale(d.x0) + margin.right - 1})
                       .attr("y",  function(d) { return y_scale(d.length) + margin.top - 15});
      })
     .on("mouseout", function(d, i) {
        tool_tip.hide(); // hide tooltip
        d3.select(this).attr("fill", "#acbb21") // making color the same as before
        								// making height and width same as before mouseover event
                       .attr("width", function(d) { return x_scale(d.x1) - x_scale(d.x0) - 4; })
                       .attr("height", function(d) { return height - y_scale(d.length); })
                       .attr("x",  function(d) { return x_scale(d.x0) + margin.right + 2})
                       .attr("y",  function(d) { return y_scale(d.length) + margin.top});
     });

  // centre the created histogram
  d3.select("#graph_plot").attr("align","center");

  // increase and decrease bin size based in mousedrag left and right
  // logic - on mousedown define mouseover action, on mouseup make mousedown and mouseover do nothing
  // define what to do during mousedown event
  d3.select("#display").on("mousedown", function() {
		// get the current x coordinate of mouse
		var x_coordinate = d3.mouse(this)[0];
		// define what to do in case of mousemove and mouseup events when mousedown has happened
		d3.select(this)
			.on("mousemove", updateNumBins)
			.on("mouseup", function() {
				console.log("Bin size changed, plotting with new num_bins", num_bins);
				plotHist(data, column_name, num_bins);
				// set action for mousemove and mouseup as null 
				//so that till mousedown happens bin size will not change
				d3.select(this).on("mousemove", null).on("mouseup", null);
		 	});

			
		function updateNumBins() {
				// +5 and -5 is done so that the increase and decrease appears gradual 
				// mousemove left -> bin size decreases -> number of bins increases
		  	if(d3.mouse(this)[0] + 5 < x_coordinate && num_bins < 100){
		  		num_bins += 1; 
		  		console.log("Decrease in binsize, increase in number ->" + num_bins);
		  		x_coordinate = d3.mouse(this)[0];
		  	}
		  	// mousemove right -> bin size increases -> number of bins decreases
		    else if(d3.mouse(this)[0] - 5 > x_coordinate && num_bins > 2){
		  		num_bins -= 1;
		  		console.log("Increase in binsize, decrease in number ->" + num_bins);
		  		x_coordinate = d3.mouse(this)[0];
		  	}
		}
	}); 

}