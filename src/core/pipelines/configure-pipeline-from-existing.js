'use strict'

function copyStageConfigs(targetPipelineId, sourcePipelineId) {
  // TODO: implement
}

function copyVariables(targetPipelineId, sourcePipelineId) {
  // TODO: implement
}

module.exports = function(targetPipelineId, sourcePipelineId) {

  return Promise.all([
    copyStageConfigs(targetPipelineId, sourcePipelineId),
    copyVariables(targetPipelineId, sourcePipelineId)
  ])

}
