const errors = {
  metadataError: function(err) {
    console.log("Cannot specify video duration due to the following error:");
    console.log(err);
    process.exit(1);
  },

  pipelineError: function(err) {
    console.log("The following error occurred during pipeline processing:");
    console.log(err);
  }
}

module.exports = errors;
