import { Router } from 'express'

import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/noteController'

const router = Router()

// This approach applies the authMiddlware to to all routes below
// router.use(authMiddleware)

router
  .route('/')
  .get(getNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote)

// Notice how this forces us to use req.params.id (or use req.user.id)
// Thus, even though I often prefer putting ALL info in req.body, it's not
// always possible.
router.get('/:id', getNote)

export default router
