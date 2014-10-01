$(document).ready(function() { 
    //login check
    if(campaign_owner_uid == uid){
        var width = 692;
        var height = 450;
        // console.log(width);
        // console.log(height);

        var svg = d3.select("#d3_diffusion_graph").append("svg").attr("width", width).attr("height", height);
        var force = d3.layout.force()
            .gravity(.05)
            .distance(150)
            .charge(-100).size([width, height]);;
        // define arrow markers for graph links
        svg.append('svg:defs').append('svg:marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 6)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
          .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#000');

        svg.append('svg:defs').append('svg:marker')
            .attr('id', 'start-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 4)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
          .append('svg:path')
            .attr('d', 'M10,-5L0,0L10,5')
            .attr('fill', '#000');

        $.ajax({ url: 'campaign_diffusion_data',
             cache: false,
             data: {"selected_campaign_id": cid},
             type: 'post',
             dataType: 'json',
             success: function(response) {
                if(response.status == 'Success' && response.nodes.length > 0){
                  // json = JSON.parse(response);
                  json = response;
                  // console.log(json);
                // d3.json(response, function(error, json) {
                  force
                      .nodes(json.nodes)
                      .links(json.links)
                      .start();
                  svg.append("clipPath").attr("id", "clipCircle")
                  .append("circle").attr("r", 12).attr("cx", 2).attr("cy", 2);
                  svg.append("clipPath").attr("id", "clipBigCircle")
                  .append("circle").attr("r", 24).attr("cx", 0).attr("cy", 00);
                  // var link = svg.selectAll(".link")
                  //     .data(json.links)
                  //   .enter().append("line")
                  //     .attr("class", "link");

                  // var node = svg.selectAll(".node")
                  //     .data(json.nodes)
                  //     .enter()
                  //     .append("g")
                  //     .attr("class", "node")
                  //     .call(force.drag);
                  var link = svg.append('svg:g').selectAll('.link').data(json.links).enter().append("path")
                      .attr("class", "link"),
                      node = svg.append('svg:g').selectAll('.node').data(json.nodes).enter().append("g")
                      .attr("class", "node")
                      .call(force.drag);
                  //console.log(node);
                  node.append("image")
                      .attr("class", "circle")
                      .attr("xlink:href", function(d){return d.pic;})
                      .attr("x", function(d){
                        if(d.origin == true){
                          return -24;
                        }
                        else{
                          return -10;
                        }
                      })
                      .attr("y", function(d){
                        if(d.origin == true){
                          return -24;
                        }
                        else{
                          return -10;
                        }
                      })
                      .attr("width", function(d){
                        if(d.origin == true){
                          return 48;
                        }
                        else{
                          return 25;
                        }
                      })
                      .attr("height", function(d){
                        if(d.origin == true){
                          return 48;
                        }
                        else{
                          return 25;
                        }
                      })
                      .attr("clip-path", function(d){
                        if(d.origin == true){
                          return "url(#clipBigCircle)";
                        }
                        else{
                          return "url(#clipCircle)";
                        }
                        
                      });

                  node.append("text")
                      .attr("dx", function(d){
                        if(d.origin == true){
                          return 36;
                        }
                        else{
                          return 12;
                        }
                      })
                      .attr("dy", ".35em")
                      .text(function(d) { return d.name });

                  force.on("tick", function() {
                    link.attr('d', function(d) {
                      var deltaX = d.target.x - d.source.x,
                          deltaY = d.target.y - d.source.y,
                          dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                          normX = deltaX / dist,
                          normY = deltaY / dist,
                          sourcePadding = d.left ? 17 : 12,
                          targetPadding = d.right ? 17 : 12,
                          sourceX = d.source.x + (sourcePadding * normX),
                          sourceY = d.source.y + (sourcePadding * normY),
                          targetX = d.target.x - (targetPadding * normX),
                          targetY = d.target.y - (targetPadding * normY);
                      return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
                    });

                    node.attr('transform', function(d) {
                      return 'translate(' + d.x + ',' + d.y + ')';
                    });
                    // link.attr("x1", function(d) { return d.source.x; })
                    //     .attr("y1", function(d) { return d.source.y; })
                    //     .attr("x2", function(d) { return d.target.x; })
                    //     .attr("y2", function(d) { return d.target.y; });

                    // node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                    });
                    // update existing links
                    link.style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
                      .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });
                }
                else{
                    $("#d3_diffusion_graph").html("** 無資料或資料等待更新中，請等待更新完成 **");
                }
             },
             error: function(data, status, e){
              //alert("ajax error:"+ e);
             }
        });

    }
});
