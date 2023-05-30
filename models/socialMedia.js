const mongoose = require("mongoose")

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
                    const number = this.followersCount

                    if (number < 1000) {
                        return number.toString()
                    } else if (number >= 1000 && number < 1000000) {
                        return (number / 1000).toFixed(1) + "k"
                    } else if (number >= 1000000) {
                        return (number / 1000000).toFixed(1) + "m"
                    }
                }
            }
        }
    }
)

socialMediaSchema.set("toJSON", { virtuals: true })

const SocialMedia = mongoose.model("SocialMedia", socialMediaSchema)
module.exports = SocialMedia
