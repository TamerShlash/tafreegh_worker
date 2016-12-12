var pg = require('pg');
var config = require('./config.js');

var query = 'SELECT yt_id FROM videos WHERE auto_transcribed=$1 AND transcribed=$2 ORDER BY updated_at ASC LIMIT 1;';
var client = new pg.Client(config.db);

module.exports = function(callback) {
  client.connect(function (err) {
    if (err) throw err;

    client.query(query, [false, false],  function (err, result) {
      if (err) throw err;
      client.end(function (err) {
        if (err) throw err;
        if (result.rowCount == 0) {
          console.log("No videos to transcribe!");
          process.exit(0);
        } 
        callback(result.rows[0].yt_id);
      });
    });
  });
}
