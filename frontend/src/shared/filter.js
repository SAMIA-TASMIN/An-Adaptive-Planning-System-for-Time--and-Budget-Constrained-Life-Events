// Remembers which marketplace group to open first.
// The "What we plan" buttons on the home page set it, then the Marketplace reads it once.
// Groups: All | Birthday | Farewell | Wedding | HomeDecor | Moving | Trips | Else
let category = 'All'
export const setCategory = (c) => {
  category = c
}
export const getCategory = () => category
