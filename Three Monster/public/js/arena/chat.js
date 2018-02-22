function chatShow() {
	$('#chat-area').css('width', '90%');
	$('#chat-area').css('opacity', '0.95');
}

function hideChat() {
	$('#chat-area').css('width', '0%');
	$('#chat-area').css('opacity', '0');
}

function Chat(socket) {
	var userID = undefined;
	
	// abre a sala do chat
	socket.on('chat', function(userid){
		userID = userid;
		// abre a sala de troca de mensagens
		socket.on('chat-message', function(message) {
			if(message["id"] == userID) { // my message
				$('#chat-area div').append("<p class='message'><span class='self'>" + message["from"] + " diz: </span>" + message["text"] + "</p>");
			} else { // other message
				$('#chat-area div').append("<p class='message'><span class='oponent'>" + message["from"] + " diz: </span>" + message["text"] + "</p>");
			}
		});
	});
	
	// send the message
	$('#side-bar input:text').keyup(function(evt){
		evt.preventDefault();
		if(evt.which == 13 || evt.which == 10) {
			// enter key is up
			var nick = $('#nick').text();
			if(nick == "") nick = $('#myid').text();
			socket.emit('chat-message', {
				"id"   : userID,
				"from" : nick,
				"text" : $(this).val()
			});
			
			//$('#chat-area div').append("<p class='message'><span class='self'>Meu Nome diz:</span> " + $(this).val() + "</p>");
			$(this).val("");
		}
	});
}