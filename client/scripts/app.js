// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  roomnames: {},
  usernames: {},
  friends: {}
};

app.init = function() {
  var getString = window.location.search.replace('?', '');
  var getList = getString.split('&');
  var getObject = {};
  for (var i = 0; i < getList.length; i++) {
    var duple = getList[i].split('=');
    var key = duple[0];
    var value = duple[1];
    getObject[key] = value;
  }
  this.username = getObject.username;
  this.roomname = getObject.roomname;

  $('input.submit').on('submit', function(e) {
    e.preventDefault();
    this.handleSubmit();
  });
};
app.send = function(message) {
  $.ajax({
    // always use this url
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};
app.fetch = function() {
  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    dataType: 'JSON',
    success: function (message) {
      console.dir(message);
      console.log('got it');
      this._sanitizeMessage(message);
      this.addMessage(message);
    },
    error: function(data) {
      console.log('err');
    }
  });
};

//Clears messages from the dom
app.clearMessages = function () {
  $('#chats').empty();
};

app._sanitizeMessage = function(message) {
  //we're safe!!!!
};

app.addMessage = function(message) {
  var $chats = $('#chats');
  var t = _.template('<div><p><%= message.username %></p><p><%= message.text %></p></div>');
  $chats.append(t({message: message}));
  this.addRoom(message.roomname);
  this.addUser(message.username);
};

app.addRoom = function(roomname) {
  if (!this.roomnames.hasOwnProperty(roomname)) {
    var $roomSelect = $('#roomSelect');
    var t = _.template('<li><%= roomname %></li>');
    $roomSelect.append(t({roomname: roomname}));
    this.roomnames[roomname] = true;
  }
};

app.addUser = function(username) {
  if (!this.usernames.hasOwnProperty(username)) {
    var $users = $('#users');
    var t = _.template('<li class="username"><%= username %></li>');
    $users.append(t({username: username}));
    this.usernames[username] = true;
    var $user = $users.children().last();
    var boundAddFriend = this.addFriend.bind(this);
    $user.on('click', function() {
      boundAddFriend(username);
    });
  }
};

app.addFriend = function(username) {
  if (!this.friends[username]) {
    this.friends[username] = true;
    console.log('added a friend: ' + username);
  }
};

app.handleSubmit = function() {
  var $text = $('#message').val();
  var message = {
    username: this.username,
    text: text,
    roomname: this.roomname
  };
  this.send(message);
  $text.empty();
};

$(document).ready(function() {
  app.init();
});
