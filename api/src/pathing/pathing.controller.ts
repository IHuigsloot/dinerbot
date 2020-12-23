import { Controller, Get, Param, Post } from '@nestjs/common';
import { PathingService } from './pathing.service';

@Controller('pathing')
export class PathingController {
  constructor(private pathingService: PathingService) {}

  @Post(':start/:end')
  create(@Param('start') start: string, @Param('end') end: string): string {
    const graph = {
      A3: { B3: 1.5 },
      A8: { B8: 1.0 },
      B2: { B3: 1.5, C2: 1.5 },
      B3: { B2: 1.5, B4: 1.5 },
      B4: { B3: 1.5, C4: 1.5 },
      B8: { A8: 1.0, C8: 1.5 },
      C2: { B2: 1.5, D2: 1.5 },
      C4: { B4: 1.5, D4: 1.5, C5: 1.5 },
      C5: { C4: 1.5, C6: 1.0 },
      C6: { C5: 1.0, C7: 1.0 },
      C7: { B6: 1.0, C8: 1.5 },
      C8: { C7: 1.5, C9: 1.5, B8: 1.5 },
      C9: { C8: 1.5, D9: 1.5 },
      D2: { C2: 1.5, D3: 1.5, E2: 1.5 },
      D3: { D2: 1.5, D4: 1.5 },
      D4: { C4: 1.5, D3: 1.5 },
      D9: { C9: 1.5, E9: 1.5 },
      E2: { D2: 1.5, F2: 1.0 },
      E6: { E7: 1.5, F6: 1.5 },
      E7: { E6: 1.5, E8: 1.0 },
      E8: { E7: 1.0, E9: 1.5 },
      E9: { D9: 1.5, F9: 1.5, E8: 1.5 },
      F2: { E2: 1.0, G2: 1.5 },
      F6: { E6: 1.5, G6: 1.0 },
      F9: { E9: 1.5, G9: 1.0 },
      G1: { G2: 1.5 },
      G2: { F2: 1.5, G1: 1.5, G3: 1.5 },
      G3: { G2: 1.5, H3: 1.5 },
      G6: { F6: 1.0, H6: 1.5 },
      G9: { F9: 1.0, H9: 1.5 },
      H3: { G3: 1.5, I3: 1.5, H4: 1.5 },
      H4: { H3: 1.5, H5: 1.0 },
      H5: { H4: 1.0, H6: 1.5 },
      H6: { H5: 1.5, H7: 1.5, G6: 1.5 },
      H7: { H6: 1.5, H8: 1.0 },
      H8: { H7: 1.0, H9: 1.5 },
      H9: { H8: 1.5, H10: 1.5, G9: 1.5 },
      H10: { H9: 1.5 },
      I3: { H3: 1.5, J3: 1.0 },
      J3: { I3: 1.0 },
    };

    // Function to find shortest distance to a node
    const shortestDistanceNode = (distances, visited) => {
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

    // Function to find shortest path
    const findShortestPath = (graph, startNode, endNode) => {
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
      let node = shortestDistanceNode(distances, visited);

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
        node = shortestDistanceNode(distances, visited);
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
      };
      // return the shortest path & the end node's distance from the start node
      return results;
    };

    console.log(findShortestPath(graph, start, end));

    // TODO create json struct with L, R, F out of the results
    return (
      'This will create a path with: ' +
      findShortestPath(graph, start, end).path
    );
  }
}
