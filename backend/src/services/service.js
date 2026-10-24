import AppError from '../utils/AppError.js'

let students = [
    { id: 1, name: 'Samia', email: 'samia@mail.com' },
    { id: 2, name: 'Anika', email: 'anika@mail.com' },
]

export const getAll = () => students

export const getById = (id) => {
    const student = students.find((s) => s.id === id)
    if (!student) throw new AppError('Student not found', 404)
    return student
}

export const create = ({ name, email }) => {
    if (!name || !email) throw new AppError('Name and email are required', 400)
    const student = { id: students.length + 1, name, email }
    students.push(student)
    return student
}