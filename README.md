# Quiz

**This project is a “Work In Progress”. As it develops we will add more content. Feel free to make suggestions using the comments section at the foot of the page.**  

## Overview

This project is about building a fully functional quiz game, complete with buttons for players, lights showing the current status, and a scoring system. The game will also query an online database to provide a large number of questions that can be asked during the course of the game. A block diagram showing the seperate elements of the game is shown below.

## [![Block Diagram of Quiz](https://www.gpio.co.uk/wp-content/uploads/2017/10/Quiz-Block-Diagram3-300x296.png)](https://www.gpio.co.uk/wp-content/uploads/2017/10/Quiz-Block-Diagram3.png)

## Quiz Sequence

The Quiz has two teams each of four competitors and a ninth person acting as Question Master. Each competitor has a button to press and a light in front of them. Each team also has a bell to indicate a button has been pressed and a large illuminated sign showing the team name. Additionally, two large panels show the team scores.

When the game starts all of the individual lights i.e. competitor and team lights are on, making a total of 10 lit lamps. The easiest way to understand how the game operates is go through the slides in the User Interface section that follows.

## <span id="User_Interface">User Interface</span>

The game is controlled by a screen for use by the Question Master, who is likely to be non technical. A key requirement then is that the system must manage all of the various elements: lighting, scoring etc. All the Question Master should have to do is read the question, wait for the answer and then use the ✓ and ✘ buttons (Ideally the screen will be on a touch sensitive device so that s/he can just touch the buttons). The game should then automatically calculate the scores and control the scoring and lighting subsystems.

In addition, it is inevitable that at some point the Question Master will press the wrong button, so an ‘Undo’ function needs to be incorporated.

## Lighting System

![Combined switch & lamp](https://www.gpio.co.uk/wp-content/uploads/2017/10/gPiO_SwitchLamp-150x150.jpg)

The lighting system shows what is happening as each question is asked and answered. It controls 12 output signals (2 x 4 individual lights + 2 team lights + 2 bells). It also has to  handle 8 input push buttons.

To reduce the number of physical boxes, each player’s lamp and button is combined into one unit.

The arrangement is shown below. A cable connects a Raspberry Pi to a PiDapter (a device for splitting the GPIO outputs from the RPi), two ribbon cables then extend from the PiDapter to two gPiO boxes. ThePidapter, Raspberry Pi, and Arduino are contained in the Question Master’s console.

[![Quiz - Block Diagram](https://www.gpio.co.uk/wp-content/uploads/2017/10/Quiz-Block-Diagram-248x300.png)](https://www.gpio.co.uk/wp-content/uploads/2017/10/Quiz-Block-Diagram.png)

## Scoring System

[![Image of 7 segment display](https://www.gpio.co.uk/wp-content/uploads/2017/10/Large-7-segment-LED-150x150.jpg)](https://www.gpio.co.uk/wp-content/uploads/2017/10/Large-7-segment-LED.jpg)The scoring system is described in the Quiz Sequence and User Interface sections above. The scores are presented to the players and to the audience using large 250mm high 7 segment displays. These displays are driven by an Arduino controller. Two sets of code need to be written; for the Arduino to control the 7 segment displays, and for the Raspberry Pi to transmit score codes to the Arduino.

## Question Database

[![Open Trivia database screenshot](https://www.gpio.co.uk/wp-content/uploads/2017/10/opentriviadb-300x155.png)](https://www.gpio.co.uk/wp-content/uploads/2017/10/opentriviadb.png)The initial intention is to use the open trivia database which is an open source, free to use, database of trivia questions. To quote: ” The Open Trivia Database provides a completely free JSON API for use in programming projects. Use of this API does not require a API Key, just generate the URL below use it in your own application to retrieve trivia questions.”


## Code

The programming languages used to create the code for the Quiz project include Python, Javascript, C++ and others. Unlike other projects on this site, the code required for the project really needs to be managed in a version control system. We have added everything required as a Github repository. Feel free to use and/or fork the code.
