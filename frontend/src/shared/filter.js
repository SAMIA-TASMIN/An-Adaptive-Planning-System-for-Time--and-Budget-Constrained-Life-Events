// Remembers which marketplace category to open first.
// The "What we plan" buttons on the home page set it, then the Marketplace reads it once.
// Categories: All | Birthday | Farewell | Other (Other = every remaining event, together).
let category = 'All'
export const setCategory = (c) => {
  category = c
}
export const getCategory = () => category
