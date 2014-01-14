
/*
 * Ajax end point
 */

global.messages = global.messages || [];

exports.list = function(req, res){
  res.json(global.messages);
};

exports.create = function(req, res) {
      
  var username = req.body.username;
  var message = req.body.message;

  global.messages.push({
      "id": global.messages.length,
      "username": username,
      "message": message
  });

  res.json(200);
};