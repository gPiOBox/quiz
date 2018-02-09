from gpiozero import Button

# Team A
Btn1 = Button(4,pull_up=False)
Btn2 = Button(14,pull_up=False)
Btn3 = Button(15,pull_up=False)
Btn4 = Button(25,pull_up=False)

# Team B
Btn5 = Button(11,pull_up=False)
Btn6 = Button(8,pull_up=False)
Btn7 = Button(7,pull_up=False)
Btn8 = Button(21,pull_up=False)

output = 0;

while True:
    if Btn1.is_pressed:
        output = 1;
        break;
    elif Btn2.is_pressed:
        output = 2;
        break;
    elif Btn3.is_pressed:
        output = 3;
        break;
    elif Btn4.is_pressed:
        output = 4;
        break;
    elif Btn5.is_pressed:
        output = 5;
        break;
    elif Btn6.is_pressed:
        output = 6;
        break;
    elif Btn7.is_pressed:
        output = 7;
        break;
    elif Btn8.is_pressed:
        output = 8;
        break;
    
print output;