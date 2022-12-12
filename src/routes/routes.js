const Router = require('express').Router()
const firebase = require('../middlewares/uploadfile.middle')
const { authorizationValidator } = require('../lib/validations/authorization.validation')
const { Login } = require('../middlewares/auth.middle')
const { downloadAvatar, uploadAvatar } = require('../handlers/avatar.handler')
const { CreateConfigurationPDF, GetConfigurationPDF } = require('../handlers/authorizationforms.handler')

Router.post('/avatar', Login, firebase.storage.single('avatar'), firebase.FirestoreUploadFile, uploadAvatar)
Router.get('/avatar', Login, downloadAvatar)
Router.post('/authorization/configuration', firebase.storage.single('watermark'), firebase.UploadWaterMark, authorizationValidator, CreateConfigurationPDF)
Router.get('/authorization/configuration',  GetConfigurationPDF)
Router.post('/requestvacation/configuration', firebase.storage.single('watermark'), firebase.UploadWaterMark, authorizationValidator, CreateConfigurationPDF)
Router.get('/requestvacation/configuration',  GetConfigurationPDF)
Router.get('/constancy/configuration', GetConfigurationPDF)

module.exports = Router;