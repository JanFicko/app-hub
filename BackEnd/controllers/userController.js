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
            return { code: 0, user: user };
        }).catch((err) => {
            return { code: -1, description: err.errmsg }
        });
    }

    static getUserByToken(token) {
        return User.findOne({ token: token}).select('+token')
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
                const token = jwt.sign({ sub: user._id }, config.JWT_SECRET);
                const isMatch = await user.comparePassword(password);

                user.token = token;
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
