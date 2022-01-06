const express = require('express');
const { message } = require('statuses');
const Guild = require('../models/guild');

const router = express.Router();

router.get('/', async (req, res) => {
    console.log('get guilds');
    try {
        const guild = await Guild.find();
        res.send(guild);
    } catch (err) {
        res.send({ message: err });
    }
});

router.get('/guild_id', async (req, res) => {
    try {
        const guild_id = await Guild.findOne({ guild_id: req.body.guild_id });
        res.send(guild_id);
    }
    catch (err) {
        res.send({ message: err });
    }
});

router.post('/', async (req, res) => {
    console.log("ok");
    const guild = new Guild(req.body);
    try {
        const savedGuild = await guild.save();
        res.send(savedGuild);
    } catch (err) {
        res.send({ message: err });
    }
});

router.get('/guild_id/member_count', async (req, res) => {
    try {
        const guild = await Guild.findOne({ guild_id: req.body.guild_id });
        res.send({ member_count: guild.member_count });
    }
    catch (err) {
        res.send({ message: err });
    }
});

router.post('/guild_id/member_count', async (req, res) => {
    const guild_id = await Guild.findOne({ guild_id: req.body.guild_id });
    const member_count = req.body.member_count;
    guild_id.member_count = member_count;
    try {
        const savedGuild = await guild_id.updateOne({ member_count: member_count });
        res.send(savedGuild);
    }
    catch (err) {
        res.send({ message: err });
    }
});

router.get('/guild_id/total_chid', async (req, res) => {
    try {
        const guild = await Guild.findOne({ guild_id: req.body.guild_id });
        res.send({ total_channel_id: guild.total_channel_id });
    }
    catch (err) {
        res.send({ message: err });
    }
});

router.post('/guild_id/total_chid', async (req, res) => {
    const guild_id = await Guild.findOne({ guild_id: req.body.guild_id });
    const total_channel_id = req.body.total_channel_id;
    guild_id.total_channel_id = total_channel_id;
    try {
        const savedGuild = await guild_id.updateOne({ total_channel_id: total_channel_id });
        res.send(savedGuild);
    }
    catch (err) {
        res.send({ message: err });
    }
});

module.exports = router;