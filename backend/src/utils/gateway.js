import crypto from 'node:crypto'

// ---------------------------------------------------------------------------------------------
// Payment gateway for bKash and Nagad.
//
// This is a SANDBOX: it validates nothing with the wallet company and moves no real money. It only
// returns a transaction id shaped like a real one, so the whole booking and payment flow works.
//
// To go live, replace the body of charge() with the real call and keep the same input and output:
//   bKash  -> "Tokenized Checkout" API (create payment, then execute payment)
//   Nagad  -> Nagad Payment Gateway API (initialize, then complete)
// Both need a merchant account and API keys from the wallet company. Put the keys in the
// environment variables (never in the code) and read them through config/env.js.
// ---------------------------------------------------------------------------------------------
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
const code = (n) => Array.from(crypto.randomBytes(n), (b) => ALPHABET[b % ALPHABET.length]).join('')

export async function charge({ method }) {
  return { trxId: (method === 'bkash' ? 'BK' : 'NG') + code(8) }
}

export const receiptNumber = () => {
  const d = new Date()
  const day = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `RCP-${day}-${code(6)}`
}
