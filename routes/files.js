const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    },
})

let upload = multer({
    storage,
    limits: { fileSize: 1000000 * 100 },
}).single('myfile'); //100mb

router.post('/', (req, res) => {
    //Validate request

    //Store file
    upload(req, res, async (err) => {

        if (!req.file) {
            return res.json({ error: 'All fields are required.' });
        }

        if (err) {
            return res.status(500).send({ error: err.message })
        }

        //Store to Databse
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });

        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
        /*
        {
            "file": "http://localhost:3000/files/9a534279-9318-4954-acaf-5eaf7e60eece"
            }
        */
    });


});

router.post('/send', async (req, res) => {
    //console.log(req.body);
    const { uuid, emailTo, emailFrom, expiresIn } = req.body;

    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required except expiry.' });
    }
    // Get data from db 

    const file = await File.findOne({ uuid: uuid });

    if (file.sender) {
        return res.status(422).send({ error: 'Email already sent once.' });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    // send mail
    const sendMail = require('../services/emailService');

    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'ShareBox file sharing',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({

            emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,/*?source=email */
            size: parseInt(file.size / 1000) + ' KB',
            expires: '24 hours'
        })

    });

    return res.send({ success: true });

});

module.exports = router;