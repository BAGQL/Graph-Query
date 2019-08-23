'use strict';

/** DEPENDENCIES
 * Mongoose
 */
const mongoose = require('mongoose');

/** bookshelfSchema variable
 * Creates 'bookshelf' as a new mongo schema, and defines types for bookshelfTitle, summary, and date.
 * @type {mongoose.Schema}
 */
const bookshelfSchema = new mongoose.Schema({
  title: {type:String},
  summary: {type:String},
  date: {type:Date, default:Date.now()},
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

/** Sets our schema as a model sub-type of the document type in mongoose*/
let Bookshelf =  mongoose.model('Bookshelf', bookshelfSchema);

/** Exports noteSchema for use outside of this file.*/
module.exports = Bookshelf;