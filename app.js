var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();
    server = app.listen(8000),
    socketio = require('socket.io'),
    io = socketio.listen(server),
    mongoose = require('mongoose'),
    path = require('path'),
    url = 'mongodb://localhost/chat';


mongoose.connect(url);



////////////////////mongoose\\\\\\\\\\\\\\\\\\\\\\\\\\\

var schemaChat = new mongoose.Schema({
    name:{
        type: String
    },
    text:{
        type: String,
    }
});


var Chat = mongoose.model('Chat', schemaChat); 
///////////////////////ejs\\\\\\\\\\\\\

var engine = require('ejs-locals');
app.engine('ejs', engine);

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


app.use(express.static(__dirname+'/static'));

////////////////////////////////\\\\\\\\\\\\\\\\\\

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function(req,res){
    res.render('index');
});

app.get('/messages', function(req, res){
    Chat.find({}, function(err, message){
            if(err) console.log(err);
            res.json(message);
    });
});

app.post('/messages', function(req, res){
    var message = req.body;

    var c = new Chat({
        name: message.name,
        text: message.text
    }).save(function(err){
        console.log("message inserted");
    });

    //messages.push(message);
    Chat.find({}, function(err, message){
        if(err) console.log(err);
        res.json(message);
    });
    
});

app.get('/socket', function(req,res){
    res.render('socket');
});

io.on('connection', function(client){

    Chat.find({}, function(err, msg){
        if(err) console.log(err);
        client.emit('chat history', msg);
    });

    client.on('disconnected', function(){
        console.log('Client disconnected');
    });

    client.on('chat message', function(msg){

        var c = new Chat({
            name: msg.name,
            text: msg.text
            }).save(function(err){
                console.log("message inserted");
                Chat.find({}, function(err, msg){
                    if(err) console.log(err);
                    console.log(msg);
                    io.sockets.emit('chat history', msg);
            });
        });
    });
});
