'use strict'

let logger = require('tracer').colorConsole()

module.exports = class Resolver {
  constructor(variables, inputs) {
    if (!Array.isArray(variables)) {
      this.variables = variables || []
    }
    this.inputs = inputs
    this.resolve()
  }

  resolve() {
    return new Promise((resolve, reject) => {
      logger.debug('resolver', this)

      this.resolve

    })
  }

  validateVars() {
     // Convert the variable objects into a list of expected input/variable keys
    let expectedKeys = this.variables.map(variable => variable.name)

    // Run through the user/trigger provided input
    // (and make sure there is not unexpected input)
    for (let key in this.inputs) {

      // If we can't find the input key in the expected input/variables...
      if (expectedKeys.indexOf(key) === -1) {

        // Note the event in the server logs
        logger.warn('Input key "' + key + '" was provided but was not expected')

        // Note the event in the pipeline execution logs
        // this.pipeline.log('Input key "' + key + '" was provided but was not expected')

        // Fail the pipeline
        // this.pipeline.fail()
        this.reject()

        return
      }
    }
  }
}







// module.exports = function resolver(input) {
//   return new Promise((resolve, reject) => {

//     console.log('job:inputvariables:starting to resolve')
//     console.log(this)

//     // Validate the variables config snapshot value
//     if (!Array.isArray(this.pipeline.config.variables)) {
//       this.pipeline.config.variables = []
//     }

//     // Convert the variable objects into a list of expected input/variable keys
//     let expectedKeys = this.pipeline.config.variables.map(variable => variable.name)

//     // INPUT VALIDATION
//     // NOTE: I'm ok failing validation here. For example, if GitHub were to trigger a job without all of the required
//     // input, I would rather that the webhook succeed and we can fail the job here before it begins with a note saying
//     // it was missing a required input or provided input we didn't expect.

//     // Run through the user/trigger provided input (and make sure there is not unexpected input)
//     for (let key in this.pipeline.input) {

//       // If we can't find the input key in the expected input/variables...
//       if (expectedKeys.indexOf(key) === -1) {

//         // Note the event in the server logs
//         logger.warn('Input key "' + key + '" was provided but was not expected')

//         // Note the event in the pipeline execution logs
//         this.pipeline.log('Input key "' + key + '" was provided but was not expected')

//         // Fail the pipeline
//         this.pipeline.fail()
//         reject()
//         return
//       }
//     }

//     // Build the initial variable values by combining default values and input provided
//     // (also check if a required input is missing)
//     let initialVariableValues = {}

//     this.pipeline.config.variables.forEach(variable => {

//       let key = variable.name

//       // If the variable is a "required" "input"", make sure it exists (and capture it)
//       if (variable.required) {
//         if (typeof this.pipeline.input[key] === 'undefined') {

//           // Note the event in the server logs
//           logger.warn('Missing required input "' + key + '" for pipeline')

//           // Note the event in the pipeline execution logs
//           this.pipeline.log('Missing required input "' + key + '" for pipeline')

//           // Fail the pipeline
//           this.pipeline.fail()
//           reject()
//           return
//         }
//         initialVariableValues[key] = this.pipeline.input[key]

//       } else {
//         // Otherwise, if it is optional...

//         // Check if an input was provided. If so, use that, otherwise, use the default value
//         if (typeof this.pipeline.input[key] !== 'undefined') {
//           initialVariableValues[key] = this.pipeline.input[key]
//         } else {
//           initialVariableValues[key] = variable.default_value
//         }

//       }
//     })

//     logger.debug('initial variable values')
//     logger.debug(initialVariableValues)

//     let baseJobData = {
//       workspace_dir: ''
//     }

//     this.tokenResolver = new TokenResolver(baseJobData, initialVariableValues)

//     console.log('resolved variables')

//     console.log('job:inputvariables:about to resolve')
//     resolve()

//   })
// }


