const express = require('express');
const Guild = require('../models/guild');

const router = express.Router();

function update_level(xp) {
    var level = 0;
    while (xp >= (level + 1) * 100) {
        level++;
    }
    return level;
}


//get all guilds of a user using user id
router.get('/:user_id', async (req, res) => {
    try {
        const guilds = await Guild.find({ users: { $elemMatch: { user_id: req.params.user_id } } });
        if (guilds.length == 0) {
            res.status(404).send({ message: 'No guilds found for this user' });
            return;
        }
        res.send(guilds);
    } catch (err) {
        res.status(500).send(err);
    }
});


//get all user of a guild using guild id
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


//get user by id of a guild using guild id
router.get('/guilds/:gid/users/:uid', async (req, res) => {
    const uid = req.params.uid;
    try {
        const guild = await Guild.findOne({ guild_id: req.params.gid });
        if (!guild) {
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


//add user to a guild using guild id and user id
router.post('/add/:guild_id/:user_id', async (req, res) => {
    const user = {
        user_id: req.params.user_id,
    };
    try {
        const guild = await Guild.findOne({ guild_id: req.params.guild_id });
        if (!guild) {
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


//delete user from a guild using guild id and user id
router.post('/remove/:guild_id/:user_id', async (req, res) => {
    const uid = req.params.user_id;
    try {
        const guild = await Guild.findOne({ guild_id: req.params.guild_id });
        if (!guild) {
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


//add xp to a user using guild id and user id
router.post('/addxp/:guild_id/:user_id/:xp', async (req, res) => {
    const user_id = req.params.user_id;
    const xp = parseInt(req.params.xp);
    const guild_id = req.params.guild_id;
    try {
        const guild = await Guild.findOne({ guild_id: guild_id });
        if (!guild) {
            res.status(400).send({ message: 'guild not found' });
            return;
        }
        const user = await guild.users.find(users => users.user_id == user_id);
        if (!user) {
            res.status(400).send({ message: 'user not found' });
            return;
        }
        user.user_xp = user.user_xp + xp;
        const prev_level = user.user_level;
        user.user_level = update_level(user.user_xp);
        const current_level = user.user_level;
        const savedGuild = await guild.updateOne({ users: guild.users });
        const lv_change = prev_level != current_level ? true : false;
        const message = {
            "level_change": lv_change,
            "user_level": current_level
        }
        res.send(message);
    }
    catch (err) {
        res.send({ message: err });
    }
});


//remove xp from a user using guild id and user id
router.post('/removexp/:guild_id/:user_id/:xp', async (req, res) => {
    const user_id = req.params.user_id;
    const xp = parseInt(req.params.xp);
    const guild_id = req.params.guild_id;
    try {
        const guild = await Guild.findOne({ guild_id: guild_id });
        if (!guild) {
            res.status(400).send({ message: 'guild not found' });
            return;
        }
        const user = await guild.users.find(users => users.user_id == user_id);
        if (!user) {
            res.status(400).send({ message: 'user not found' });
            return;
        }
        user.user_xp = user.user_xp - xp;
        const prev_level = user.user_level;
        user.user_level = update_level(user.user_xp);
        const current_level = user.user_level;
        const savedGuild = await guild.updateOne({ users: guild.users });
        const lv_change = prev_level != current_level ? true : false;
        const message = {
            "level_change": lv_change,
            "user_level": current_level
        }
        res.send(message);
    }
    catch (err) {
        res.send({ message: err });
    }
});


module.exports = router;