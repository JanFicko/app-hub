const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false, required: true  },
    isAdmin: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    registerTime: { type: Date, default: Date.now },
    tokens: [{
        token: { type: String, select: false }
    }],
    userActivity: [{
        time: { type: Date, default: Date.now },
        ip: String,
        activity: String,
        activityType: Boolean,
        device: String
    }]
});

UserSchema.pre('save', function(next) {
    let user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    const password = this.password;
    return new Promise(function(resolve, reject) {
        bcrypt.compare(candidatePassword, password, function(err, isMatch) {
            resolve(isMatch);
        });
    })
};

const User = mongoose.model('User', UserSchema );

module.exports = { User, UserSchema };
