const { SESClient, CreateTemplateCommand } = require("@aws-sdk/client-ses");
require('dotenv').config();


const region = process.env.AWS_BUCKET_REGION;
const SES_AWS_ACCESS_KEY = process.env.SES_AWS_ACCESS_KEY;
const SES_AWS_SECRET_KEY = process.env.SES_AWS_SECRET_KEY;

const SES_CONFIG = {
    credentials: {
        accessKeyId: SES_AWS_ACCESS_KEY,
        secretAccessKey: SES_AWS_SECRET_KEY
    },
    region
};

const sesClient = new SESClient(SES_CONFIG);

const createCreateTemplateCommand = async (templete_name) => {
    const createtempletecommand = new CreateTemplateCommand({
        /**
         * The template feature in Amazon SES is based on the Handlebars template system.
         */
        Template: {
            TemplateName: templete_name,
            HtmlPart: `<!DOCTYPE HTML
            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title></title>
        
            <style type="text/css">
                @media only screen and (min-width: 620px) {
                    .u-row {
                        width: 600px !important;
                    }
        
                    .u-row .u-col {
                        vertical-align: top;
                    }
        
                    .u-row .u-col-50 {
                        width: 300px !important;
                    }
        
                    .u-row .u-col-100 {
                        width: 600px !important;
                    }
        
                }
        
                @media (max-width: 620px) {
                    .u-row-container {
                        max-width: 100% !important;
                        padding-left: 0px !important;
                        padding-right: 0px !important;
                    }
        
                    .u-row .u-col {
                        min-width: 320px !important;
                        max-width: 100% !important;
                        display: block !important;
                    }
        
                    .u-row {
                        width: 100% !important;
                    }
        
                    .u-col {
                        width: 100% !important;
                    }
        
                    .u-col>div {
                        margin: 0 auto;
                    }
                }
        
                body {
                    margin: 0;
                    padding: 0;
                }
        
                table,
                tr,
                td {
                    vertical-align: top;
                    border-collapse: collapse;
                }
        
                p {
                    margin: 0;
                }
        
                .ie-container table,
                .mso-container table {
                    table-layout: fixed;
                }
        
                * {
                    line-height: inherit;
                }
        
                a[x-apple-data-detectors='true'] {
                    color: inherit !important;
                    text-decoration: none !important;
                }
        
                table,
                td {
                    color: #000000;
                }
        
                #u_body a {
                    color: #161a39;
                    text-decoration: underline;
                }
            </style>
        
            <link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css">
            <link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css">
        
        </head>
        
        <body class="clean-body u_body"
            style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
        
            <table id="u_body"
                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%"
                cellpadding="0" cellspacing="0">
                <tbody>
                    <tr style="vertical-align: top">
                        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: #f9f9f9">
                                <div class="u-row"
                                    style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
                                    <div
                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
        
                                        <div class="u-col u-col-100"
                                            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                            <div style="height: 100%;width: 100% !important;">
        
                                                <div
                                                    style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
        
                                                    <table style="font-family:'Lato',sans-serif;" role="presentation"
                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;"
                                                                    align="left">
        
                                                                    <table height="0px" align="center" border="0"
                                                                        cellpadding="0" cellspacing="0" width="100%"
                                                                        style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #581c1c;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                        <tbody>
                                                                            <tr style="vertical-align: top">
                                                                                <td
                                                                                    style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                                    <span>&#160;</span>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
        
                                                </div>
                                            </div>
                                        </div>
        
                                    </div>
                                </div>
                            </div>
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row"
                                    style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3a534f;">
                                    <div
                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                        <div class="u-col u-col-100"
                                            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                            <div style="height: 100%;width: 100% !important;">
                                                <div
                                                    style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
        
                                                    <table style="font-family:'Lato',sans-serif;" role="presentation"
                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:'Lato',sans-serif;"
                                                                    align="left">
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <table style="font-family:'Lato',sans-serif;" role="presentation"
                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 30px;font-family:'Lato',sans-serif;"
                                                                    align="left">
        
                                                                    <div
                                                                        style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                        <p
                                                                            style="font-size: 14px; line-height: 140%; text-align: center;">
                                                                            <span
                                                                                style="font-size: 28px; line-height: 39.2px; color: #ffffff; font-family: Lato, sans-serif;">Verify
                                                                                your email account</span>
                                                                        </p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row"
                                    style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                    <div
                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                        <div class="u-col u-col-100"
                                            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                            <div style="height: 100%;width: 100% !important;">
                                                <div
                                                    style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
        
                                                    <table style="font-family:'Lato',sans-serif;" role="presentation"
                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;"
                                                                    align="left">
        
                                                                    <div
                                                                        style="font-size: 14px; color: #ff0b0b; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 140%;"><span
                                                                                style="font-size: 18px; line-height: 25.2px; color: #666666;">Hello, {{name}}</span>
                                                                        </p>
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                        <p style="font-size: 14px; line-height: 140%;"><span
                                                                                style="font-size: 18px; line-height: 25.2px; color: #666666;">We
                                                                                have sent you this
                                                                                email in response to your request to join our
                                                                                trading platform with this
                                                                                email.</span></p>
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                        <p
                                                                            style="font-size: 14px; line-height: 140%; text-align: center;">
                                                                            <span
                                                                                style="text-decoration: underline; line-height: 19.6px;"><span
                                                                                    style="font-size: 28px; line-height: 39.2px;"><strong>{{message}}</strong></span></span>
                                                                        </p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <table style="font-family:'Lato',sans-serif;" role="presentation"
                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;"
                                                                    align="left">
        
                                                                    <div
                                                                        style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 140%;"><span
                                                                                style="color: #888888; font-size: 14px; line-height: 19.6px;"><em><span
                                                                                        style="font-size: 16px; line-height: 22.4px;">Please
                                                                                        ignore this email if you
                                                                                        did not request to join this
                                                                                        platform.</span></em></span><br /><span
                                                                                style="color: #888888; font-size: 14px; line-height: 19.6px;"><em><span
                                                                                        style="font-size: 16px; line-height: 22.4px;"> </span></em></span>
                                                                        </p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row"
                                    style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3a534f;">
                                    <div
                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                        <div class="u-col u-col-50"
                                            style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                                            <div style="height: 100%;width: 100% !important;">
                                                <div
                                                    style="box-sizing: border-box; height: 100%; padding: 20px 20px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
        
                                                    <table style="font-family:'Lato',sans-serif;" role="presentation"
                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                                                                    align="left">
        
                                                                    <div
                                                                        style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 140%;"><span
                                                                                style="font-size: 16px; line-height: 22.4px; color: #ecf0f1;">Contact</span>
                                                                        </p>
                                                                        <p style="font-size: 14px; line-height: 140%;"><span
                                                                                style="font-size: 14px; line-height: 19.6px; color: #ecf0f1;">1000
                                                                                Addis Ababa,
                                                                                Ethiopia, FL 11223</span></p>
                                                                        <p style="font-size: 14px; line-height: 140%;"><span
                                                                                style="font-size: 14px; line-height: 19.6px; color: #ecf0f1;">+251911
                                                                                782  233 |
                                                                                firaoltulu5@gmail.com</span></p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                </div>
                                            </div>
                                        </div>
                                        <div class="u-col u-col-50"
                                            style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                                            <div style="height: 100%;width: 100% !important;">
                                                <div
                                                    style="box-sizing: border-box; height: 100%; padding: 0px 0px 0px 20px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
        
                                                    <table style="font-family:'Lato',sans-serif;" role="presentation"
                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:25px 10px 10px;font-family:'Lato',sans-serif;"
                                                                    align="left">
        
                                                                    <div align="left">
                                                                        <div style="display: table; max-width:187px;">
        
                                                                        </div>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <table style="font-family:'Lato',sans-serif;" role="presentation"
                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 10px;font-family:'Lato',sans-serif;"
                                                                    align="left">
        
                                                                    <div
                                                                        style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                        <p style="line-height: 140%; font-size: 14px;"><span
                                                                                style="font-size: 14px; line-height: 19.6px;"><span
                                                                                    style="color: #ecf0f1; font-size: 14px; line-height: 19.6px;"><span
                                                                                        style="line-height: 19.6px; font-size: 14px;">Company
                                                                                        &copy;&nbsp; All Rights
                                                                                        Reserved</span></span></span></p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: #f9f9f9">
                                <div class="u-row"
                                    style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
                                    <div
                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                        <div class="u-col u-col-100"
                                            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                            <div style="height: 100%;width: 100% !important;">
                                                <div
                                                    style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
        
                                                    <table style="font-family:'Lato',sans-serif;" role="presentation"
                                                        cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;"
                                                                    align="left">
        
                                                                    <table height="0px" align="center" border="0"
                                                                        cellpadding="0" cellspacing="0" width="100%"
                                                                        style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #1c103b;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                        <tbody>
                                                                            <tr style="vertical-align: top">
                                                                                <td
                                                                                    style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                                    <span>&#160;</span>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
        
        
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>
        
        </html>`,
            SubjectPart: "Amazon wede trading email verify",
        },
    });

    try {

        const res = await sesClient.send(createtempletecommand);
        console.log("SES templete has been created.", res);

    } catch (err) {

        console.log("Failed to create template.", err);
        return err;

    }
};

createCreateTemplateCommand("ses-wede-templete-three");