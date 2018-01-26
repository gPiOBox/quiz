#!/usr/bin/python

import sys

args = sys.argv;

output = [];

starter = [1, 1, 1, 1, 1, 1, 1, 1];
teamA = [0, 0, 0, 0, 1, 1, 1, 1];
teamB = [1, 1, 1, 1, 0, 0, 0, 0];


def render():
    # LED STUFF   
    return true;

if (len(args) == 1):
    output = starter;
elif (len(args) == 2):
    output = starter;
    output[args[1]] = 0;
elif (len(args) == 3):
    if (args[2] == 0):
        output = teamA;
    elif (args[2] == 1);
        output = teamB;
    else:
        output = starter;
        output[args[1]] = 0;

success = render();
if(success):
    print str(output);
else:
    print "ERROR:Unable to render";