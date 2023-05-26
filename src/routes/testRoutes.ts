import { Request, Response, Router, NextFunction } from 'express'

const router = Router()

/* ======================
          GET
====================== */

router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).json({
    message: "Call to '/test' worked!"
  })
})

/* ======================
        POST
====================== */

router.post('/', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).json({
    message: "POST: '/' endpoint hit."
  })
})

/* ======================
         PATCH
====================== */

router.patch('/', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).json({
    message: "PATCH: '/' endpoint hit."
  })
})

/* ======================
          PUT
====================== */

router.put('/', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).json({
    message: "PUT: '/' endpoint hit."
  })
})

/* ======================
        DELETE
====================== */

router.delete('/', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).json({
    message: "DELETE: '/' endpoint hit."
  })
})

export default router
