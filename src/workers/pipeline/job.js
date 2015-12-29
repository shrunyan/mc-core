'use strict'

const FAILED = 'failed'
const SUCCEEDED = 'succeeded'

let logger = require('tracer').colorConsole()
let Pipeline = require('../../core/pipelines/pipeline')
let Stage = require('../../core/pipelines/stage')
let registry = require('../../extensions/registry')

module.exports = class Job {
  constructor(msg, next) {
    this.msg = msg
    this.next = next
    this.pipeline = new Pipeline(this.msg.id)
    this.start()
  }

  start() {
    // Once we have a pipeline execution record
    this.pipeline.exec
      .then(this.pipeline.running())
      .then(() => {
        // Create stage instance for each configuration
        this.stages = this.pipeline.config.stageConfigs.map((config, index) => {
          return new Stage(index, config, this.msg)
        })

        // Resolve once all instances have an execution record
        return Promise.all(this.stages.map(stage => stage.exec))
      })
      .then(() => {
        // Map over stage instances and execute them
        return Promise.all(this.stages.map(stage => {
          return this.execute(stage).bind(this)
        }))
      })
      .then(this.pipeline.complete())
      .then(this.next)
      .catch(err => logger.error(err))
  }

  execute(stage) {
    console.log('execute', stage)

    if (this.pipeline.hasFailed) {
      logger.error('Previous hasFailed')
      // TODO skip execution
    }

    return new Promise((resolve, reject) => {
      let extension = registry.get(stage.config.type)

      stage.on(FAILED, () => {
        this.pipeline.hasFailed = true
        // TODO: Should we be rejecting?
        // won't this fail fast the rest of the executions
        // preventing them from running?
        // reject()
      })
      stage.on(SUCCEEDED, resolve)

      extension.execute(stage)
    })
  }

  // skip() {
  //   return connection
  // }

}
