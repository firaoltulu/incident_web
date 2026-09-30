const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");
require('dotenv').config();


const region = process.env.AWS_BUCKET_REGION;
const SES_AWS_ACCESS_KEY = process.env.SES_AWS_ACCESS_KEY;
const SES_AWS_SECRET_KEY = process.env.SES_AWS_SECRET_KEY;
const SES_USED_TEMPLETE = process.env.SES_USED_TEMPLETE;
const SES_USED_EMAIL_ADDRESS = process.env.SES_USED_EMAIL_ADDRESS;

const SES_CONFIG = {
    credentials: {
        accessKeyId: SES_AWS_ACCESS_KEY,
        secretAccessKey: SES_AWS_SECRET_KEY
    },
    region
};

const sesClient = new SESClient(SES_CONFIG);

const sendEmail = async (templete_name, RecepEmail) => {
    const sendemailtempletecommand = new SendTemplatedEmailCommand({
        Destination: {
            ToAddresses: [
                RecepEmail
            ],
        },
        Source: SES_USED_EMAIL_ADDRESS,
        Template: templete_name,
        TemplateData: JSON.stringify({ message: "34343434", name: "firaol" })
    });

    try {
        const res = await sesClient.send(sendemailtempletecommand);
        console.log("SES email has been send.", res);
    } catch (err) {
        console.log("Failed to send email.", err);
        return err;
    }
};

sendEmail("ses-wede-templete-three", "firaoltulu5@gmail.com");