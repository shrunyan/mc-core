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
      .then(() => this.pipeline.running())
      .then(() => {
        // Create stage instance for each configuration
        this.stages = this.pipeline.config.stageConfigs.map((config, index) => {
          return new Stage(index, config, this.msg)
        })
        // Resolve once all instances have an execution record
        return Promise.all(this.stages.map(stage => stage.exec))
      })
      .then(() => {
        return Promise.all(this.stages.map(stage => this.execute(stage)))
      })
      .then(() => this.pipeline.complete())
      .then(this.next)
      .catch(err => logger.error(err))
  }

  execute(stage) {
    let extension = registry.get(stage.config.type)

    // This keeps the promise chain intact
    return new Promise((resolve, reject) => {
      if (this.pipeline.hasFailed) {
        logger.error('previous stage failed')
        // TODO: skip execution
        // reject()
      } else {
        let wait = setInterval(() => {
          logger.debug('Running stage | ' + stage.stageId)
        }, 2000)

        stage.on(FAILED, () => {
          this.pipeline.hasFailed = true
          clearInterval(wait)
          resolve()
        })

        stage.on(SUCCEEDED, () => {
          clearInterval(wait)
          resolve()
        })

        extension.execute(stage)
      }
    })
  }

  // skip() {
  //   return connection
  // }

}
