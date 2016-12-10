var fs = require('fs');
var createRecognizeStream = require('./createRecognizeStream.js');

function createStream() {
  var writeStream = fs.createWriteStream('./' + this.streams.length + '.txt');
  this.streams.push(writeStream);
  var recognizeStream = createRecognizeStream(this.streamFinished.bind(this));
  recognizeStream.pipe(writeStream);
  return recognizeStream;
}

function streamFinished() {
  this.completed++;
  if (this.completed==this.streams.length) {
    var fullText = "";
    for (var i=0; i<this.streams.length;i++) {
      var start_minute = i * this.part_length;
      var end_minute = (i + 1) * this.part_length;
      fullText += start_minute + ':00-' + end_minute + ':00\n';
      fullText += fs.readFileSync(this.streams[i].path).toString();
      fullText += '\n\n';
    }
    fs.writeFile('./' + this.video_id + '.txt', fullText, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Success!");
      }
    });
  }
}

module.exports = function(video_id, part_length) {
  this.streams = [];
  this.completed = 0;
  this.video_id = video_id;
  this.part_length = part_length;

  this.createStream = createStream;
  this.streamFinished = streamFinished;
}
