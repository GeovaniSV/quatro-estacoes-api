/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'

//Server routes
import './routes/public_routes.js'
import './routes/users_routes.js'
import './routes/admin_routes.js'

import openapi from '@foadonis/openapi/services/main'

openapi.registerRoutes('/api-docs')
