export const create = {
  title: { required: true },
  price: { required: true, type: 'number' },
  category: { oneOf: ['Birthday', 'Farewell', 'Other', 'Parties', 'Moving', 'Trips'] },
}
