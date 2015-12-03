'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()

module.exports = {
  getProjectsWithPipelines: (req, res) => {

    /*
     .then(function (pipelines) {
     res.send({data: pipelines})
     }).catch(err => {
     logger.log(err)
     })
     */

    let p1 = connection.select().from('pipelines')
    let p2 = connection.select().from('projects')

    Promise.all([p1, p2]).then((values) => {
      let pipelines = values[0]
      let projects = values[1]
      let pipelinesByProjectId = {}

      pipelines.forEach((value) => {
        if (!pipelinesByProjectId[value.project_id]) {
          pipelinesByProjectId[value.project_id] = [value]
        } else {
          pipelinesByProjectId[value.project_id].push(value)
        }
      })

      projects.forEach((project, index) => {
        projects[index].pipelines = pipelinesByProjectId[project.id] || []
      })

      res.send(projects)

    }).catch(err => {
      logger.log(err)
    })
  }
}
