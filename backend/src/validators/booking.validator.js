const payment = { method: { required: true, oneOf: ['bkash', 'nagad'] }, wallet: { required: true }, amount: { required: true, type: 'number' } }

// Hiring needs a package and a first payment.
export const create = { package: { required: true }, ...payment }
// Paying what is left (or part of it) on an existing booking.
export const pay = payment
export const status = { status: { required: true, oneOf: ['accepted', 'declined', 'in_progress', 'delivered'] } }
