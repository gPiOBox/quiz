#!/usr/bin/python

import sys

from gpiozero import LED

args = sys.argv;

output = [];

# Team A
LED1 = LED(17);
LED2 = LED(18);
LED3 = LED(27);
LED4 = LED(22);

# Team B
LED5 = LED(17);
LED6 = LED(18);
LED7 = LED(27);
LED8 = LED(22);

lights = [LED1, LED2, LED3, LED4, LED5, LED6, LED7, LED8];

starter = [1, 1, 1, 1, 1, 1, 1, 1];
teamA = [0, 0, 0, 0, 1, 1, 1, 1];
teamB = [1, 1, 1, 1, 0, 0, 0, 0];


def render():
    for i in range(0, 8):
        if(output[i] == 0):
            lights[i].off();
        else
            lights[i].on();
    
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