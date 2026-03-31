import fs from 'fs'
import path from 'path'
import type { Transaction } from '@/types'
import { dataPath, ensureDir, readJsonFile, writeJsonFile } from '@/lib/storage'

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
    ensureDir(TRANSACTIONS_ROOT)
    ensureDir(TRANSACTIONS_BY_ORDER)
    ensureDir(TRANSACTIONS_BY_USER)
    if (!fs.existsSync(TRANSACTIONS_FILE)) {
      saveTransactions([])
    }
  },

  create: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const transactions = loadTransactions()
    const record: StoredTransaction = {
      ...transaction,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    }
    transactions.push(record)
    saveTransactions(transactions)
    writeJsonFile(transactionFileByOrder(record.orderId), record)
    writeJsonFile(transactionFileByUser(record.userId), record)
    return record
  },

  findAll: () => {
    return loadTransactions()
  },

  findByUserId: (userId: string) => {
    return loadTransactions().filter((transaction) => transaction.userId === userId)
  },

  findByOrderId: (orderId: string) => {
    const byFile = readJsonFile<StoredTransaction | null>(transactionFileByOrder(orderId), null)
    if (byFile) return byFile
    return loadTransactions().find((transaction) => transaction.orderId === orderId) || null
  },
}

TransactionStore.init()
