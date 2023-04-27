const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
    title: String, description: String, category: Number,
    price: Number,
    imagePath: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        }, username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("project",projectSchema);