var idGenerator = 0;

// Initialize messages array with dummy message
var messages = messages || [{
  "id": idGenerator++,
  "username": "",
  "message": ""
}];

/*
 * Ajax end points
 */

exports.list = function(req, res){
  var lastMsgId = req.query.lastMsgId;
  
  // return older messages or last message if client just connected
  if (lastMsgId == -1)
  {
    res.json(messages[messages.length - 1]);
    return;
  }
  
  var filtered = messages.filter(function(msg) {
    return msg.id > lastMsgId;
  });
  
  res.json(filtered);
};

exports.create = function(req, res) {
      
  var username = req.body.username;
  var message = req.body.message;

  // messages array follows FIFO
  
  // Append message to the end of the array
  messages.push({
      "id": idGenerator++,
      "username": username,
      "message": message
  });
  
  // All messages but the last one stay in memory for 60 seconds
  setTimeout(function () {
    messages.shift()
  }, 60000);

  res.json(200);
};