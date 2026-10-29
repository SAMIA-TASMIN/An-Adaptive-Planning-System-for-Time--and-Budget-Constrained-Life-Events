// Remembers which marketplace category to open first.
// The "What we plan" buttons on the home page set it, then the Marketplace reads it once.
let category = 'All'
export const setCategory = (c: string) => { category = c }
export const getCategory = () => category
