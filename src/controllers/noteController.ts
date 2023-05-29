import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import Note from 'models/noteModel'

/* ====================== 
      getNotes()
====================== */
// @desc Get all notes
// @route GET /notes
// @access Private

export const getNotes = async (_req: Request, res: Response) => {
  try {
    const notes = await Note.find().lean()

    // mongoose will send back an empty array if there are no notes.
    // It's unlikely that !notes will ever occur, but just in case.
    // Also, if you want it to error when it's an empty array, then do this:
    // || (Array.isArray(notes) && notes.length === 0)
    if (!notes) {
      return res.status(404).json({
        data: null,
        message: 'No notes found!',
        success: false
      })
    }

    return res.json({
      data: notes,
      message: 'Request successful!',
      success: true
    })
  } catch (err: any) {
    console.log(err)

    return res.status(500).json({
      data: null,
      message: err.message,
      success: false
    })
  }
}

/* ======================
        getNote()
====================== */
// @desc    Fetch single note
// @route   GET /notes/:id
// @access  Private

// This was not in the original tutorial, so I added it.

export const getNote = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      data: null,
      message: 'The note id is required!',
      success: false
    })
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      data: null,
      message: 'The ObjectId format is invalid!',
      success: false
    })
  }

  try {
    const note = await Note.findById(id).lean().exec()

    if (!note) {
      return res.status(404).json({
        data: null,
        message: 'Note not found!',
        success: false
      })
    }

    return res.status(200).json({
      data: note,
      message: 'Request successful!',
      success: true
    })
  } catch (err: any) {
    console.log(err.message)
    return res.status(500).send({
      data: null,
      message: err.message,
      success: false
    })
  }
}

/* ====================== 
     createNote()
====================== */
// @desc Create new note
// @route POST /notes
// @access Private

export const createNote = async (req: Request, res: Response) => {
  const { title, text } = req.body

  if (!title || !text) {
    return res.status(400).json({
      data: null,
      message: 'All fields are required',
      success: false
    })
  }

  try {
    const duplicate = await Note.findOne({
      title: new RegExp(`^${title}$`, 'i')
    })
      .lean()
      .exec()

    if (duplicate) {
      return res.status(409).json({
        data: null,
        message: 'A note with that title already exists!',
        success: false
      })
    }

    const note = await Note.create({ title, text })

    return res.status(201).json({
      data: note,
      message: 'New note created',
      success: true
    })
  } catch (err: any) {
    console.log(err)

    return res.status(500).json({
      data: null,
      message: err.message,
      success: false
    })
  }
}

/* ====================== 
      updateNote()
====================== */
// @desc Update a note
// @route PATCH /notes
// @access Private

export const updateNote = async (req: Request, res: Response) => {
  const { id, title, text } = req.body

  if (!id) {
    return res.status(400).json({
      data: null,
      message: "The note 'id' is required!",
      success: false
    })
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      data: null,
      message: 'The ObjectId format is invalid!',
      success: false
    })
  }

  try {
    const note = await Note.findById(id).exec()

    if (!note) {
      return res.status(404).json({
        data: null,
        message: 'Note not found!',
        success: false
      })
    }

    // Prohibit duplicate titles...
    if (title && typeof title === 'string') {
      const duplicate = await Note.findOne({
        title: new RegExp(`^${title}$`, 'i')
      })
        .lean()
        .exec()

      if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({
          data: null,
          message: 'That title is taken by another note!',
          success: false
        })
      }
    }

    if (title && typeof title === 'string') {
      note.title = title
    }

    if (text && typeof title === 'string') {
      note.text = text
    }

    const updatedNote = await note.save()

    return res.status(200).json({
      data: null, //# Send note back...
      message: `'${updatedNote.title}' has been updated!`,
      success: true
    })
  } catch (err: any) {
    console.log(err)

    return res.status(500).json({
      data: null,
      message: err.message,
      success: false
    })
  }
}

/* ====================== 
      deleteNote()
====================== */
// @desc Delete a note
// @route DELETE /notes
// @access Private

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({
      data: null,
      message: "Note 'id' required!",
      success: false
    })
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      data: null,
      message: 'The ObjectId format is invalid!',
      success: false
    })
  }

  try {
    const note = await Note.findById(id).exec()

    if (!note) {
      return res.status(404).json({
        data: null,
        message: 'Note not found!',
        success: false
      })
    }

    const result = await note.deleteOne()

    res.status(200).json({
      data: null, //# Sending back result is sometimes a good practice because the client can update itself without having to make another API call.
      message: `The note '${result.title}' with an id of ${result._id} has been deleted.`,
      success: true
    })
  } catch (err: any) {
    console.log(err)

    return res.status(500).json({
      data: null,
      message: err.message,
      success: false
    })
  }
}
