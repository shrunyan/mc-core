'use strict'

function copyStageConfigs(targetPipelineId, sourcePipelineId) {
  // TODO: implement
}

function copyVariables(targetPipelineId, sourcePipelineId) {
  // TODO: implement
}

module.exports = function(targetPipelineId, sourcePipelineId) {

  return new Promise((resolve) => {

    let promises = [
      copyStageConfigs(targetPipelineId, sourcePipelineId),
      copyVariables(targetPipelineId, sourcePipelineId)
    ]

    Promise.all(promises).then(() => {
      resolve()
    })

  })

}
