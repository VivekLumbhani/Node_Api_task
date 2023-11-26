const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task_alloted_to: String,
    task_desc: String,
});

module.exports = mongoose.model('Task', taskSchema);
