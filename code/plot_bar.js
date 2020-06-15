function plotBar(column, column_name) {
  // console.log(column_name);
  const margin = {top: 100, right: 50, bottom: 100, left: 50};
  var width = 600;
  var height = 400;

  d3.select("#graph_plot").select("svg").remove();// remove svg object if it exists
  // add a new svg object inside the graph_plot division
  var svg = d3.select("#graph_plot")
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom);
  // creating a grey rectangle for beauty
  svg.append("rect")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
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
       .text("Bar Chart for Feature: " + column_name);

  // get the count of the unique feature values in form of a dictionary
  // data = [ {key:<unique_feature_value1}, value: <number_of_occurrences_of)unique_feature_value1}, ...]
  var data = d3.nest() // make it nested datastructure; array of dictionaries
              .key(function(d){ return d;}) // set grouping value
              .rollup(function(d){ return d3.sum(d, function(g) {return 1;});}) 
              // basically a group by function where we sum the occurrences of a unique entry
              .entries(column);
  // console.log(data);

  // get the keys in a singe array
  var x_labels = d3.map(data, function(d){ return(d.key) }).keys();
  // console.log(genres);

  // get the values in a single array
  var counts = data.map(function(d){ return d.value;});
  var max_val = d3.max(counts); // get max of the values
  // console.log(max_val);

  // defining x-scale and y-scale
  var x_scale = d3.scaleBand().domain(x_labels).range([0, width]).padding(0.04);
  var y_scale = d3.scaleLinear().domain([0, max_val]).range([height, 0]);

  // y-axis is drawn at 50, 0
  svg.append("g")
     .call(d3.axisLeft(y_scale))
     .attr("transform", `translate(${margin.right}, ${margin.top})`);
  // name the y axis
  svg.append("text").attr("font-size", "18px") .attr("text-anchor", "middle").attr("transform", "translate(70, 120) rotate(-90)").text("Count");
  
  // x_ axis is drawn at (50, 400 + 100)
  svg.append("g") 
      .attr("transform", `translate(${margin.right}, ${height + margin.top})`)
      .call(d3.axisBottom(x_scale))
      .selectAll("text") // the next part is to rotate the lables so that they do not overlap
      .attr("y", 0)
      .attr("x", 9) // space from the axis
      .attr("transform", "rotate(65)") // rotate the text by 90 degrees so that labels are readable
      .style("text-anchor", "start"); // fix alignement or the text goes into the graph
  // name x axis
  svg.append("text").attr("y", margin.top + height + margin.bottom - 20).attr("x", width/2).attr("font-size", "18px").text(column_name);
  
  // I am using the tooltip script for version4 which a github user was kind enough to share
  // Reference: https://github.com/VACLab/d3-tip
  var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-15, 0]);   
  svg.call(tool_tip);

  // for pretty aesthetic colors; the bars will be colored based on this; 
  // taller the bar the greener it will be and the shorter the bar the more yellow it would be
  var colors = d3.scaleLinear()
    .domain([0, max_val])
    .range(["yellow", "green"]);

  svg.selectAll(".bar")
     .data(data)
     .enter()
     .append("g")
     .append("rect")
     .attr("class", "bar")
     .attr("width", x_scale.bandwidth())
     .attr("height", function(d){ return height - y_scale(d.value); })
     .attr("x", function (d){ return x_scale(d.key) + margin.left; })
     .attr("y", function(d){ return y_scale(d.value) + margin.top; })
     .attr("fill", function(d){ return colors(d.value); })
     .on("mouseover", function(d, i) {
        tool_tip.html(counts[i]).show(); // show the actual count
        d3.select(this).attr("fill", "red") // make it red to look like its been selected
                      // increase height and width
                       .attr("width", function() { return x_scale.bandwidth() + 2 })
                       .attr("height", function(d) { return height - y_scale(d.value) + 15 })
                       .attr("x",  function(d) { return x_scale(d.key) + margin.left - 1})
                       .attr("y",  function(d) { return y_scale(d.value) + margin.top - 15});
      })
     .on("mouseout", function(d, i) {
        tool_tip.hide(); // hide tooltip
        d3.select(this).attr("fill", function(d){ return colors(d.value); }) // make color the same as before
                        // make height and width the same as before
                       .attr("width", x_scale.bandwidth())
                       .attr("height", function(d){ return height - y_scale(d.value); })
                       .attr("x", function (d){ return x_scale(d.key) + margin.left; })
                       .attr("y", function(d){ return y_scale(d.value) + margin.top; })
     });

  // centre the created bar_chart
  d3.select("#graph_plot").attr("align","center");
}