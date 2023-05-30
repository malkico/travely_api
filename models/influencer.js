const mongoose = require("mongoose")
var uniqueValidator = require("mongoose-unique-validator")

const influencerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: "Email already used !"
        /* validate: {
            validator: function (value) {
                return mongoose
                    .model("Influencer")
                    .findOne({ email: value })
                    .then((doc) => !doc)
            },
            message: "Email already used !"
        } */
    },
    password: {
        type: String,
        required: true
    },
    timesContacted: {
        type: Number,
        default: 0
    },
    nextDestinations: {
        type: String
    },
    currentLocation: {
        type: String
    },
    socialMedias: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SocialMedia"
        }
    ],
    updated_at: {
        type: Date,
        default: Date.now
    }
})

influencerSchema.plugin(uniqueValidator, { type: "mongoose-unique-validator" })
const Influencer = mongoose.model("Influencer", influencerSchema)

module.exports = Influencer
