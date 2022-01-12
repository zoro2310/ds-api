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
    guild_id: {
        type: String,
        required: true,
        unique: true
    },
    member_count: req_Number,
    total_channel_id: {
        type: String,
        default: 0
    },
    users: [
        {
            user_id: {
                type: String,
                default: "0"
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
                type: String,
                default: 0
            }
        }
    ]
});

module.exports = mongoose.model('guild', guildSchema);