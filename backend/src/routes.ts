import { Router } from 'express'
import ClassesController from './controllers/ClassesController'
import ConnectionsController from './controllers/ConnectionsController'
import UsersController from './controllers/UsersController'
import ProfilesController from './controllers/ProfilesController'
import FavoritesController from './controllers/FavoritesController'
import auth from './middlewares/auth'
import multer from 'multer'
import multerConfig from './config/multerConfig'

const routes = Router()

const upload = multer(multerConfig)


routes.post('/classes/:id', auth, ClassesController.create)
routes.get('/classes', auth, ClassesController.index)
routes.get('/classes/:id', auth, ClassesController.userClasses)
routes.delete('/classes/:id', auth, ClassesController.deleteClass)
routes.post('/connections', auth, ConnectionsController.create)
routes.get('/connections', auth, ConnectionsController.index)
routes.post('/users', UsersController.createUser)
routes.post('/profiles', ProfilesController.loginUser)
routes.put('/profiles/image/:id', auth, upload.single('avatar'), ProfilesController.updateImage)
routes.put('/profilesupdate/:id', auth, ProfilesController.updateProfile)
routes.post('/profiles/resetpassword', ProfilesController.resetPassword)
routes.put('/profiles/resetpassword/:id', ProfilesController.updatePassword)
routes.post('/auth', auth, ProfilesController.profileAuth)
routes.get('/favorites', auth, FavoritesController.listFavorite)
routes.post('/favorites', auth, FavoritesController.createFavorite)
routes.delete('/favorites/:user/:favorite', auth, FavoritesController.deleteFavorite)

export default routes