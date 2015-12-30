'use strict'

const FAILED = 'failed'
const SUCCEEDED = 'succeeded'

let domain = require('domain')
let logger = require('tracer').colorConsole()
let Pipeline = require('../../core/pipelines/pipeline')
let Stage = require('../../core/pipelines/stage')
let registry = require('../../extensions/registry')

module.exports = class Job {
  constructor(msg, next) {
    this.next = next
    this.pipeline = new Pipeline(msg.id)
    this.start()
  }

  start() {
    // Pipeline execution is a complicated mix of async
    // and sync processes. In order to handle both all steps
    // must be wraped in a Promise. This keeps a promise chain
    // working through out the whole execution. Then sync
    // operations are handled internally by the promise wrapped
    // functions.

    // Start once our pipeline execution record has been loaded
    this.pipeline.exec
      .then(() => this.pipeline.running())
      .then(() => {
        // Create stage instance for each configuration
        this.stages = this.pipeline.config.stageConfigs.map((config, index) => {
          return new Stage(index + 1, config, this.pipeline)
        })
        // Resolve once all instances have an execution record
        return Promise.all(this.stages.map(stage => stage.exec))
      })
      .then(() => {
        return Promise.all(this.stages.map(stage => this.execute(stage)))
      })
      .then(() => this.pipeline.complete())
      .then(() => this.next())
      .catch((err) => {
        logger.error('Pipeline execution failed in an unexpected way!')
        logger.error(err)
      })
  }

  execute(stage) {
    let extension = registry.get(stage.config.type)

    // TODO: should we use the reject callback
    // to have to promise fail fast? but then
    // we can't mark stages as skipped
    return new Promise(resolve => {
      if (this.pipeline.hasFailed) {
        logger.debug('previous stage failed')
        // TODO: skip execution
      } else {
        // Turn stage async execution into a sync operation
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

        // This try-catch doesn't work
        // Looks like we'll need to use process.on('uncaughtException'...
        // https://nodejs.org/docs/latest/api/process.html#process_event_uncaughtexception
        // OR, domains

        let d = domain.create()

        d.on('error', function(err) {
          logger.error(err)
          stage.trigger(FAILED)
        })

        d.run(() => {
          extension.execute(stage)
        })



      }
    })
  }

  // skip() {
  //   return connection
  // }

}
