import { Injectable } from '@nestjs/common';
import { graph } from './graph';

@Injectable()
export class PathingService {
  findShortestPath = (startNode, endNode) => {
    // track distances from the start node using a hash object
    let distances = {};
    distances[endNode] = 'Infinity';
    distances = Object.assign(distances, graph[startNode]); // track paths using a hash object
    const parents = { endNode: null };
    for (const child in graph[startNode]) {
      parents[child] = startNode;
    }

    // collect visited nodes
    const visited = []; // find the nearest node
    let node = this.shortestDistanceNode(distances, visited);

    // for that node:
    while (node) {
      // find its distance from the start node & its child nodes
      const distance = distances[node];
      const children = graph[node];

      // for each of those child nodes:
      for (const child in children) {
        // make sure each child node is not the start node
        if (String(child) === String(startNode)) {
          continue;
        } else {
          // save the distance from the start node to the child node
          const newdistance = distance + children[child]; // if there's no recorded distance from the start node to the child node in the distances object
          // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
          if (!distances[child] || distances[child] > newdistance) {
            // save the distance to the object
            distances[child] = newdistance;
            // record the path
            parents[child] = node;
          }
        }
      }
      // move the current node to the visited set
      visited.push(node); // move to the nearest neighbor node
      node = this.shortestDistanceNode(distances, visited);
    }

    // using the stored paths from start node to end node
    // record the shortest path
    const shortestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
      shortestPath.push(parent);
      parent = parents[parent];
    }
    shortestPath.reverse();

    //this is the shortest path
    const results = {
      distance: distances[endNode],
      path: shortestPath,
      actions: null
    };
    // implement function to make path into movement
    results.actions = this.createActions(results.path)

    // return the shortest path & the end node's distance from the start node
    return results;
  };

  shortestDistanceNode(distances, visited) {
    // create a default value for shortest
    let shortest = null;

    // for each node in the distances object
    for (const node in distances) {
      // if no node has been assigned to shortest yet
      // or if the current node's distance is smaller than the current shortest
      const currentIsShortest =
        shortest === null || distances[node] < distances[shortest];

      // and if the current node is in the unvisited set
      if (currentIsShortest && !visited.includes(node)) {
        // update shortest to be the current node
        shortest = node;
      }
    }
    return shortest;
  };

  createActions(path) {
    // TODO implement function that creates actions out of path
    var previousMove = null;
    var currentRotation = 0
    let direction = "N";
    var actions = [];
    for (var i = 0; i < path.length; i++) {
      console.log(path[i])
      if (previousMove === null) {
        console.log("prev is null so this is the start")
      } else if (path[i][0] === previousMove[0]) {
        console.log("prev is same letter")
        if (parseInt(path[i].substring(1)) < parseInt(previousMove.substring(1))) {
          console.log("Need to go up")
          actions = this.calculateTurn(currentRotation, 0, actions)
          currentRotation = 0;
        } else {
          console.log("Need to go down")
          actions = this.calculateTurn(currentRotation, 2, actions)
          currentRotation = 2;

        }
      } else {
        console.log("prev is different letter")
        if (previousMove[0] === String.fromCharCode(path[i][0].charCodeAt(0) + 1)) {
          console.log("Need to go left")
          actions = this.calculateTurn(currentRotation, 3, actions)
          currentRotation = 3;
        } else if (previousMove[0] === String.fromCharCode(path[i][0].charCodeAt(0) - 1)) {
          console.log("Need to go right")
          actions = this.calculateTurn(currentRotation, 1, actions)
          currentRotation = 1;
        }
      }
      previousMove = path[i];
    }
    console.log(actions)
  }

  calculateTurn(currentRotation, desiredRotation, actions) {
    var directions = [0, 1, 2, 3]
    var difference = desiredRotation - currentRotation
    var absDifference = Math.abs(difference)
    var negative = Math.sign(difference)

    if (difference === 0) {
    } else if (difference % 3 === 0 || difference % 3 === -0) {
      if (negative === -1) {
        actions.push("R")
      } else {
        actions.push("L")
      }
    } else {
      for (var i = 0; i < absDifference; i++) {
        if (negative === -1) {
          actions.push("L")
        } else {
          actions.push("R")
        }
      }
    }
    actions.push("F")
    return actions
  }

}
