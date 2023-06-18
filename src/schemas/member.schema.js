const { Schema, model } = require('mongoose');

const memberSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    owner: {
        type: String,
    }
}, { timestamps: true });


memberSchema.methods.toJSON = function () {
    const member = this.toObject();
    delete member.__v;
    return member;
};

const Member = model('Member', memberSchema);
module.exports = Member;