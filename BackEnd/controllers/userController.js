const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = mongoose.model('User');

class UserController {

    static getUsers() {
        return User.find()
            .then((user) => {
                return { code: 0, users: user };
            }).catch((err) => {
                return { code: -1, description: err.errmsg }
            });
    }

    static getUserById(id) {
        return User.findOne({ _id: id }).then((user) => {
            return { code: 0, users: user };
        }).catch((err) => {
            return { code: -1, description: err.errmsg }
        });
    }

    static register(email, password, isAdmin = false) {
        let user = new User({
            email: email,
            password: password,
            isAdmin: isAdmin
        });

        return user.save().then(() => {
            return { code: 0 }
        }).catch((err) => {
            return { code: -1, description: err.errmsg }
        })
    }

    static update(id, password, isAdmin, isBanned, ip) {
        return User.findOne({ _id: id})
            .then((user) => {

                if (password != null){
                    user.password = password;
                    user.userActivity.push({
                        ip: ip,
                        activity: "Password changed"
                    });
                }
                if (isAdmin != null){
                    user.isAdmin = isAdmin;
                    user.userActivity.push({
                        ip: ip,
                        activity: "Admin",
                        activityType: isAdmin
                    });
                }
                if (isBanned != null){
                    user.isBanned = isBanned;
                    user.userActivity.push({
                        ip: ip,
                        activity: "Banned",
                        activityType: isBanned
                    });
                }

                return user.save().then(() => {
                    return { code: 0, description: "Data updated" }
                }).catch((err) => {
                    return { code: -1, description: err.errmsg }
                });
            }).catch((err) => {
                return { code: -1, description: err.errmsg }
            });
    }

    static login(email, password, ip, device) {
        return User.findOne({ email: email }).select('+password')
            .then(async (user) => {

                let isMatch = await user.comparePassword(password);

                user.userActivity.push({
                    ip: ip,
                    activity: "login",
                    activityType: isMatch,
                    device: device
                });
                user.save();

                user = user.toObject();
                delete user['password'];

                const token = jwt.sign({ sub: user._id }, config.JWT_SECRET);
                if (isMatch) {
                    return { code: 0, token: token, user: user }
                } else {
                    return { code: -1, description: "Wrong password" }
                }
            }).catch((err) => {
                return { code: -1, description: err.errmsg }
            });
    }

}

module.exports = UserController;