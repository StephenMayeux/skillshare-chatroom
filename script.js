var myUsername = null;
var initMessages = null;
var socket = io('https://test-chat-server-10.herokuapp.com');

function enterChatroom() {
  $('#usernameModal').modal('hide');
  $('#chatroom').show();

  initMessages.forEach(message => {
    if (message.u === myUsername) {
      buildMyChatBubble(message);
    } else {
      buildTheirChatBubble(message);
    }
  });

  // Scroll to bottom of page to see most recent messages
  window.scrollTo(0,document.body.scrollHeight);
}

// determine if username is valid or not
function validateUsername(username) {
  var regex = /\w+/g;
  return regex.test(username);
}

function buildMyChatBubble(message) {
  var bubble = '<li><div class="chat-bubble-my-user">';
  bubble += `<span> <small>${moment(message.t).format('MM/DD/YY [at] hh:mma')} </small> ${message.u} <i class="fa fa-circle" aria-hidden="true"></i></span><br><br>`;
  bubble += `<p>${message.m}</p></div></li>`
  addChatBubbleToPage(bubble);
}

function buildTheirChatBubble(message) {
  var bubble = '<li><div class="chat-bubble-user">';
  bubble += `<span><i class="fa fa-circle" aria-hidden="true"> </i>${message.u} <small>${moment(message.t).format('MM/DD/YY [at] hh:mma')}</small> </span><br><br>`;
  bubble += `<p>${message.m}</p></div></li>`
  addChatBubbleToPage(bubble);
}

function addChatBubbleToPage(bubble) {
  $('#messages').append(bubble);
}

$(document).ready(function() {
  // Show username modal and disable button immediately
  $('#usernameModal').modal({
    show: true,
    backdrop: 'static',
    keyboard: false
  });
  $('#enterRoomBtn').prop('disabled', true);

  // Hide main chat room until we enter a username
  $('#chatroom').hide();

  // function fires every time we type in the input element.
  $('#usernameModalInput').on('input', function(e) {
    var input = e.target.value.trim();
    if (validateUsername(input)) {
      $('#enterRoomBtn').prop('disabled', false);
      myUsername = input;
    } else {
      $('#enterRoomBtn').prop('disabled', true);
      myUsername = null;
    }
  });

  $('#usernameModalInput').on('keyup', function(e) {
    if (e.keyCode === 13 && myUsername) {
      enterChatroom();
    }
  })

  // Close modal and enter chat room
  $('#enterRoomBtn').on('click', enterChatroom);

  // Load recent messages from server to chat room
  socket.on('initMessages', function(messages) {
    initMessages = messages.map(message => JSON.parse(message));
  });
});
