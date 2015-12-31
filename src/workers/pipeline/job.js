'use strict'

//const FAILED = 'failed'
//const SUCCEEDED = 'succeeded'

//let domain = require('domain')
let logger = require('tracer').colorConsole()
let Pipeline = require('../../core/pipelines/pipeline')
let Stage = require('../../core/pipelines/stage')
//let registry = require('../../extensions/registry')
//let pipelineEvent = require('../../queues/pipeline/events') // Syntax: pipelineEvent('update')

module.exports = class Job {

  /**
   * @param {object} msg Data passed from the queue
   * @param {function} next Should be called on complete (to clear the message from the queue)
   */
  constructor(msg, next) {
    this.pipeline = new Pipeline(msg.id)
    this.pipeline.load().then(() => {
      this.pipeline.running().then(() => {
        this.prepareInputAndVariables().then(() => {
          this.run().then(() => {
            this.pipeline.succeed().then(() => {
              next()
            })
          })
        })
      })
    })
    .catch(err => logger.error(err))
  }

  /**
   * Prepare initial values of variables
   */
  prepareInputAndVariables() {
    console.log('job:prepareInputAndVariables')
    return new Promise((resolve, reject) => {

      console.log('job:inputvariables:starting to resolve')
      console.log(this)

      // Validate the variables config snapshot value
      if (!Array.isArray(this.pipeline.config.variables)) {
        this.pipeline.config.variables = []
      }

      // Convert the variable objects into a list of expected input/variable keys
      let expectedKeys = this.pipeline.config.variables.map(variable => variable.name)

      // INPUT VALIDATION
      // NOTE: I'm ok failing validation here. For example, if GitHub were to trigger a job without all of the required
      // input, I would rather that the webhook succeed and we can fail the job here before it begins with a note saying
      // it was missing a required input or provided input we didn't expect.

      // Run through the user/trigger provided input (and make sure there is not unexpected input)
      for (let key in this.pipeline.input) {

        // If we can't find the input key in the expected input/variables...
        if (expectedKeys.indexOf(key) === -1) {

          // Note the event in the server logs
          logger.warn('Input key "' + key + '" was provided but was not expected')

          // Note the event in the pipeline execution logs
          this.pipeline.log('Input key "' + key + '" was provided but was not expected')

          // Fail the pipeline
          this.pipeline.fail()
          reject()
          return
        }
      }

      // Build the initial variable values by combining default values and input provided
      // (also check if a required input is missing)
      let initialVariableValues = {}

      this.pipeline.config.variables.forEach(variable => {

        let key = variable.name

        // If the variable is a "required" "input"", make sure it exists (and capture it)
        if (variable.required) {
          if (typeof this.pipeline.input[key] === 'undefined') {

            // Note the event in the server logs
            logger.warn('Missing required input "' + key + '" for pipeline')

            // Note the event in the pipeline execution logs
            this.pipeline.log('Missing required input "' + key + '" for pipeline')

            // Fail the pipeline
            this.pipeline.fail()
            reject()
            return
          }
          initialVariableValues[key] = this.pipeline.input[key]

        } else {
          // Otherwise, if it is optional...

          // Check if an input was provided. If so, use that, otherwise, use the default value
          if (typeof this.pipeline.input[key] !== 'undefined') {
            initialVariableValues[key] = this.pipeline.input[key]
          } else {
            initialVariableValues[key] = variable.default_value
          }

        }
      })

      logger.debug('initial variable values')
      logger.debug(initialVariableValues)

      this.initialVariableValues = initialVariableValues

      console.log('resolved variables')

      console.log('job:inputvariables:about to resolve')
      resolve()

    })

  }

  /**
   * Run the pipeline execution
   */
  run() {
    console.log('job:run')
    return new Promise(resolve => {

      //logger.debug('Inside run()')
      //logger.debug(this.pipeline.config)

      // Load up the stages...
      // Set up a callback for when all the stages are complete...
      // Run each stage, and when the stage is done, move onto the next one...
      // ... unless it is the last one, in which case, call that callback and be done with the pipeline...

      // Get the output from the stage and apply it to the pipeline variables as mapped

      this.pipeline.config.stageConfigs.forEach((stageConfig, index) => {

        logger.debug('Stage ' + (index + 1))
        logger.debug(stageConfig)

      })

      console.log('job:run:about to resolve')

      resolve()

    })

  }

}
