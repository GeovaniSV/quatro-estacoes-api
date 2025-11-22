/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

//Server routes
import './routes/users_routes.js'
import './routes/admin_routes.js'

import openapi from '@foadonis/openapi/services/main'
import router from '@adonisjs/core/services/router'

//Publics routes
openapi.registerRoutes('/api-docs')

router.group(() => {})

const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const StripeWebHooksController = () => import('#controllers/stripe_web_hooks_controller')

//Autentications public routes
router
  .group(() => {
    router.post('/register', [UsersController, 'register'])
    router.post('/login', [UsersController, 'login'])
  })
  .prefix('auth')

//Products public routes
router
  .group(() => {
    router.get('/', [ProductsController, 'index'])
    router.get('/:id', [ProductsController, 'show'])
  })
  .prefix('products')

//StripeWebHooks public routes
router.post('/stripe/webhook', [StripeWebHooksController, 'stripeListener'])
router.get('/allpay', [StripeWebHooksController, 'getAllPayments'])
