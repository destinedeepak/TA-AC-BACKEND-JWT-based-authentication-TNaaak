var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')

var userSchema = new Schema({
    username:{type: String, required: true, unique:true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    bio:{type: String},
    image:{type: String},
    following: [{type:Schema.Types.ObjectId, ref:'User', unique:true}],
    followers: [{type:Schema.Types.ObjectId, ref:'User', unique:true}]
    // unique for followers not working 
})

userSchema.pre('save', async function(next){
    if(this.password && this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
        next()
    }else{
        next();
    }
})

userSchema.methods.verifyPassword = async function(password){
    try {
        let result = bcrypt.compare(password, this.password);
        return result;
    } catch (error) {
        return error;
    }
}

userSchema.methods.signToken =async function(){
    var payload = {userId: this.id, email: this.email};
    try {
        let token = await jwt.sign(payload, "somerandomthings");
        return token;
    } catch (error) {
        return error;
    }
}

userSchema.methods.userJSON = function(token){
    return{
        username: this.username,
        email: this.email,
        token: token
    }
}

module.exports = mongoose.model('User', userSchema);