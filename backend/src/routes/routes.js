import { Router } from 'express'
import { getStudents, getStudent, createStudent } from '../controllers/student.controller.js'

const router = Router()

router.get('/', getStudents)
router.get('/:id', getStudent)
router.post('/', createStudent)

export default router