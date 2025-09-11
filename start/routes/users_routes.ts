import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const ProfileController = () => import('#controllers/profiles_controller')
const CartsController = () => import('#controllers/carts_controller')

router
  .group(() => {
    //User profile routes
    router.get('/show', [UsersController, 'showProfile'])
    router.put('/', [UsersController, 'update'])

    //profile routes
    router.put('/profile', [ProfileController, 'update'])

    //Cart routes
    router.get('/:id/carts', [CartsController, 'show'])
    router.put('/:id/carts', [CartsController, 'update'])
  })
  .prefix('users')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
