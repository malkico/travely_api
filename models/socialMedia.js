const mongoose = require("mongoose")
const { formattedFollowersCount } = require("../utils/functions")

const socialMediaSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true
        },
        followersCount: {
            type: Number,
            required: true
        }
    },
    {
        virtuals: {
            formattedFollowersCount: {
                get: function () {
                    return formattedFollowersCount(this.followersCount)
                }
            }
        }
    }
)

socialMediaSchema.set("toJSON", { virtuals: true })

const SocialMedia = mongoose.model("SocialMedia", socialMediaSchema)
module.exports = SocialMedia
