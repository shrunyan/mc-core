'use strict'

module.exports = [
  {
    name: 'mc-web',
    script: 'node_modules/mc-core/src/server.js',
    node_args: '--optimize_for_size --max_old_space_size=920 --gc_interval=100',
    watch: 'node_modules/mc-core',
    ignore_watch: [
      '.git',
      '.idea',
      'node_modules/mc-core/.idea',
      'node_modules/mc-core/ui',
      'node_modules/mc-core/ui-build',
      'node_modules/mc-core/node_modules/mc-extension-validator/.idea',
      'node_modules/mc-core/.git',
      'node_modules/mc-core/node_modules'
    ]
  },
  {
    name: 'mc-worker-pipelines',
    script: 'node_modules/mc-core/src/workers/pipeline/worker.js',
    watch: 'node_modules/mc-core',
    ignore_watch: [
      '.git',
      '.idea',
      'node_modules/mc-core/.idea',
      'node_modules/mc-core/ui',
      'node_modules/mc-core/ui-build',
      'node_modules/mc-core/node_modules/mc-extension-validator/.idea',
      'node_modules/mc-core/.git',
      'node_modules/mc-core/node_modules'
    ]
  },
  {
    name: 'mc-ui-gulp-watch',
    script: 'node_modules/mc-core/node_modules/.bin/gulp',
    args: ['watch'],
    cwd: 'node_modules/mc-core/'
  }
]
