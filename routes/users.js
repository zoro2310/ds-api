const express = require('express');
const { message } = require('statuses');
const Guild = require('../models/guild');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send({ message: 'ok' });
});

router.get('/guilds/:id', async (req, res) => {
    try {
        const guild = await Guild.findOne({ guild_id: req.params.id });
        if (!guild) {
            res.status(400).send({ message: 'Guild not found' });
            return;
        }
        res.send(guild.users);
    }
    catch (err) {
        res.send({ message: err });
    }
});


router.get('/guilds/:gid/users/:uid', async (req, res) => {
    const uid=req.params.uid;
    try {
        const guild = await Guild.findOne({ guild_id: req.params.gid });
        if(!guild) {
            res.status(400).send({ message: 'Guild not found' });
            return;
        }
        const user = await guild.users.find(users => users.user_id == uid);
        if (user) {
            res.send(user);
        } else {
            res.status(400).send({ message: 'User not found' });
        }
    }
    catch (err) {
        res.send({ message: err });
    }
});


router.post('/add/:guild_id', async (req, res) => {
    const user = req.body;
    try {
        const guild = await Guild.findOne({ guild_id: req.params.guild_id });
        if(!guild) {
            res.status(400).send({ message: 'Guild not found' });
            return;
        }
        guild.users.push(user);
        const savedGuild = await guild.updateOne({ users: guild.users });
        res.send(savedGuild);
    }
    catch (err) {
        res.send({ message: err });
    }
});

router.post('/remove/:guild_id', async (req, res) => {
    const uid = req.body.user_id;
    try {
        const guild = await Guild.findOne({ guild_id: req.params.guild_id });
        if(!guild) {
            res.status(400).send({ message: 'guild not found' });
            return;
        }
        guild.users = guild.users.filter(users => users.user_id != uid);
        const savedGuild = await guild.updateOne({ users: guild.users });
        res.send(savedGuild);
    }
    catch (err) {
        res.send({ message: err });
    }
});

router.post('/addxp/:guild_id/:user_id/:xp', async (req, res) => {
    const user_id = req.params.user_id;
    const xp = parseInt(req.params.xp);
    const guild_id = req.params.guild_id;
    try {
        const guild = await Guild.findOne({ guild_id: guild_id });
        if(!guild) {
            res.status(400).send({ message: 'guild not found' });
            return;
        }
        const user = await guild.users.find(users => users.user_id == user_id);
        if(!user) {
            res.status(400).send({ message: 'user not found' });
            return;
        }
        user.user_xp = user.user_xp+xp;
        const savedGuild = await guild.updateOne({ users: guild.users });
        res.send(savedGuild);
    }
    catch (err) {
        res.send({ message: err });
    }
});

router.post('/removexp/:guild_id/:user_id/:xp', async (req, res) => {
    const user_id = req.params.user_id;
    const xp = parseInt(req.params.xp);
    const guild_id = req.params.guild_id;
    try {
        const guild = await Guild.findOne({ guild_id: guild_id });
        if(!guild) {
            res.status(400).send({ message: 'guild not found' });
            return;
        }
        const user = await guild.users.find(users => users.user_id == user_id);
        if(!user) {
            res.status(400).send({ message: 'user not found' });
            return;
        }
        user.user_xp = user.user_xp-xp;
        const savedGuild = await guild.updateOne({ users: guild.users });
        res.send(savedGuild);
    }
    catch (err) {
        res.send({ message: err });
    }
});

module.exports = router;