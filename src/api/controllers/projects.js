'use strict'

const PROJECTS = 'projects'
const PIPELINE_CONFIGS = 'pipeline_configs'

let query = require('../../db/queries')
let success = require('../utils/responses/success')
let created = require('../utils/responses/created')
let error = require('../utils/responses/error')

module.exports = {

  /**
   * Sends a list of projects
   *
   * @param req
   * @param res
   */
  getProjects: (req, res) => {
    query.all(PROJECTS)
      .orderBy('name', 'ASC')
      .then(success.bind(res))
      .catch(error.bind(res))
  },

  /**
   * Get one project
   *
   * @param req
   * @param res
   */
  getProject: (req, res) => {
    query.first(req.params.id, PROJECTS)
      .then(success.bind(res))
      .catch(error.bind(res))
  },

  /**
   * Get projects with nested properties nested in each
   *
   * @param req
   * @param res
   */
  getProjectsWithPipelines: (req, res) => {
    let p1 = query.all(PIPELINE_CONFIGS)
    let p2 = query.all(PROJECTS).orderBy('name', 'ASC')

    Promise.all([p1, p2])
      .then(values => {

        let pipelines = values[0]
        let projects = values[1]
        let pipelinesByProjectId = {}

        pipelines.forEach(pipeline => {
          if (!pipelinesByProjectId[pipeline.project_id]) {
            pipelinesByProjectId[pipeline.project_id] = [pipeline]
          } else {
            pipelinesByProjectId[pipeline.project_id].push(pipeline)
          }
        })

        projects.forEach((project, index) => {
          projects[index].pipelines = pipelinesByProjectId[project.id] || []
        })

        success.call(res, projects)

      })
      .catch(error.bind(res))
  },

  /**
   * Creates a project
   *
   * @param req
   * @param res
   */
  createProject: (req, res) => {
    query.insert(req.body, PROJECTS)
      .then(created.bind(res))
      .catch(error.bind(res))
  }

}
