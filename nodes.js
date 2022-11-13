var nodes = [
    {
        name: "Arda",
        group: 0,
        level: 1,
    },
    {
        name: "Kyle",
        group: 0,
        level: 1,
    },
    {
        name: "Rachelle",
        group: 0,
        level: 1,
    },
    {
        name: "Chris",
        group: 0,
        level: 1,
    },
    {
        name: "Derek",
        group: 0,
        level: 1,
    },
    {
        name: "Ryan",
        group: 0,
        level: 1,
    },
    {
        name: "Mahesh",
        group: 0,
        level: 1,
    },
    {
        name: "Rochelle",
        group: 0,
        level: 1,
    },
    {
        name: "Annie",
        group: 0,
        level: 1,
    },
    {
        name: "Ann",
        group: 0,
        level: 1,
    },
    {
        name: "Vi",
        group: 0,
        level: 1,
    },
    {
        name: "Kiara",
        group: 0,
        level: 1,
    },
    {
        name: "Grace",
        group: 0,
        level: 1,
    },
];

var links = [
    {
        target: "Arda",
        source: "Kyle",
        strength: 1,
    },
    {
        target: "Rachelle",
        source: "Chris",
        strength: 0.9,
    },
    {
        target: "Rachelle",
        source: "Kyle",
        strength: 0.5,
    },
    {
        target: "Chris",
        source: "Kyle",
        strength: 0.6,
    },
    {
        target: "Chris",
        source: "Rochelle",
        strength: 0.7,
    },
    {
        target: "Rachelle",
        source: "Rochelle",
        strength: 0.9,
    },
    {
        target: "Derek",
        source: "Rochelle",
        strength: 1.1,
    },
    {
        target: "Derek",
        source: "Ryan",
        strength: 0.7,
    },
    {
        target: "Mahesh",
        source: "Ryan",
        strength: 0.4,
    },
    {
        target: "Mahesh",
        source: "Derek",
        strength: 0.7,
    },
    {
        target: "Arda",
        source: "Grace",
        strength: 1,
    },
    {
        target: "Arda",
        source: "Ann",
        strength: 0.9,
    },
    {
        target: "Arda",
        source: "Annie",
        strength: 0.8,
    },
    {
        target: "Arda",
        source: "Vi",
        strength: 0.8,
    },
    {
        target: "Arda",
        source: "Kiara",
        strength: 0.4,
    },
    {
        target: "Grace",
        source: "Ann",
        strength: 1,
    },
    {
        target: "Grace",
        source: "Annie",
        strength: 0.4,
    },
    {
        target: "Grace",
        source: "Vi",
        strength: 0.6,
    },
    {
        target: "Grace",
        source: "Kiara",
        strength: 0.3,
    },
    {
        target: "Kiara",
        source: "Ann",
        strength: 1,
    },
    {
        target: "Kiara",
        source: "Annie",
        strength: 1,
    },
    {
        target: "Kiara",
        source: "Vi",
        strength: 0.8,
    },
];


let selected = null
$("#person-panel").hide()
$("#friend_search").on("input", ()=>{
    getSearchResults()
})
$("#add-friend-from-graph").on("click" , ()=>{
    if (selected != null) {

        addFriend(user1, selected.name).then(() => {
            addFriendButtons()
            auth()
        })
        console.log("added "+ selected.name + " as friend to " + user1);
        $("#add-friend-from-graph").prop("disabled", true)
        $("#add-friend-from-graph").text("Already Friends")
    }
})

function centerUser() {
  nodeElements.attr("cx", function (node) {
      if (node.name == user1) {
          return width / 2;
      }
      return node.x;
  });
  nodeElements.attr("cy", function (node) {
      if (node.name == user1) {
          return height / 2;
      }
      return node.y;
  });
}

function genGraphData() {

}

function getNeighbors(node) {
    return links.reduce(
        function (neighbors, link) {
            if (link.target.name === node.name) {
                neighbors.push(link.source.name);
            } else if (link.source.name === node.name) {
                neighbors.push(link.target.name);
            }
            return neighbors;
        },
        [node.name]
    );
}

function isNeighborLink(node, link) {
    return link.target.name === node.name || link.source.name === node.name;
}

function getNodeColor(node, neighbors) {
    // neighbors of the node will have the node as their neighbor, make it green
    if (Array.isArray(neighbors) && neighbors.indexOf(node.name) > -1) {
        return "hsl(40, 90%, 70%)";
    }
    // not a neighbor, make it gray
    return "#f64f59";
}

function getLinkColor(node, link) {
    return isNeighborLink(node, link) ? "green" : "#E5E5E5";
}

function getTextColor(node, neighbors) {
    return Array.isArray(neighbors) && neighbors.indexOf(node.name) > -1
        ? "green"
        : "black";
}

var svg = d3.select("svg");
svg.attr("width", "100%").attr("height", "100%");

let height = window.innerHeight;
let width = window.innerWidth;

// let user1 = "";
// simulation setup with all forces
var linkForce = d3
    .forceLink()
    .id(function (link) {
        return link.name;
    })
    .strength(function (link) {
        return link.strength;
    });

var simulation = d3
    .forceSimulation()
    .force("link", linkForce)
    .force("charge", d3.forceManyBody().strength(-220))
    .force("center", d3.forceCenter(width / 2, height / 2));

var dragDrop = d3
    .drag()
    .on("start", function (node) {
        if (user1 == node.name) {
            node.fx = width / 2;
            node.fy = height / 2;
        } else {
            node.fx = node.x;
            node.fy = node.y;
        }
    })
    .on("drag", function (node) {
        simulation.alphaTarget(0.7).restart();
        if (user1 == node.name) {
            node.fx = width / 2;
            node.fy = height / 2;
        } else {

            node.fx = d3.event.x;
            node.fy = d3.event.y;
        }
    })
    .on("end", function (node) {
        if (!d3.event.active) {
            simulation.alphaTarget(0);
        }
        node.fx = null;
        node.fy = null;
    });

function selectNode(selectedNode) {
    var neighbors = getNeighbors(selectedNode);

    // we modify the styles to highlight selected nodes
    nodeElements.attr("fill", function (node) {
        return getNodeColor(node, neighbors);
    });
    textElements.attr("fill", function (node) {
        return getTextColor(node, neighbors);
    });
    linkElements.attr("stroke", function (link) {
        return getLinkColor(selectedNode, link);
    });
    simulation.force("link").links(links);
    $("#panel-person-name").text(selectedNode.name)

    getFriends(user1).then((e) => {
        let alreadyFriends = e.indexOf(selectedNode.name) != -1;
        if (alreadyFriends) {
            
            $("#add-friend-from-graph").prop("disabled", true)
            $("#add-friend-from-graph").text("Already Friends")
        } else {
            $("#add-friend-from-graph").prop("disabled", false)
            $("#add-friend-from-graph").text("Add Friend")

        }
        $("#person-panel").show()
        
    })
    selected = selectedNode;
    //$("#add-friend-from-graph")
}

var linkElements = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 1)
    .attr("stroke", "rgba(50, 50, 50, 0.2)");

var textElements = svg
    .append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text(function (node) {
        return node.name;
    })
    .attr("font-size", 15)
    .attr("dx", 15)
    .attr("dy", 4);

var nodeElements = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("image")
    .data(nodes)
    .enter()

    // node is a circle
    .append("circle")
    .attr("r", 10)
    .attr("fill", getNodeColor)

    .call(dragDrop)

    .on("click", selectNode)

    // make the node the mouse hovers over larger
    .on("mouseenter", function () {
        // neighbors = getNeighbors(d3.select(this))
        d3.select(this).transition().attr("r", 15)//.attr("fill", getNodeColor);
    })

    // set back
    .on("mouseleave", function () {
        // neighbors = getNeighbors(d3.select(this))

        d3.select(this).transition().attr("r", 10)//.attr("fill", getNodeColor);
    });

simulation.nodes(nodes).on("tick", () => {
    nodeElements
        .attr("cx", function (node) {
            if (node.name == user1)
                return width / 2;
            return node.x;
        })
        .attr("cy", function (node) {
            if (node.name == user1)
                return height / 2;
            return node.y;
        });
    textElements
        .attr("x", function (node) {
            if (node.name == user1)
                return width / 2;
            return node.x;
        })
        .attr("y", function (node) {
            if (node.name == user1)
                return height / 2;
            return node.y;
        });
    linkElements
        .attr("x1", function (link) {
            if (link.source.name == user1)
                return width / 2;
            return link.source.x;
        })
        .attr("y1", function (link) {
            if (link.source.name == user1)
                return height / 2;
            return link.source.y;
        })
        .attr("x2", function (link) {
            if (link.target.name == user1)
                return width / 2;
            return link.target.x;
        })
        .attr("y2", function (link) {
            if (link.target.name == user1)
                return height / 2;
            return link.target.y;
        });
});

simulation.force("link").links(links);

