$(document).ready(function() {
  var myUsername = null;

  // Show username modal and disable button immediately
  $('#usernameModal').modal({
    show: true,
    backdrop: 'static',
    keyboard: false
  });
  $('#enterRoomBtn').prop('disabled', true);

  // Hide main chat room until we enter a username
  $('#chatroom').hide();

  // enable button when username is valid
  function validateUsername(username) {
    var regex = /\w+/g;
    return regex.test(username);
  }

  // function fires every time we type in the input element.
  $('#usernameModalInput').on('input', function(e) {
    var input = e.target.value.trim();
    if (validateUsername(input)) {
      $('#enterRoomBtn').prop('disabled', false);
      myUsername = input;
    } else {
      $('#enterRoomBtn').prop('disabled', true);
    }
  });

  // Close modal and enter chat room
  $('#enterRoomBtn').on('click', function() {
    $('#usernameModal').modal('hide');
    $('#chatroom').show();

    // Scroll to bottom of page to see most recent messages
    window.scrollTo(0,document.body.scrollHeight);
  });
});
