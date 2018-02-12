#!/usr/bin/env python3

import os
import sys
import json
import argparse
from pprint import pprint

class FormGraph:
    graph = {}

    def load(self, path):
        """
            Graph of all possible journeys through the data
            
            This graph is a Dictionary with each pair following the form:

            {
                <String> page key in form.pages : <List> list of <String> page key in form.pages
            }

            The value list contains keys to all pages listed in form.pages[page].next
        """
        self.form = json.load(open(path))
        self.graph = {}
        for page in self.form['pages']:
            p = self.form['pages'][page]
            if 'next' in p:
                if type(p['next']) is str:
                    p['next'] = [{ 'page': p['next']}]

            self.graph[page] = [n['page'] for n in p.get('next', [])]

    def cyclic(self):
        """ Tests all paths for any containing multiple references to a single page """
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
        """
            List of unique paths through the data, each following the format:

            [
                [<String> page key in form.pages, <String> page key in form.pages, ...]
            ]
            
        """
        node = path[-1]
        if not self.graph[node]:
            return paths + [path]

        for vertex in self.graph[node]:
            paths = self.paths(path + [vertex], paths)
        return paths

    def links(self):
        """
            Dictionary of connections between pages containing entries following the form:
            
            <String> page key in form.pages + "," + page key in form.pages: <Integer> number of
                                                                            times this connection
                                                                            appears in individual
                                                                            journeys
        """
        links = {}
        paths = graph.paths()
        for path in paths:
            s = ''
            for vertex in path:
                if s: 
                    link = "%s,%s" % (s, vertex)
                    links[link] = links.get(link, 0) + 1
                s = vertex
        return links

parser = argparse.ArgumentParser(description='Lint the data for a form.')
parser.add_argument('datafile', metavar='F', help='JSON file containing the data')
parser.add_argument('--output', type=str, default='lint', help='Type of output',
                    choices=['lint', 'paths', 'links'])
args = parser.parse_args()

datafile = args.datafile
if (not os.path.isfile(datafile)):
    print("{} does not exist".format(datafile), file=sys.stderr)
    exit(1)

graph = FormGraph()
graph.load('{}'.format(args.datafile))

output = args.output
if (output == 'lint'):
    if (graph.cyclic()):
        print("Cycle detected:", graph.cycle, file=sys.stderr)
        exit(1)

if (output == 'paths'):
    print(json.dumps(graph.paths(), indent=4), file=sys.stdout)

if (output == 'links'):
    print(json.dumps(graph.links(), indent=4), file=sys.stdout)
