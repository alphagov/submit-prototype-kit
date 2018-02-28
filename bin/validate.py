#!/usr/bin/env python3

import os
import sys
import json
import argparse
import jsonschema

def validate(datafile, schemafile):
    data = json.load(open(datafile))
    schema = json.load(open(schemafile))

    jsonschema.validate(data, schema)

parser = argparse.ArgumentParser(description='Validate the JSON for a form.')
parser.add_argument('datafile', metavar='F', help='JSON file to validate')
parser.add_argument('schemafile', metavar='S', help='Schema file to validate against')

args = parser.parse_args()
datafile = args.datafile
schemafile = args.schemafile

if (not os.path.isfile(datafile)):
    print("{} does not exist".format(datafile), file=sys.stderr)
    exit(1)

if (not os.path.isfile(schemafile)):
    print("{} does not exist".format(schemafile), file=sys.stderr)
    exit(1)

validate(datafile, schemafile)
