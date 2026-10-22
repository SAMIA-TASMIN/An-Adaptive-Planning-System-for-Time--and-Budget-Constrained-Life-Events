import * as studentService from '../services/student.service.js'
import { success } from '../utils/response.js'

export const getStudents = (req, res) =>
    success(res, studentService.getAll(), 'Students fetched')

export const getStudent = (req, res) =>
    success(res, studentService.getById(Number(req.params.id)), 'Student fetched')

export const createStudent = (req, res) =>
    success(res, studentService.create(req.body), 'Student created', 201)