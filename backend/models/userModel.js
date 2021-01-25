import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

//attach login password check method to schema. compare entered password with saved password
userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
};

//encrypt password when save
userSchema.pre('save', async function(next){
    //when user profile is updated execpt the password, need to avoid hashing the hashed password. isMondified() by Mongoose can check whether data is changed.
    if(!this.isModified('password')){

        next()
    };

    const salt = await bcrypt.genSalt(10);
    //console.log('salt', salt)
    this.password = await bcrypt.hash(this.password, salt);
    //console.log('this.password', this.password)

})

const User = mongoose.model('User', userSchema);

export default User;