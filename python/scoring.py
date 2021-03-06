#!/usr/bin/python

# FETCH CMD ARGUMENTS
import sys, json, serial
args = sys.argv;

# DEFINE VARIABLES
answer_state = "";
answer_team = int(0);
game_state = int(0);
score = [int(0), int(0)];

# CALCULATE SCORE
def calculate():
    if (game_state == 0):
        if(answer_state == 'correct'):
            score[answer_team] = int(score[answer_team]) + int(1);
        else:
            score[answer_team] = int(score[answer_team]) - int(1);
    elif (game_state == 1):
        if(answer_state == 'correct'):
            score[answer_team] = score[answer_team] + 1;
        else:
            score[answer_team] = score[answer_team];
            
    render();
    print json.dumps(score);

def render():
    
    output_str = "";
    
    serPort = serial.Serial("/dev/ttyACM0", 115200, timeout=1); # open serial port
    
    score_a = list(str(score[0]));
    score_b = list(str(score[1]));
    
    output = [" ", " ", " ", " "];
    
    i=0;
    for i in range(0,3):
        
        if(len(score_a) == 1):
            output[0] = score_a[0];
        elif (len(score_a) == 2):
            output[0] = score_a[0];
            output[1] = score_a[1];
        #elif (len(score_a) == 3):
        #    output[0] = score_a[0];
        #    output[1] = score_a[1];
        #    output[2] = score_a[2];
        
        if(len(score_b) == 1):
            output[2] = score_b[0];
        elif (len(score_b) == 2):
            output[2] = score_b[0];
            output[3] = score_b[1];
        #elif (len(score_b) == 3):
        #    output[3] = score_b[0];
        #    output[4] = score_b[1];
        #    output[5] = score_b[2];
    
    for j in range(0,4):
        output_str = output_str + str(output[j]);
    
    #print(output_str);
    serPort.write(str.encode(str(output_str)));
    serPort.close();
    
# ON RUN
if (len(args) == 6):
    answer_state = args[1];
    answer_team = int(args[2]);
    game_state = int(args[3]);
    score = [int(args[4]), int(args[5])];
    calculate();
    
elif (len(args) == 4):
    answer_state = args[1];
    answer_team = int(args[2]);
    game_state = args[3];
    calculate();
    
elif (len(args) == 3):
    answer_state = args[1];
    answer_team  = int(args[2]);
    game_state = int(0);
    calculate();
    
else:
    print('ERROR: Incorrect arguments');
    
    