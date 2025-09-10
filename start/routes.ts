/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import CartsController from '#controllers/carts_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import auth from '@adonisjs/auth/services/main'
import AdminOnlyMiddleware from '#middleware/admin_only_middleware'
const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')

router.group(() => {
  router.post('/register', [UsersController, 'register'])
  router.post('/login', [UsersController, 'login'])
})

router
  .group(() => {
    router.put('/:id', [UsersController, 'update'])
    router.delete('/:id', [UsersController, 'destroy'])

    router.get('/:id/carts', [CartsController, 'show'])
    router.put('/:id/carts', [CartsController, 'update'])
  })
  .prefix('users')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

//Adm user routes
router
  .group(() => {
    router.get('/', [UsersController, 'index'])
    router.get('/:id', [UsersController, 'show'])
  })
  .prefix('users')
  .use([middleware.auth({ guards: ['api'] }), middleware.adminOnly()])

router
  .group(() => {
    router.post('/', [ProductsController, 'store'])
    router.get('/', [ProductsController, 'index'])
    router.get('/:id', [ProductsController, 'show'])
    router.put('/:id', [ProductsController, 'update'])
    router.delete('/:id', [ProductsController, 'destroy'])
  })
  .prefix('products')
