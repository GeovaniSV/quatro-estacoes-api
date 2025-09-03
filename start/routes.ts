/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')

router
  .group(() => {
    router.post('/', [UsersController, 'store'])
    router.get('/', [UsersController, 'index'])
    router.get('/:id', [UsersController, 'show'])
    router.put('/:id', [UsersController, 'update'])
    router.delete('/:id', [UsersController, 'destroy'])
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
