#!/usr/bin/env python3

import json

class Graph:
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

    def paths(self, node):

        def dfs(path, paths=[]):
            node = path[-1]
            if node in self.graph:
                for val in self.graph[node]:
                    new_path = path + [val]
                    paths = dfs(new_path, paths)
            else:
                paths += [path]
            return paths

        return dfs([node])


graph = Graph()
graph.load('examples/apply-for-a-medal.json')

if (graph.cyclic()):
    print("Cycle detected:", graph.cycle)
    exit(1)

print(graph.paths('index'))
