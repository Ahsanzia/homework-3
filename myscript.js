var previousData;
var POLL_SPEED = 5000;

$( document ).ready(function() {
redditVis();
});


function runVis(data) {
  var formatted = formatRedditData(data,previousData);
  var c=0;
  
  
  jQuery.each(formatted, function() {
  if(c>3){c=0;}
      makedives(this.id,this.title,this.score,c,this.diff);
        c=c+2;

});

}


function redditVis() {
  setInterval(requestData,POLL_SPEED);
  requestData();
}


function requestData() {
  // our jsonp url, with a cache-busting query parameter
  d3.jsonp("https://www.reddit.com/.json?jsonp=runVis&noCache=" + Math.random());
}

function makedives(id,title,score,c,prev)
{
    var divname = "div"+id;
    var classofdiv='div'+c;
    c=c+1;
    var maketitle="<div class=text><b>"+id+"</b>-"+title+"</div>";
    $( ".dives" ).append(maketitle);
    var makediv="<div class='"+classofdiv+"' style='float:left;width:400px;' id=\"a"+divname+"\"></div>";
    classofdiv='div'+c;
    $( ".dives" ).append(makediv);
    var makediv="<div class='"+classofdiv+"' style='float:left;width:400px;' id=\"b"+divname+"\"></div>";
    $( ".dives" ).append(makediv);
    makecircle('a'+divname,'Score',200,score);
    makecircle('b'+divname,'Difference',200,prev);
    
}

    function makecircle(name,label,dia,val) {
        var rp1 = radialProgress(document.getElementById(name))
                .label(label)
                .diameter(dia)
                .value(val)
                .render();
  }
function formatRedditData(data) {
  // dig through reddit's data structure to get a flat list of stories
  var formatted = data.data.children.map(function(story) {
    return story.data;
  });
  // make a map of storyId -> previousData
  var previousDataById = (previousData || []).reduce(function(all,d) {
    all[d.id] = d;
    return all;
  },{});
  // for each present story, see if it has a previous value,
  // attach it and calculate the diff
  formatted.forEach(function(d) {
    d.previous = previousDataById[d.id];
    d.diff = 0;
    if(d.previous) {
      d.diff = d.score - d.previous.score;
    }
  });
  // our new data will be the previousData next time
  previousData = formatted;
  return formatted;
}

