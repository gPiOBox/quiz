var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var process = require('child_process');

var scoring_file = 'python/scoring.py';
var buttons_file = 'python/buttons.py';
var lighting_file = 'python/lighting.py';
var questions_file = 'python/api.py';


var question_data = [];
var question_curr = 0;

var score = [0,0];
var state = 2;


var init = false;

server.listen(8124);
app.get('/', function(req, res){
    res.sendFile(__dirname + '/static/index.html');
});

app.get('/test.html', function(req, res){
    res.sendFile(__dirname + '/static/index2.html');
});


app.get('/socket.io.js', function(req, res){
    res.sendFile(__dirname + '/static/socket.io.js');
});

app.get('/socket.io.js.map', function(req, res){
    res.sendFile(__dirname + '/static/socket.io.js.map');
});

app.get('/style.css', function(req, res){
    res.sendFile(__dirname + '/static/style.css');
});

app.get('/css/fontawesome-all.css', function(req, res){
    res.sendFile(__dirname + '/static/css/fontawesome-all.css');
});

app.get('/webfonts/fa-brands-400.eot', function(req, res){
    res.sendFile(__dirname + '/static/webfonts/fa-brands-400.eot');
});

app.get('/webfonts/fa-brands-400.woff2', function(req, res){
    res.sendFile(__dirname + '/static/webfonts/fa-brands-400.woff2');
});

app.get('/webfonts/fa-solid-900.woff', function(req, res){
    res.sendFile(__dirname + '/static/webfonts/fa-solid-900.woff');
});

app.get('/webfonts/fa-solid-900.woff2', function(req, res){
    res.sendFile(__dirname + '/static/webfonts/fa-solid-900.woff2');
});

app.get('/Nunito-Regular.ttf', function(req, res){
    res.sendFile(__dirname + '/static/fonts/Nunito-Regular.ttf');
});

app.get('/Nunito-Black.ttf', function(req, res){
    res.sendFile(__dirname + '/static/fonts/Nunito-Black.ttf');
});

app.get('/Nunito-Light.ttf', function(req, res){
    res.sendFile(__dirname + '/static/fonts/Nunito-Light.ttf');
});

app.get('/Nunito-Bold.ttf', function(req, res){
    res.sendFile(__dirname + '/static/fonts/Nunito-Bold.ttf');
});


app.get('/Nunito-SemiBold.ttf', function(req, res){
    res.sendFile(__dirname + '/static/fonts/Nunito-SemiBold.ttf');
});


io.on('connection', function(socket){
    socket.emit('status', 'connected');
    socket.on('test', function(data){
        console.log("TEST"); 
        socket.emit('test', 'Hello World!');
    });
    
    socket.on('question', function(data){
        if(typeof data != undefined){
            console.log('questions');
            switch (data) {
                case 'init':
                    getQuestions();
                case 'fetch':
                    sendQuestion(socket);

                    break;
                default:
                    socket.emit('questions', null);
                    socket.emit('error', 'Invalid Action');
                    break;
            }
        }
    });

    socket.on('scoring', function(data){
        if(typeof data != undefined){
            console.log('scoring');
            switch (data.answer) {
                case 'incorrect':
                    updateScore(socket, 'incorrect', data.status, data.team);
                    state = data.status;
                    break;
                case 'correct':
                    updateScore(socket, 'correct', data.status, data.team);
                    state = data.status;
                    break;
                case 'reset':
                    resetScore(socket);
                    break;
                case 'fetch':
                    socket.emit('score', score);
                    break;
                default:
                    //socket.emit('error', 'Invalid Action');
                    break;
            }

        }
    });
    
    socket.on('lighting', function(data){
        if(typeof data != undefined){
            console.log('questions');
            switch (data) {
                case 'update':
                    updateLights(socket, data.team, data.button);
                case 'reset':
                    resetLights(socket);

                    break;
                default:
                    socket.emit('lighting', null);
                    socket.emit('error', 'Invalid Action');
                    break;
            }
        }
    });

    socket.on('buttons', function(data){
        if(typeof data != undefined){
            console.log('questions');
            switch (data) {
                case 'listen':
                    waitForPress();
                default:
                    socket.emit('buttons', null);
                    socket.emit('error', 'Invalid Action');
                    break;
            }
        }
    });
    
    
    socket.on('control', function(data){
        if(typeof data != undefined){
            console.log('control');
            switch (data) {
                case '':

                case '':

                default:

            }

        }
    });
});


// Questions
function getQuestions(){
    var cmd = process.spawn("python", [questions_file]);

    cmd.stdout.on('data', function(output){
        console.log(output);
        question_data = JSON.parse(output);
    });   
}

function sendQuestion(socket){
    try {
        var cmd = process.spawn("python", [questions_file]);

        cmd.stdout.on('data', function(output){
            console.log(output);        
            question_data = JSON.parse(output);
            socket.emit('question', question_data['results'][0]);
            
        });
    } catch (err){
        getQuestions();
    }
}

// Scoring
function updateScore(socket, answer, status, team){
    //try {
    var cmd = process.spawn("python", [scoring_file, answer, team, status, score[0], score[1]]);

    cmd.stdout.on('data', function(output){
        score = JSON.parse(output);
        console.log(score);
        socket.emit('score', score);
    });
    //} catch (err) {
    //    socket.emit('error', 'Error in update score function');
    //    console.log("Error in update score function");
    //}
}

function resetScore(socket){
    var cmd = process.spawn("python", [scoring_file]);

    cmd.stdout.on('data', function(output){
        score = [0,0];
        socket.emit('score', score);
    }); 
}

// Lighting

function updateLights(socket, status, button_pressed){
    var cmd = process.spawn("python", [lighting_file, status, button_pressed]);

    cmd.stdout.on('data', function(output){
        console.log(output);
        socket.emit('lighting', output);
    }); 
}

function resetLights(socket, status){
    var cmd = process.spawn("python", [lighting_file, status]);

    cmd.stdout.on('data', function(output){
        console.log(output.toString());
        socket.emit('lighting', output.toString());
    }); 
}

// Buttons
function waitForPress(socket){
    var cmd = process.spawn("python", [buttons_file]);

    cmd.stdout.on('data', function(output){
        console.log(output);
        socket.emit('buttons', output.toString());
    }); 
}

// NOTE: Could move all game logic to backend - this would then only allow one instance

// TODO: Update the LED and Button GPIO binding values