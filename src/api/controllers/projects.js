'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let basic = require('./basic-response-helper')

module.exports = {

  /**
   * Sends a list of projects
   *
   * @param req
   * @param res
   */
  getProjects: (req, res) => {
    basic.getListCustom(req, res, 'projects', query => {
      return query.orderBy('name', 'ASC')
    })
  },

  /**
   * Get one project
   *
   * @param req
   * @param res
   */
  getProject: (req, res) => {
    basic.getOne(req, res, 'projects')
  },

  /**
   * Get projects with nested properties nested in each
   *
   * @param req
   * @param res
   */
  getProjectsWithPipelines: (req, res) => {

    let p1 = connection.select().from('pipeline_configs')
    let p2 = connection.select().orderBy('name', 'ASC').from('projects')

    Promise.all([p1, p2]).then((values) => {
      let pipelines = values[0]
      let projects = values[1]
      let pipelinesByProjectId = {}

      pipelines.forEach((pipeline) => {
        if (!pipelinesByProjectId[pipeline.project_id]) {
          pipelinesByProjectId[pipeline.project_id] = [pipeline]
        } else {
          pipelinesByProjectId[pipeline.project_id].push(pipeline)
        }
      })

      projects.forEach((project, index) => {
        projects[index].pipelines = pipelinesByProjectId[project.id] || []
      })

      res.send({data: projects})

    }).catch(err => {
      logger.error(err)
      res.status(500).send({message: 'An error occurred.'})
    })
  },

  /**
   * Creates a project
   *
   * @param req
   * @param res
   */
  createProject: (req, res) => {
    basic.insertRespond(req, res, 'projects')
  }

}
