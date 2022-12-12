const firebase = require('../../certificates/firebase')

/**
 * 
 * @param {String} pathFileBucket 
 * @returns {Promise<String>} urlString
 */
const GetSignedUrl = async (pathFileBucket, expirationTimeInMinutes) => {
    return new Promise(async (resolve, reject) => {
        const urlOptions = {
            version: "v4",
            action: "read",
            expires: Date.now() + 1000 * 60 * parseInt(expirationTimeInMinutes), // 2 minutes
        }

        const [url] = await firebase.bucket.file(pathFileBucket).getSignedUrl(urlOptions)

        if (!url) {
            reject('No file found')
        }

        resolve(url)
    })
}

module.exports = { GetSignedUrl };