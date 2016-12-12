var fs     = require('fs');
var fsxtra = require('fs-extra');
var ffmpeg = require('fluent-ffmpeg');

var config = require('./config.js');
var errors = require('./errors.js');
var query = require('./query.js');
var download = require('./download.js');
var Transcriber = require('./transcriber.js');
var upload = require('./upload');

try {
  // If there is no previous PID, this will throw, and the job will start in catch.
  var previousPid = fs.readFileSync(config.process.pidFile).toString();
  // if there is a previous PID, but it's not running, this will throw and the job will start in catch.
  process.kill(previousPid, 0);
  // If there is a previous PID and it's running, we stop.
  process.exit(0);
} catch(e) {
  fsxtra.emptyDirSync(config.process.workDir);
  fs.writeFileSync(config.process.pidFile, process.pid);
  process.chdir(config.process.workDir);
}

query(function(video_id) {
  download(video_id);

  var pipeline = ffmpeg('audio.wav');
  pipeline.ffprobe(function(err, metadata) {
    if (err) errors.metadataError(err);

    var minutes = Math.floor(metadata.format.duration / 60);
    console.log("This video is ~" + minutes + " minutes long");
    var transcriber = new Transcriber(video_id, minutes, upload);

    for(var i = 0; i * config.stt.partLength <= minutes; i++) {
      pipeline.output('./' + i + '.wav').seek(i * config.stt.partLength * 60).duration(config.stt.partLength * 60);
    }
    pipeline.on('error', errors.pipelineError);
    pipeline.on('end', transcriber.transcribe.bind(transcriber));
    pipeline.run();
  });
});
