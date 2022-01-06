const mongoose = require('mongoose');

req_String = {
    type: String,
    required: true
}

req_Number = {
    type: Number,
    required: true
}

const guildSchema = new mongoose.Schema({
    guild_id: req_Number,
    member_count: req_Number,
    total_channel_id: {
        type: Number,
        default: 0
    },
    users: [
        {
            user_id: {
                type: Number,
                default: 0
            },
            user_xp: {
                type: Number,
                default: 0
            },
            user_level: {
                type: Number,
                default: 0
            },
            user_rank: {
                type: Number,
                default: 0
            },
            user_warning: {
                type: Number,
                default: 0
            },
            user_last_message: {
                type: Number,
                default: 0
            }
        }
    ]
});

module.exports = mongoose.model('guild', guildSchema);