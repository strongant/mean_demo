const mongoose = require('mongoose');
const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\w{1,30}/.test(v);
      },
      message: '{name} is not a valid name!'
    },
    required: [true, 'name is required']
  },
  value: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /[((http|https)://www\.\w/\w){1,30}]/.test(v);
      },
      message: '{value} is not a valid name!'
    },
    required: [true, 'value is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
ResourceSchema.path('name').validate(function(name) {
  return name != null;
}, 'name cannot be blank');
ResourceSchema.path('value').validate(function(value) {
  return value != null;
}, 'value cannot be blank');
ResourceSchema.methdos = {

  save: function() {
    const err = this.validateSync();
    if (err && err.toString()) throw new Error(err.toString());
    return this.save();
  },
  findByName: function(value) {
    return this.findOne({
      name: value
    });
  }
};


module.exports = mongoose.model('Resource', ResourceSchema);
