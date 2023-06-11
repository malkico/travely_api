const mongoose = require("mongoose")
var uniqueValidator = require("mongoose-unique-validator")
const { formattedFollowersCount } = require("../utils/functions")

const influencerSchema = new mongoose.Schema(
    {
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
        timesConsulted: {
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
    },
    {
        virtuals: {
            formattedFollowersCount: {
                get: function () {
                    return formattedFollowersCount(
                        this.socialMedias.reduce(
                            (acc, socialMedia) =>
                                acc + socialMedia.followersCount,
                            0
                        )
                    )
                }
            },
            totalFollowersCount: {
                get: function () {
                    return this.socialMedias.reduce(
                        (acc, socialMedia) => acc + socialMedia.followersCount,
                        0
                    )
                }
            }
        }
    }
)

influencerSchema.set("toJSON", { virtuals: true })
influencerSchema.plugin(uniqueValidator, { type: "mongoose-unique-validator" })
const Influencer = mongoose.model("Influencer", influencerSchema)

module.exports = Influencer
