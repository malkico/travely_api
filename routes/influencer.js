const express = require("express")
const router = express.Router()
const Influencer = require("../models/influencer")
const SocialMedia = require("../models/socialMedia")
const bcryptjs = require("bcryptjs")
const { authMiddleware } = require("../utils/authMiddleware")
const jwt = require("jsonwebtoken")

const multer = require("multer")
const upload = multer({ dest: "public/profile_pictures/" })

router.post("/influencer", async (req, res) => {
    try {
        let passwordHashed
        if (req.body.password)
            passwordHashed = await bcryptjs.hashSync(req.body.password, 10)
        else throw new Error("Password is required")

        const influencer = new Influencer({
            ...req.body,
            password: passwordHashed
        })
        await influencer.save()
        res.status(201).json(influencer)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
})

router.get("/influencers", async (req, res) => {
    try {
        const influencers = await Influencer.find().select("-password")
        res.json(influencers)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post("/influencer/login", async (req, res) => {
    try {
        console.log("email", req.body.email)
        const influencer = await Influencer.findOne({
            email: req.body.email
        }).populate("socialMedias")

        if (!influencer) {
            return res.status(404).json({
                error: "Can't find influencer with the provided information"
            })
        } else console.log("influencer", influencer)
        const isPasswordValid = await bcryptjs.compareSync(
            req.body.password,
            influencer.password
        )
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect password" })
        }

        const token = jwt.sign({ influencer }, process.env.JWT_SECRET)
        console.log("token :: ", { token })
        res.json({ token })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get("/influencer/:id", async (req, res) => {
    try {
        const influencer = await Influencer.findById(req.params.id)
            .select("-password")
            .populate("socialMedias")
        if (!influencer) {
            return res.status(404).json({
                message: "Can't find influencer with the provided information"
            })
        }
        res.json(influencer)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get("/influencer/:id/token", async (req, res) => {
    try {
        const influencer = await Influencer.findById(req.params.id)
            .select("-password")
            .populate("socialMedias")

        if (!influencer) {
            return res.status(404).json({
                message: "Can't find influencer with the provided information"
            })
        }
        const token = jwt.sign({ influencer }, process.env.JWT_SECRET)
        res.json({ token })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.put("/influencer/:_id/addSocialMedia", async (req, res) => {
    console.log("req.params._id", req.params._id)
    try {
        const influencer = await Influencer.findById(req.params._id).populate(
            "socialMedias"
        )

        if (!influencer) {
            return res.status(404).json({
                message: "Can't find influencer with the provided information"
            })
        }

        const socialMedia = new SocialMedia({
            ...req.body
        })
        await socialMedia.save()
        influencer.socialMedias.push(socialMedia)
        await influencer.save()
        const token = jwt.sign({ influencer }, process.env.JWT_SECRET)
        res.status(201).json({ token })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.put("/influencer/:id", upload.single("picture"), async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            updated_at: Date.now(),
            picture: req.file?.filename
        }

        if (req.body.password && req.body.password.length > 0) {
            const passwordHashed = await bcryptjs.hashSync(
                req.body.password,
                10
            )

            console.log("passwordHashed", passwordHashed)
            updateData.password = passwordHashed
        }

        const influencer = await Influencer.findByIdAndUpdate(
            req.params.id,
            updateData,
            { runValidators: true , new: true}
        )
            .select("-password")
            .populate("socialMedias")

        const token = jwt.sign({ influencer }, process.env.JWT_SECRET)
        res.json({ token })
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
