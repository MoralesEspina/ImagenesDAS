const multer = require("multer");
const firebase = require('../certificates/firebase');
const path = require('path')
const uuid = require('uuid');
const { respondError, respond } = require("../handlers/response");

const Upload = {}
Upload.storage = multer({
    storage: multer.memoryStorage()
})

let filesSupported = ['.jpg', '.jpeg', '.png'];

Upload.FirestoreUploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return respond(res, 400, { ok: false, message: 'No files found', data: [] });
        } else {
            let filename = await uploadFileFirebase('avatars', req.file, `users/${req.user.id}`);
            req.avatar = filename;
            next();
        }
    } catch (error) {
        if (error.statusCode) {
            return respond(res, error.statusCode, error)
        }

        return respondError(res, error);
    }
}

Upload.UploadWaterMark = async (req, res, next) => {
    try {
        if (!req.file) {
            return respond(res, 400, { ok: false, message: 'No files found', data: [] });
        } else {
            let filename = await uploadFileFirebase('watermarks', req.file, req.url.split('/')[1]);
            req.filename = filename;
            next();
        }
    } catch (error) {
        if (error.statusCode) {
            return respond(res, error.statusCode, error)
        }

        return respondError(res, error);
    }
}

const uploadFileFirebase = async (pathChildBucket, fileInformation, pathDatabase) => {
    return new Promise(async (resolve, reject) => {
        let mimeType = path.extname(fileInformation.originalname);
        if (!filesSupported.includes(mimeType)) {
            return reject({ ok: false, message: 'Files no suported', data: [], statusCode: 401 });
        }

        // verifica si tiene archivo cargado
        let hasFile = await verifyHasAvatar(pathDatabase);

        let fileName = uuid.v4() + mimeType;
        const blob = firebase.bucket.file(`${pathChildBucket}/${fileName}`);

        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: fileInformation.mimetype,
            }
        })

        blobWriter.on('error', (error) => {
            return reject(error);
        })

        blobWriter.on('finish', () => {
            //Si tiene archivo previamente lo borra del storage
            if (hasFile) {
                firebase.bucket.deleteFiles({
                    prefix: `${pathChildBucket}/${hasFile.fileName}`,
                }).catch(error => {
                    return reject(error);
                })
            }

            resolve(fileName);
        })

        blobWriter.end(fileInformation.buffer);
    })
}

const verifyHasAvatar = (pathDatabase) => {
    return new Promise((resolve, reject) => {

        firebase.database.ref(`${pathDatabase}`).on('value', (value) => {
            resolve(value.val());
        }, error => {
            reject(error);
        })
    })
}

module.exports = Upload;