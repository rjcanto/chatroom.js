var idGenerator = 0;

// Initialize messages array with dummy message
var messages = messages || [{
  "id": idGenerator++,
  "username": "",
  "message": "",
  "origin": ""
}];

/*
 * Ajax end points
 */

exports.list = function(req, res) {
  
  // CORS
  var origin = req.header('origin');
  if (origin !== undefined) {
    res.header('Access-Control-Allow-Origin', '*');
    
    // Preflight
    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, X-Requested-With');
      res.send(200);
      return;
    }
  }
  
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

  // CORS
  var origin = req.header('origin');
  if (origin !== undefined) {
    res.header('Access-Control-Allow-Origin', '*');
    
    // Preflight
    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUSH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, X-Requested-With');
      res.send(200);
      return;
    }
  }
  
  origin = origin || "";
      
  var username = req.body.username;
  var message = req.body.message;

  // messages array follows FIFO
  
  // Append message to the end of the array
  messages.push({
      "id": idGenerator++,
      "username": username,
      "message": message,
      "origin": origin.indexOf(req.header("host")) != -1 ? "" : origin
  });
  
  // All messages but the last one stay in memory for 60 seconds
  setTimeout(function () {
    messages.shift()
  }, 60000);

  res.json(200);
};