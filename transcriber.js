var fs = require('fs');
var config = require('./config.js');
var recognize = require('./recognize.js');

function createStream() {
  var writeStream = fs.createWriteStream('./' + this.streams.length + '.txt');
  this.streams.push(writeStream);
  var recognizeStream = recognize(this.streamFinished.bind(this));
  recognizeStream.pipe(writeStream);
  return recognizeStream;
}

function streamFinished() {
  this.completed++;
  console.log(this.completed + ' parts completed.');
  if (this.completed==this.streams.length) this.aggregate();
}

function aggregate() {
  var fullText = "";
  for (var i=0; i<this.streams.length;i++) {
    var start_minute = i * config.stt.partLength;
    var end_minute = (i + 1) * config.stt.partLength;
    fullText += start_minute + ':00-' + end_minute + ':00\n';
    fullText += fs.readFileSync(this.streams[i].path).toString();
    fullText += '\n\n';
  }
  fs.writeFileSync('./auto_transcription.txt', fullText.trim());
  this.callback(this.video_id);
}

function transcribe() {
  console.log("Started transcribing");
  for(var i = 0; i * config.stt.partLength <= this.minutes; i++) {
    var audioSlice = fs.createReadStream('./' + i + '.wav');
    audioSlice.pipe(this.createStream());
    console.log((i+1) + " parts being processed.");
  }
}

module.exports = function(video_id, minutes, callback) {
  this.streams = [];
  this.completed = 0;
  this.minutes = minutes;
  this.video_id = video_id;

  this.callback = callback;
  this.aggregate = aggregate;
  this.transcribe = transcribe;
  this.createStream = createStream;
  this.streamFinished = streamFinished;
}
