const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config({ path: "../.env" });

module.exports = {

    getTextByAmiVoice: async function (req) {
        console.log("ami start-----")

        const {originalname, mimetype, buffer} = req.file;
        console.log("req.file", req.file)

        const API_KEY = process.env.AMI_API_KEY
        const amiURL = "https://acp-api.amivoice.com/v1/recognize"

        const formData = new FormData();
        formData.append('d', '-a-general');
        formData.append('u', API_KEY);
        formData.append('a', buffer,
            {filename: originalname, contentType: mimetype});

        try {
            console.log('API send-----')
            const response = await axios.post(amiURL, formData, {});

            const data = await response.data.text;
            console.log("back/res: ", data)

            return({text: data});
        } catch (error) {
            return({message: 'Error', error});
        }
    }
}
