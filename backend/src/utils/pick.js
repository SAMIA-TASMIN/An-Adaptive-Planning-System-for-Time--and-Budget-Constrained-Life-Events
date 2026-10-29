// Keeps only the allowed fields, so users cannot set things like role or status.
export const pick = (obj = {}, fields = []) => Object.fromEntries(fields.filter((f) => obj[f] !== undefined).map((f) => [f, obj[f]]))
