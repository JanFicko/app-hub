const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = mongoose.model('User');
const ProjectController = require('../controllers/projectController');

class UserController {

    static async getUsers(token) {
        const getUserByTokenResponse = await this.getUserByToken(token);

        if (getUserByTokenResponse.code === 0 && getUserByTokenResponse.user != null && getUserByTokenResponse.user.isAdmin) {
            return User.find()
                .then(async (users) => {
                    const getUsersProjects = await ProjectController.getUsersProjects(getUserByTokenResponse.user._id);
                    if (getUsersProjects.code === 0) {
                        users.projects = getUsersProjects.projects;
                    }
                    return { code: 0, users: users };
                }).catch((err) => {
                    return { code: -1, description: err.errmsg }
                });
        } else {
            return { code: -1, description: "Unauthorized access" }
        }
    }

    static getUserById(id) {
        return User.findOne({ _id: id }).then((user) => {

            user.userActivity = user.userActivity.slice(1).slice(-50);

            return { code: 0, user: user };
        }).catch((err) => {
            return { code: -1, description: err.errmsg }
        });
    }

    static getUserByToken(token) {
        return User.findOne({ "tokens.token": token}).select('+token')
            .then((user) => {
                if (user != null) {
                    return { code: 0, user: user };
                } else {
                    return { code: 0, description: "Invalid token" };
                }
            }).catch((err) => {
                return { code: -1, description: err.errmsg }
            });
    }

    static register(email, password, isAdmin = false) {
        const user = new User({
            email: email,
            password: password,
            isAdmin: isAdmin
        });

        return user.save().then(() => {
            return { code: 0 }
        }).catch((err) => {
            return { code: -1, description: err.errmsg }
        });
    }

    static update(userId, password, isAdmin, isBanned, ip) {
        return User.findOne({ _id: userId})
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
                    if (isBanned) {
                        user.tokens = [];
                    }

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

    static log(userId, activity, activityType, ip, device) {
        return User.findOne({ _id: userId})
            .then((user) => {

                user.userActivity.push({
                    ip: ip,
                    activity: activity,
                    activityType: activityType,
                    device: device
                });

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
                const token = jwt.sign({ sub: user._id }, config.JWT_SECRET, { expiresIn: config.LOGIN_TOKEN_VALIDITY });
                const isMatch = await user.comparePassword(password);

                user.tokens.push({
                    token: token
                });
                user.userActivity.push({
                    ip: ip,
                    activity: "login",
                    activityType: isMatch,
                    device: device
                });
                user.save();

                user = user.toObject();
                delete user['password'];

                if (isMatch) {
                    if (!user.isBanned) {
                        return { code: 0, token: token, user: user }
                    } else {
                        return { code: -3, description: "Rejected access" }
                    }
                } else {
                    return { code: -2, description: "Wrong password" }
                }
            }).catch((err) => {
                return { code: -1, description: err.errmsg }
            });
    }

}

module.exports = UserController;
