'use strict'

module.exports = {

  executePipeline: (pipelineConfigId, options, callback) => {

    let executePipeline = require('../core/pipelines/execute-pipeline-command')

    executePipeline(pipelineConfigId, options, callback)
  }

}
