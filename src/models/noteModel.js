import {} from 'mongoose'

import { Schema, model } from 'mongoose'

/* ======================
      noteSchema
====================== */

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true,
      // unique  doesn't catch case insensitivity, so 'My Title'
      // and 'mY tItle' are considered different by mongoose.
      unique: true
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

export default model('Note', noteSchema)
