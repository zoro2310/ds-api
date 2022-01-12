const express = require('express');
const Guild = require('../models/guild');

const router = express.Router();


//get all guild from db
router.get('/', async (req, res) => {
    try {
        const guild = await Guild.find();
        res.send(guild);
    } catch (err) {
        res.send({ message: err });
    }
});


//get guild by id
router.get('/:guild_id', async (req, res) => {
    try {
        const guild_id = await Guild.findOne({ guild_id: req.params.guild_id });
        if (!guild_id) {
            res.status(400).send({ message: 'Guild not found' });
            return;
        }
        res.send(guild_id);
    }
    catch (err) {
        res.send({ message: err });
    }
});


//add new guild to the db
router.post('/', async (req, res) => {
    const guild = new Guild(req.body);
    try {
        const savedGuild = await guild.save();
        res.status(200).send(savedGuild);
    } catch (err) {
        res.status(400).send({ message: err });
    }
});


//get member count of a guild
router.get('/:guild_id/member_count', async (req, res) => {
    try {
        const guild = await Guild.findOne({ guild_id: req.params.guild_id });
        res.send({ member_count: guild.member_count });
    }
    catch (err) {
        res.send({ message: err });
    }
});


//update member count of a guild
router.post('/:guild_id/member_count/:member_count', async (req, res) => {
    const member_count = req.params.member_count;
    try {
        const guild = await Guild.findOne({ guild_id: req.params.guild_id });
        if (!guild) {
            res.status(400).send({ message: 'Guild not found' });
            return;
        }
        const savedGuild = await guild.updateOne({ member_count: member_count });
        res.send(savedGuild);
    }
    catch (err) {
        res.status(405).send({ message: err });
    }
});


//add member to a guild
router.post('/:guild_id/member_count/add/:num', async (req, res) => {
    const guild_id = req.params.guild_id;
    try {
        const guild = await Guild.findOne({ guild_id: guild_id });
        if (!guild) {
            res.status(400).send({ message: 'Guild not found' });
            return;
        }
        guild.member_count++;
        const savedGuild = await guild.updateOne({ member_count: guild.member_count });
        res.send(savedGuild);
    }
    catch (err) {
        res.send({ message: err });
    }
});


//remove member to a guild
router.post('/:guild_id/member_count/remove/:num', async (req, res) => {
    const guild_id = req.params.guild_id;
    try {
        const guild = await Guild.findOne({ guild_id: guild_id });
        if (!guild) {
            res.status(400).send({ message: 'Guild not found' });
            return;
        }
        guild.member_count--;
        const savedGuild = await guild.updateOne({ member_count: guild.member_count });
        res.send(savedGuild);
    }
    catch (err) {
        res.send({ message: err });
    }
});


//get total channel id
router.get('/:guild_id/total_chid', async (req, res) => {
    try {
        const guild = await Guild.findOne({ guild_id: req.params.guild_id });
        if (!guild) {
            res.status(400).send({ message: 'Guild not found' });
            return;
        }
        res.send({ total_channel_id: guild.total_channel_id });
    }
    catch (err) {
        res.send({ message: err });
    }
});


//update total channel id
router.post('/:guild_id/total_chid/:total_channel_id', async (req, res) => {
    const total_channel_id = req.params.total_channel_id;
    try {
        const guild = await Guild.findOne({ guild_id: req.params.guild_id });
        if (!guild) {
            res.status(400).send({ message: 'Guild not found' });
            return;
        }
        guild.total_channel_id = total_channel_id;
        const savedGuild = await guild.updateOne({ total_channel_id: total_channel_id });
        res.send(savedGuild);
    }
    catch (err) {
        res.send({ message: err });
    }
});


//get rank list of a guild using guild id
router.get('/rank/:gid', async (req, res) => {
    try {
        const guild = await Guild.findOne({ guild_id: req.params.gid });
        if (!guild) {
            res.status(400).send({ message: 'Guild not found' });
            return;
        }
        const users = guild.users;
        const sorted_users = users.sort((a, b) => b.user_xp - a.user_xp);
        res.status(200).send(sorted_users);
    }
    catch (err) {
        res.status(400).send({ message: err });
    }
});


//get rank of a user using guild id and user id
router.get('/rank/:gid/:uid', async (req, res) => {
    const uid = req.params.uid;
    try {
        const guild = await Guild.findOne({ guild_id: req.params.gid });
        if (!guild) {
            res.status(400).send({ message: 'Guild not found' });
            return;
        }
        const user = await guild.users.find(users => users.user_id == uid);
        if (!user) {
            res.status(400).send({ message: 'User not found' });
            return;
        }
        const users = guild.users;
        const sorted_users = users.sort((a, b) => b.user_xp - a.user_xp);
        const rank = sorted_users.findIndex(users => users.user_id == uid) + 1;
        const message = {
            "rank": rank,
            "user_xp": user.user_xp,
            "user_level": user.user_level
        }
        res.status(200).send(message);
    }
    catch (err) {
        res.status(400).send({ message: err });
    }
});


module.exports = router;