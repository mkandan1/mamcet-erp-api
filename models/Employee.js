import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        },
    },
    password: {
        type: String,
        require: true,
    },
    roles: {
        type: [{
            type: String,
            default: 'professor',
            enum: ['admin', 'professor', 'office', 'hod', 'principal', 'registrer']
        }],
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    designation: {
        type: String,
        require: true
    },
    photo: {
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/mymamcet.appspot.com/o/mamcet%2Fusers%2FDefault.jpg'
    },
    email_verified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        default: 'active',
        enum: ['pending', 'active', 'blocked', 'archieved']
    },
    createdAt: {
        type: Number,
        default: () => Math.floor(Date.now() / 1000)
      },
      updatedAt: {
        type: Number,
        default: () => Math.floor(Date.now() / 1000)
      }
});

export const Employee = mongoose.model('employee', userSchema);