'use strict'

let executePipeline = require('../core/pipelines/execute-pipeline-command')

module.exports = {

  executePipeline: (pipelineConfigId, options, callback) => {
    executePipeline(pipelineConfigId, options, callback)
  }

}
