import fs from 'fs'
import path from 'path'
import type { Transaction } from '@/types'
import { dataPath, ensureDir, readJsonFile, writeJsonFile } from '@/lib/storage'
import { IS_VERCEL, fsGet, fsSet, fsList } from '@/lib/firestoreAdapter'

const FS_TRANSACTIONS = 'transactions'

type StoredTransaction = Transaction & {
  orderTotal?: number
}

const TRANSACTIONS_ROOT = dataPath('transactions')
const TRANSACTIONS_FILE = dataPath('transactions', 'transactions.json')
const TRANSACTIONS_BY_ORDER = dataPath('transactions', 'by-order')
const TRANSACTIONS_BY_USER = dataPath('transactions', 'by-user')

function loadTransactions() {
  return readJsonFile<StoredTransaction[]>(TRANSACTIONS_FILE, [])
}

function saveTransactions(transactions: StoredTransaction[]) {
  ensureDir(TRANSACTIONS_ROOT)
  ensureDir(TRANSACTIONS_BY_ORDER)
  ensureDir(TRANSACTIONS_BY_USER)
  writeJsonFile(TRANSACTIONS_FILE, transactions)
}

function transactionFileByOrder(orderId: string) {
  return path.join(TRANSACTIONS_BY_ORDER, `${orderId}.json`)
}

function transactionFileByUser(userId: string) {
  return path.join(TRANSACTIONS_BY_USER, `${userId}.json`)
}

export const TransactionStore = {
  init: () => {
    if (IS_VERCEL) return
    ensureDir(TRANSACTIONS_ROOT)
    ensureDir(TRANSACTIONS_BY_ORDER)
    ensureDir(TRANSACTIONS_BY_USER)
    if (!fs.existsSync(TRANSACTIONS_FILE)) {
      saveTransactions([])
    }
  },

  create: async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const record: StoredTransaction = {
      ...transaction,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    }
    if (IS_VERCEL) {
      await fsSet(FS_TRANSACTIONS, record.id, record)
      return record
    }
    const transactions = loadTransactions()
    transactions.push(record)
    saveTransactions(transactions)
    writeJsonFile(transactionFileByOrder(record.orderId), record)
    writeJsonFile(transactionFileByUser(record.userId), record)
    return record
  },

  findAll: async () => {
    if (IS_VERCEL) return fsList<StoredTransaction>(FS_TRANSACTIONS)
    return loadTransactions()
  },

  findByUserId: async (userId: string) => {
    if (IS_VERCEL) {
      const all = await fsList<StoredTransaction>(FS_TRANSACTIONS)
      return all.filter((t) => t.userId === userId)
    }
    return loadTransactions().filter((transaction) => transaction.userId === userId)
  },

  findByOrderId: async (orderId: string) => {
    if (IS_VERCEL) {
      const all = await fsList<StoredTransaction>(FS_TRANSACTIONS)
      return all.find((t) => t.orderId === orderId) || null
    }
    const byFile = readJsonFile<StoredTransaction | null>(transactionFileByOrder(orderId), null)
    if (byFile) return byFile
    return loadTransactions().find((transaction) => transaction.orderId === orderId) || null
  },
}

TransactionStore.init()
