const mongoose = require('mongoose');
const User = mongoose.model('User');

class UserController {

    static getUsers() {
        return User.find();
    }

    static getUserById(id) {
        return User.findOne({ _id: id }).then((user) => {
            return user;
        }).catch((err) => {
            return { success: false, status: "User not found" }
        });
    }

    static register(email, password, isAdmin = false) {
        let user = new User({
            email: email,
            password: password,
            isAdmin: isAdmin
        });

        return user.save().then(() => {
            return { success: true }
        }).catch((err) => {
            return { success: false, status: err.errmsg }
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
                        activity: "Admin type",
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
                    return { success: true }
                }).catch((err) => {
                    return { success: false, status: err.errmsg }
                });
            }).catch((err) => {
                return { success: false, err: 'Something went wrong' }
            });
    }

    static login(email, password, ip) {
        return User.findOne({ email: email }).select('+password')
            .then(async (user) => {

                let isMatch = await user.comparePassword(password);

                user.userActivity.push({
                    ip: ip,
                    activity: "login",
                    activityType: isMatch
                });
                user.save();

                user = user.toObject();
                delete user['password'];

                if (isMatch) {
                    return { success: true, user: user }
                } else {
                    return { success: false, err: "Wrong password" }
                }
            }).catch((err) => {
                return { success: false, err: 'Something went wrong' }
            });
    }

}

module.exports = UserController;