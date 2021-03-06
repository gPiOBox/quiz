#!/usr/bin/python

import sys,os,json

args = sys.argv;

output = [];

# Team A
LED1 = 17;
LED2 = 18;
LED3 = 27;
LED4 = 22;

# Team B
LED5 = 12;
LED6 = 13;
LED7 = 19;
LED8 = 16;

lights = [LED1, LED2, LED3, LED4, LED5, LED6, LED7, LED8];

starter = [1, 1, 1, 1, 1, 1, 1, 1];
teamA = [0, 0, 0, 0, 1, 1, 1, 1];
teamB = [1, 1, 1, 1, 0, 0, 0, 0];

def lightled(BCM_pin,status):
    os.system('gpio -g mode ' + str(BCM_pin) + ' out;')
    os.system('gpio -g write '+str(BCM_pin)+' '+str(status) + ";");
    #print(BCM_pin, status);

def render():
    try:
        i = 0;
        for i in range(0, 8):
            if(output[i] == 0):
                lightled(lights[i],0);
                #print(lights[i], "low");
            else:
                lightled(lights[i],1);
                #print(lights[i], "high");
        return True;
    except Exception as e:
        print(e);
        return False;

if (len(args) == 1):
    output = starter;
elif (len(args) == 2):
    output = starter;
    output[(int(args[1]) -1)] = 0;
elif (len(args) == 3):
    if (args[1] == 0):
        output = teamA;
    elif (args[1] == 1):
        output = teamB;
    else:
        output = starter;
        output[(int(args[2]) - 1)] = 0;

render();

print str(output);