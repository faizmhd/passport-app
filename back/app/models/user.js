let mongoose = require('mongoose');
let bcrypt   = require('bcrypt-nodejs');
let jwt      = require('jsonwebtoken');
let jwt_secret = require('../../config/config');

// Define the User Schema
let userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.generateJWT = (mail) => {
    const today = new Date();
    // JWT Token expires 15 minutes after the creation
    const expirationDate = new Date(today); 
    expirationDate.setMinutes(today.getMinutes() + 15);

    return jwt.sign({
        email: mail,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, jwt_secret.secret);
}

module.exports = mongoose.model('User', userSchema);