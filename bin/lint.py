#!/usr/bin/env python3

import sys
import json
from pprint import pprint

class Graph:
    graph = {}

    def load(self, path):
        self.form = json.load(open(path))
        self.graph = {}
        for page in self.form['pages']:
            p = self.form['pages'][page]
            if 'next' in p:
                if type(p['next']) is str:
                    p['next'] = [{ 'page': p['next']}]

            self.graph[page] = [n['page'] for n in p.get('next', [])]

    def cyclic(self):
        """ test for cycles """
        self.cycle = []
        path = set()
        visited = set()

        def visit(vertex):
            if vertex in visited:
                return False
            visited.add(vertex)
            path.add(vertex)
            for neighbour in self.graph.get(vertex, ()):
                if neighbour in path or visit(neighbour):
                    self.cycle.insert(0, vertex)
                    return True
            path.remove(vertex)
            return False

        return any(visit(v) for v in self.graph)

    def paths(self, path=['index'], paths=[]):
        """ find paths from a point """
        node = path[-1]
        if not self.graph[node]:
            return paths + [path]

        for vertex in self.graph[node]:
            paths = self.paths(path + [vertex], paths)
        return paths


graph = Graph()
graph.load('examples/apply-for-a-medal.json')

if (graph.cyclic()):
    print("Cycle detected:", graph.cycle, file=sys.stderr)
    exit(1)

paths = graph.paths()
pprint(paths)
