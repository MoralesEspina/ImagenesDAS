const { validationResult } = require('express-validator');

const firebase = require('../certificates/firebase');

const { respondError, respond } = require("./response");
const { GetSignedUrl } = require('../lib/firebase/downloadfile');

const Handler = {}


Handler.CreateConfigurationPDF = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return respond(res, 400, error.array());
        }

        let configurationFile = {
            fileName: req.filename,
            width: req.body.width,
            height: req.body.height,
            align: req.body.align
        }

        await firebase.database.ref(req.url.split('/')[1]).set(configurationFile, error => {
            if (error) {
                return respondError(error)
            }
        })

        return respond(res, 201, { ok: true, message: 'Configuration success!', data: configurationFile })

    } catch (error) {
        return respondError(res, error)
    }
}

Handler.GetConfigurationPDF = async (req, res) => {
    try {
        let data = await firebase.database.ref(req.url.split('/')[1]).get();

        if (!data.val()) {
            return respond(res, 404, { ok: false, message: 'No found configuration', response: [] })
        }

        let imageURL = await GetSignedUrl(`watermarks/${data.val().fileName}`, 2)
        let resp = data.val();
        resp.imageURL = imageURL;

        return respond(res, 200, { ok: true, message: 'Founded', data: resp })
    } catch (error) {
        return respondError(res, error)
    }
}



module.exports = Handler;