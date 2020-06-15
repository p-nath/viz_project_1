// load data and store it in a dictionary 
var column_wise_data = {}; // {'<feature_name1>': Array(6825), '<feature_name2>': Array(6825)...}
column_wise_data.Rating = [];
column_wise_data.Publisher = [];
column_wise_data.Developer = [];
column_wise_data.Platform = [];
column_wise_data.Genre = [];

column_wise_data.User_Score = [];
column_wise_data.Year_of_Release = [];
column_wise_data.NA_Sales = [];
column_wise_data.EU_Sales = [];
column_wise_data.JP_Sales = [];
column_wise_data.Other_Sales = [];
column_wise_data.Global_Sales = [];
column_wise_data.Critic_Score = [];
column_wise_data.Critic_Count = [];
column_wise_data.User_Count = [];

d3.csv("reduced_data.csv", function(error, data){ 
  // throw error
  if (error) {
    throw error;
  }
  data.forEach(function(d, i) {
    column_wise_data.Rating.push(d.Rating);
    column_wise_data.Publisher.push(d.Publisher);
    column_wise_data.Developer.push(d.Developer);
    column_wise_data.Platform.push(d.Platform);
    column_wise_data.Genre.push(d.Genre);
    column_wise_data.User_Score.push(d.User_Score);
    column_wise_data.Year_of_Release.push(d.Year_of_Release);
    column_wise_data.NA_Sales.push(d.NA_Sales);
    column_wise_data.EU_Sales.push(d.EU_Sales);
    column_wise_data.JP_Sales.push(d.JP_Sales);
    column_wise_data.Other_Sales.push(d.Other_Sales);
    column_wise_data.Global_Sales.push(d.Global_Sales);
    column_wise_data.Critic_Score.push(d.Critic_Score);
    column_wise_data.Critic_Count.push(d.Critic_Count);
    column_wise_data.User_Count.push(d.User_Count);
  });
  // console.log("1", column_wise_data);
});


function populateNavigationBar() {
  const margin = {top: 100, right: 50, bottom: 100, left: 50};
  var width = 600;
  var height = 400;

  var categorical = ['Rating', 'Genre', 'Platform',  'Publisher', 'Developer'];
  var numerical = ['User_Count', 'User_Score', 'Critic_Score', 'Critic_Count', 'Year_of_Release', 'NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales', 'Global_Sales'];

  d3.select("#nav")
    .select("#cat")
    .select("#cat_content")
    .selectAll("a")
    .data(categorical)
    .enter()
    .append("a")
    .attr("xlink:href", "#")
    .attr("id", function(d) { return d })
    // the function for onclick should look like plotBar(colum_wise_data.<feature_name>, <feature_name>)
    .attr("onclick", function(d) { return "plotBar(column_wise_data." + d + ",\"" + d + "\")"; }) 
    .text(function(d) { return d });

  var num_bins = 10; // number of bins, default = 10
  d3.select("#nav")
    .select("#num")
    .select("#num_content")
    .selectAll("a")
    .data(numerical)
    .enter()
    .append("a")
    .attr("xlink:href", "#")
    .attr("onclick", function(d) { return "plotHist(column_wise_data." + d + ",\"" + d + "\"," + num_bins+ ")"; })
    .text(function(d) { return d });

  // create a empty svg item with start instructions
  console.log("lets begin!");
  d3.select("#graph_plot").select("svg").remove();
  var svg = d3.select("#graph_plot")
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom);

  svg.append("rect")
      .attr("id", "display")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top)
      .attr("y", margin.right + 20)
      .attr("fill", "#f2f2f2");

  svg.append("text")
       .attr("transform", "translate(50,0)")
       .attr("x", width/2)
       .attr("y", margin.top/2) // x, y coordinate
       .attr("text-anchor", "middle")  
       .attr("font-size", "24px")
       .text("Select a feature from the dropdown navigation menu to get started!");
  d3.select("#graph_plot").attr("align","center");

}