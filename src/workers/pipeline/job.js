'use strict'

let domain = require('domain')
let logger = require('tracer').colorConsole()
let Pipeline = require('../../core/pipelines/pipeline')
let Stage = require('../../core/pipelines/stage')
let extensionRegistry = require('../../extensions/registry')
let TokenResolver = require('../../core/pipelines/token-resolver')

module.exports = class Job {

  /**
   * @param {object} msg Data passed from the queue
   * @param {function} next Should be called on complete (to clear the message from the queue)
   */
  constructor(msg, next) {

    // Set up the stage numbering
    this.currentStageNumber = 0

    // Assume no stage has failed until we find out otherwise
    this.anyStageHasFailed = false

    // Load the pipeline and start the execution
    this.pipeline = new Pipeline(msg.id)
    this.pipeline.load().then(() => {
      this.pipeline.running().then(() => {
        this.prepareInputAndVariables().then(() => {
          this.run().then(() => {
            next()
          }).catch(err => logger(err))
        })
      }).catch(err => logger.error(err))
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

      let baseJobData = {
        workspace_dir: ''
      }

      this.tokenResolver = new TokenResolver(baseJobData, initialVariableValues)

      console.log('resolved variables')

      console.log('job:inputvariables:about to resolve')
      resolve()

    })

  }

  /**
   * Run the pipeline execution
   */
  run() {

    logger.debug('run() promise registered')

    return new Promise(resolve => {

      logger.debug('run() promise executing...')

      // Clone the stage configurations to execute
      this.stagesRemaining = this.pipeline.config.stageConfigs.slice(0)

      this.executeNextStage(() => {
        if (this.anyStageHasFailed) {
          this.pipeline.fail().then(() => {
            resolve()
          })
        } else {
          this.pipeline.succeed().then(() => {
            resolve()
          })
        }
      })

    })

  }

  executeNextStage(callback) {

    logger.debug('Job:executeNextStage()')

    // If we've completed all the stages, call the callback
    if (this.stagesRemaining.length === 0) {
      callback()
      return
    }

    // Pull off a stage configuration off of the stages remaining
    let stageConfig = this.stagesRemaining.shift()

    // parse the output map for the stage congig
    stageConfig.output_map = JSON.parse(stageConfig.output_map)

    logger.debug('stageConfig')
    logger.debug(stageConfig)

    // Bump the current stage number
    this.currentStageNumber++

    logger.debug('this.currentStageNumber', this.currentStageNumber)

    // Create a stage object for use in the extension execute method
    let stage = new Stage(this.currentStageNumber, stageConfig, this.pipeline, this.tokenResolver, () => {

      stage.on('failed', () => {
        this.anyStageHasFailed = true
        this.executeNextStage(callback)
      })

      stage.on('succeeded', () => {

        // Get the output from the stage
        let output = stage.getOutput()

        logger.debug('output from stage #' + this.currentStageNumber + ':')
        logger.debug(output)

        //logger.debug('stage config output map:')
        //logger.debug(stageConfig.output_map)

        // If output has been mapped for this stage configuration
        if (typeof stageConfig.output_map === 'object') {

          // Loop through the output provided by the extension stage type
          for (let key in output) {

            // If the output is mapped, then update the value in the token resolver
            if (typeof stageConfig.output_map[key] === 'string' && stageConfig.output_map[key].trim() !== '') {
              logger.debug('found a mapped output. setting user variable "' + stageConfig.output_map[key] + '" to "' + output[key] + '"')
              this.tokenResolver.setUserVarValue(stageConfig.output_map[key], output[key])
            }

          }

        }

        this.executeNextStage(callback)
      })

      stage.on('skipped', () => {
        this.executeNextStage(callback)
      })

      if (this.anyStageHasFailed) {
        stage.skip()
      }

      // Create a domain in which to execute the stage
      let d = domain.create()

      // Set up an event handler for if the stage fails
      d.on('error', (err) => {
        logger.error(err)

        let logTitle = 'Extension Error: An exception occurred executing stage #' + this.currentStageNumber
        let fullErrorMessage = 'Extension: ' + stageConfig.type + '\n\n' +
          'Error Message: ' + err.message + '\n\n' +
          'Stack Trace: ' + '\n\n' + err.stack

        this.pipeline.log('mc.basics.logs.snippet', logTitle, [fullErrorMessage])
        stage.fail(err)
        this.executeNextStage(callback)
      })

      d.run(() => {

        logger.debug('d.run() for stage #' + this.currentStageNumber)

        // Get the stage type from the extension for this stage
        let stageType = extensionRegistry.get(stageConfig.type)

        // Run the stage
        stageType.execute(stage)

      })

    })

  }

}
