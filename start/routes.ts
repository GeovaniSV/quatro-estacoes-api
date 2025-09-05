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
const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')

router.group(() => {
  router.post('/register', [UsersController, 'store'])
  router.post('/login', [UsersController])
})

router
  .group(() => {
    router.get('/', [UsersController, 'index'])
    router.get('/:id', [UsersController, 'show'])
    router.put('/:id', [UsersController, 'update'])
    router.delete('/:id', [UsersController, 'destroy'])

    router.get('/:id/carts', [CartsController, 'show'])
    router.get('/:id/carts', [CartsController, 'update'])
  })
  .prefix('users')

router
  .group(() => {
    router.post('/', [ProductsController, 'store'])
    router.get('/', [ProductsController, 'index'])
    router.get('/:id', [ProductsController, 'show'])
    router.put('/:id', [ProductsController, 'update'])
    router.delete('/:id', [ProductsController, 'destroy'])
  })
  .prefix('products')
