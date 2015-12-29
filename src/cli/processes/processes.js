'use strict'

module.exports = [
  {
    name: 'mc-web',
    script: 'node_modules/mc-core/src/server.js',
    node_args: '--optimize_for_size --max_old_space_size=920 --gc_interval=100'
  },
  {
    name: 'mc-worker-pipelines',
    script: 'node_modules/mc-core/src/workers/pipeline/worker.js'
  }
]
