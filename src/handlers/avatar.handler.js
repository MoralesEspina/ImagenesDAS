const firebase = require('../certificates/firebase')
const { GetSignedUrl } = require('../lib/firebase/downloadfile')
const { respondError, respond } = require('./response')

const Handler = {}

Handler.uploadAvatar = async (req, res) => {
    try {
        firebase.database.ref('users/' + req.user.id).set({
            fileName: req.avatar
        }, error => {
            if (error) {
                return respondError(res, error);
            }
        })

        let imageURL = await GetSignedUrl('avatars/' + req.avatar, 60 * 10);
        return respond(res, 201, { ok: true, message: 'Success', data: { id: req.user.id, avatar: req.avatar, imageURL: imageURL } });
    } catch (error) {
        return respondError(res, error);
    }
}

Handler.downloadAvatar = async (req, res) => {
    try {
        let fileName;
        let data = await firebase.database.ref('users/' + req.user.id).get();
        if (!data.val()) {
            fileName = 'default-avatar.jpg';
        } else {
            fileName = data.val().fileName;
        }

        let imageURL = await GetSignedUrl('avatars/' + fileName, 60 * 10);
        return respond(res, 200, { ok: true, message: 'Success image', data: imageURL })
    } catch (error) {
        return respondError(res, error);
    }
}


module.exports = Handler;