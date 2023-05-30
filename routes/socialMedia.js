const express = require("express")
const router = express.Router()
const axios = require("axios")
const SocialMedia = require("../models/socialMedia")

router.post("/socialMedia", async (req, res) => {
    try {
        const socialMedia = new SocialMedia({
            ...req.body
        })
        await socialMedia.save()
        res.status(201).json(socialMedia)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get("/socialMedias", async (req, res) => {
    try {
        const socialMedias = await SocialMedia.find()
        res.json(socialMedias)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.delete("/socialMedia/:id", async (req, res) => {
    try {
        const deletedSocialMedia = await SocialMedia.findByIdAndDelete(
            req.params.id
        )
        if (!deletedSocialMedia) {
            return res
                .status(404)
                .json({ message: "Social media profile not found" })
        }
        res.status(200).json({
            message: "Social media profile successfully deleted"
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
