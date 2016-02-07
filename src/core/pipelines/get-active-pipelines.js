'use strict'

let connection = require('../../db/connection')

module.exports = (callback) => {

  connection.select()
    .orderBy('created_at', 'asc')
    .whereNull('finished_at')
    .from('pipeline_executions')
    .then((pipelineExecutionsRaw) => {

      let promises = []
      let pipelineExecutions = []

      // For each pipeline execution, mung its data
      pipelineExecutionsRaw.forEach(pe => {
        promises.push(new Promise(resolve => {

          pe.config_snapshot = JSON.parse(pe.config_snapshot)
          pe.stages = [] // we'll build out this object

          connection.select()
            .where('pipeline_execution_id', pe.id)
            .from('pipeline_stage_executions')
            .then((stageExecutions) => {

              // console.log('results from pipeline_stage_executions (in get-active-pipelines)')
              // console.log(stageExecutions)

              // console.log('pe.config_snapshot.stageConfigs')
              // console.log(pe.config_snapshot.stageConfigs)

              pe.config_snapshot.stageConfigs.forEach(sc => {

                let newStage = {
                  name: sc.name,
                  status: 'not_created'
                }

                // find the matching execution if there is one
                stageExecutions.forEach(se => {
                  if (se.stage_config_id === sc.id) {
                    newStage.status = se.status
                    if (se.status === 'running') {
                      pe.current_stage_num = se.stage_num
                      pe.current_stage_name = sc.name
                    }
                  }
                })

                pe.stages.push(newStage)
              })

              pipelineExecutions.push(pe)
              resolve()
            })

        }))
      })

      // When all the data munging is done, call the callback with the data
      Promise.all(promises).then(() => {
        callback(pipelineExecutions)
      })
    })

}
