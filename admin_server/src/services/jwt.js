const { createHmac } = require('node:crypto');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const {
    existsUserWithId,
    existsUserWithEmail,
} = require("../models/user/User.model");

const JWT_SECRET = process.env.JWT_SECRET;
const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET;
const IMAGE_LINK = process.env.IMAGE_LINK;

const checkPassword = async (password, PasswordHash) => {
    try {

        const hashpassword = createHmac('sha256', PASSWORD_HASH_SECRET).update(password).digest('hex');
        return hashpassword === PasswordHash;
        // return password === PasswordHash;
    } catch (error) {
        return false;
    }
};

const createsign = async (user) => {
    try {

        const hash = createHmac('sha256', PASSWORD_HASH_SECRET).update(user.PasswordHash).digest('hex');

        const locuser = Object.assign({}, {

            FirstName: user.FirstName,
            MiddleName: user.MiddleName,
            LastName: user.LastName,
            AddedDate: user.AddedDate,
            Email: user.Email,
            UserID: user._id,
            Password: hash,

            IsActive: user.IsActive,

            Roles: user.Roles,
            Allow_Modules: user.Allow_Modules,

            IsBanned: user.IsBanned,

            Company: user.Company,

        });

        const token = jwt.sign(
            {
                // exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
                ...locuser
            },
            JWT_SECRET,
            { expiresIn: '7d' }
            // alternatively you can use the `expiresIn` option: { expiresIn: '7d' }
        );

        return { token, user: locuser };


    } catch (error) {
        return { token: "", user: null };
    }

};

const verifySign = async (token) => {
    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.exp < Math.floor(Date.now() / 1000)) {
            return { user: null };
        }

        const user = await existsUserWithId(decoded.UserID);

        // const hash_password = createHmac('sha256', PASSWORD_HASH_SECRET).update(user.PasswordHash).digest('hex');

        const pass_correct = await checkPassword(user.PasswordHash, decoded.Password);

        if (pass_correct && user.IsActive) {

            const loc_user = Object.assign({}, {
                Id: user._id,
                UserID: user.UserID,
                FirstName: user.FirstName,
                MiddleName: user.MiddleName,
                LastName: user.LastName,
                Email: user.Email,
                AddedDate: user.AddedDate,
                ModifiedDate: user.ModifiedDate,
                IsActive: user.IsActive,
                Company: user.Company,


                Roles: user.Roles,
                Allow_Modules: user.Allow_Modules,

                IsBanned: user.IsBanned,

            });

            return { user: loc_user };
        }
        else {
            return { user: null };
        }


    } catch (err) {

        return { user: null };

    }

};

const getuser = async (UserID) => {
    try {
        const user = await existsUserWithId(UserID);
        if (user) {

            // const loc_user = Object.assign({}, {
            //     FirstName: user.FirstName,
            //     LastName: user.LastName,
            //     AddedDate: user.AddedDate,
            //     Email: user.Email,
            //     UserID: user.UserID,
            //     IsActive: user.IsActive,

            //     About: user?.About,
            //     City: user?.City,
            //     Country: user?.Country,
            //     State: user?.State,
            //     IsPublic: user?.IsPublic,

            //     Facebook_Link: user?.Facebook_Link,
            //     Instagram_Link: user?.Instagram_Link,
            //     Linkdin_Link: user?.Linkdin_Link,
            //     Twitter_Link: user?.Twitter_Link,

            //     PhotoURL: `${IMAGE_LINK}${user?.Profile_Photos[user.Profile_Photos.length - 1]?.ImageID}`,

            //     Roles: user?.Roles,

            //     IsBanned: user?.IsBanned,

            // });

            // return { user: loc_user };
        }
        else {
            return { user: null };
        }

    } catch (error) {
        return { user: null };
    }
};


module.exports = {
    createsign,
    verifySign,
    getuser,
    checkPassword
};