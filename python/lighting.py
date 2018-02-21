#!/usr/bin/python

import sys,os

args = sys.argv;

output = [];

# Team A
LED1 = 17;
LED2 = 18;
LED3 = 27;
LED4 = 22;

# Team B
LED5 = 11;
LED6 = 12;
LED7 = 13;
LED8 = 19;

lights = [LED1, LED2, LED3, LED4, LED5, LED6, LED7, LED8];

starter = [1, 1, 1, 1, 1, 1, 1, 1];
teamA = [0, 0, 0, 0, 1, 1, 1, 1];
teamB = [1, 1, 1, 1, 0, 0, 0, 0];

def lightled(BCM_pin,status):
	os.system('gpio -g write '+str(BCM_pin)+' '+str(status) );

def render():
    try:
        for i in range(0, 8):
            if(output[i] == 0):
                lightled(lights[i],0);
            else:
                lightled(lights[i],1);
            return True;
    except:
        return False;

if (len(args) == 1):
    output = starter;
elif (len(args) == 2):
    output = starter;
    output[args[1]] = 0;
elif (len(args) == 3):
    if (args[2] == 0):
        output = teamA;
    elif (args[2] == 1):
        output = teamB;
    else:
        output = starter;
        output[int(args[1])] = 0;

success = render();
if(success):
    print str(output);
else:
    print "ERROR:Unable to render";
