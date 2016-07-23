  (function(){
        var nameButton = document.getElementById('nameButton'),
            nameInput = document.getElementById('nameInput'),
            messages = document.getElementById('messages'),
            text = document.getElementById('text'),
            textSubmit = document.getElementById('textSubmit'),
            userName = '',
            socket = io.connect('http://localhost:8000');

        nameButton.onclick = function(){
            userName = nameInput.value || 'User1';
        };

        textSubmit.onclick = function(){
            var data = {
                name: userName,
                text: text.value || 'did not send some text'
            };
            text.value = '';
            socket.emit('chat message', data);
        }
      
        socket.on('chat history', function(msg){
           messages.innerHTML = '';
            for(var i in msg){
                if(msg.hasOwnProperty(i)){
                    var el = document.createElement('li');
                    el.innerText = msg[i].name + ':'+ msg[i].text;
                    messages.appendChild(el);
                    }
                };

        });


    })();
