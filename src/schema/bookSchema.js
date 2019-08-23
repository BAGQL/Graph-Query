'use strict';

/** DEPENDENCIES
 * Mongoose
 */
const mongoose = require('mongoose');

/** bookSchema variable
 * Creates 'savedBooks' as a new mongo schema, and defines types for bookTitle, authors, description, date and image_link.
 * @type {mongoose.Schema}
 */
const bookSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  id: {type: ObjectId},
  title: {type: String},
  authors: {type: String},
  description: {type: String},
  image_link: {type: String},
  isbn: {type: String},
  bookshelf: {type: mongoose.Schema.Types.ObjectId, ref: 'Bookshelf'}
});

let Book = mongoose.model('User', bookSchema);

/** Exports jobSchema for use outside of this file.*/
module.exports = Book;