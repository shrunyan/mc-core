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
      .then(this.pipeline.running)
      .then(() => {
        console.log('Create stage execution records')
        // Create stage instance for each configuration
        this.stages = this.pipeline.config.stageConfigs.map((config, index) => {
          return new Stage(index, config, this.msg)
        })

        // Resolve once all instances have an execution record
        return Promise.all(this.stages.map(stage => stage.exec))
      })
      .then(() => {
        console.log('Run stage execution')
        return Promise.all(this.stages.map(stage => this.execute(stage)))
      })
      .then(this.pipeline.complete)
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
        let executed = false
        let done = false

        stage.on(FAILED, () => {
          this.pipeline.hasFailed = true
          done = true
          resolve()
        })

        stage.on(SUCCEEDED, () => {
          done = true
          resolve()
        })

        while(!done) {
          if (!executed) {
            extension.execute(stage)
          }
        }
      }
    })


    // if (this.pipeline.hasFailed) {
    //   logger.error('Previous hasFailed')
    //   // TODO skip execution
    // } else {
    //   // Stages must execute synchronously
    //   // wait till stage is done
    //   // let wait = setInterval(() => {
    //   //   logger.debug(`Running Stage | ${stage.config.name} | ${stage.stageId}`)
    //   // }, 1000)

    //   let executed = false
    //   let done = false

    //   stage.on(FAILED, () => {
    //     this.pipeline.hasFailed = true
    //     done = true
    //     // clearInterval(wait)
    //   })
    //   stage.on(SUCCEEDED, () => {
    //     done = true
    //     // clearInterval(wait)
    //   })

    //   console.log('done var value', done)

    //   while(!done) {
    //     if (!executed) {
    //       extension.execute(stage)
    //     }
    //   }

    //   console.log('HERE?')

      // return
    // }

  }

  // skip() {
  //   return connection
  // }

}
