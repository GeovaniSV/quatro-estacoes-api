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

import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
import openapi from '@foadonis/openapi/services/main'

// returns swagger in YAML
router.get('/swagger', async () => {
  return AutoSwagger.default.json(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
  // return AutoSwagger.default.scalar("/swagger"); to use Scalar instead. If you want, you can pass proxy url as second argument here.
  // return AutoSwagger.default.rapidoc("/swagger", "view"); to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
})

openapi.registerRoutes()
