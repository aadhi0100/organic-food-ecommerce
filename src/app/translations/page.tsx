'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { localeMessages, supportedLanguages, DEFAULT_LANGUAGE, type Language } from '@/lib/i18n'
import { Search, Download, Upload, Eye, EyeOff, Check, X, AlertCircle, Copy, Trash2, Save } from 'lucide-react'

interface TranslationEntry {
  key: string
  translations: Record<Language, string | undefined>
  status: Record<Language, 'complete' | 'missing' | 'fallback'>
  isEditing: Record<Language, boolean>
  editValue: Record<Language, string>
}

interface FilterOptions {
  language: Language | 'all'
  status: 'all' | 'complete' | 'missing' | 'fallback'
  searchTerm: string
}

export default function TranslationsPage() {
  const { t, language } = useLanguage()
  const [entries, setEntries] = useState<TranslationEntry[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    language: 'all',
    status: 'all',
    searchTerm: '',
  })
  const [viewMode, setViewMode] = useState<'table' | 'preview'>('table')
  const [previewLanguage, setPreviewLanguage] = useState<Language>('en')
  const [showStats, setShowStats] = useState(true)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())

  // Initialize entries from locale messages
  useEffect(() => {
    const allKeys = new Set<string>()
    supportedLanguages.forEach(lang => {
      Object.keys(localeMessages[lang]).forEach(key => allKeys.add(key))
    })

    const newEntries: TranslationEntry[] = Array.from(allKeys).map(key => ({
      key,
      translations: Object.fromEntries(
        supportedLanguages.map(lang => [lang, localeMessages[lang][key]])
      ) as Record<Language, string | undefined>,
      status: Object.fromEntries(
        supportedLanguages.map(lang => {
          const value = localeMessages[lang][key]
          const enValue = localeMessages.en[key]
          return [
            lang,
            !value
              ? 'missing'
              : value === enValue
                ? 'fallback'
                : 'complete',
          ]
        })
      ) as Record<Language, 'complete' | 'missing' | 'fallback'>,
      isEditing: Object.fromEntries(supportedLanguages.map(lang => [lang, false])) as Record<Language, boolean>,
      editValue: Object.fromEntries(supportedLanguages.map(lang => [lang, ''])) as Record<Language, string>,
    }))

    setEntries(newEntries)
  }, [])

  // Calculate statistics
  const stats = useMemo(() => {
    const langStats = {
      total: { complete: 0, missing: 0, fallback: 0 },
      ...Object.fromEntries(supportedLanguages.map(lang => [lang, { complete: 0, missing: 0, fallback: 0 }])),
    } as Record<Language | 'total', { complete: number; missing: number; fallback: number }>

    entries.forEach(entry => {
      supportedLanguages.forEach(lang => {
        const status = entry.status[lang]
        langStats[lang][status]++
        langStats.total[status]++
      })
    })

    return langStats
  }, [entries])

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Search filter
      if (filters.searchTerm && !entry.key.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false
      }

      // Status filter
      if (filters.status !== 'all') {
        const langs = filters.language === 'all' ? supportedLanguages : [filters.language as Language]
        const hasStatus = langs.some(lang => entry.status[lang] === filters.status)
        if (!hasStatus) return false
      }

      // Language-specific filtering
      if (filters.language !== 'all' && filters.status !== 'all') {
        const status = entry.status[filters.language as Language]
        if (status !== filters.status) return false
      }

      return true
    })
  }, [entries, filters])

  // Calculate completion percentage per language
  const completionPercentage = useCallback(
    (lang: Language) => {
      const langStats = stats[lang]
      const total = langStats.complete + langStats.missing + langStats.fallback
      return total === 0 ? 0 : Math.round((langStats.complete / total) * 100)
    },
    [stats]
  )

  // Handle inline edit
  const handleEditStart = (key: string, lang: Language) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.key === key
          ? {
              ...entry,
              isEditing: { ...entry.isEditing, [lang]: true },
              editValue: { ...entry.editValue, [lang]: entry.translations[lang] || '' },
            }
          : entry
      )
    )
  }

  // Handle edit cancel
  const handleEditCancel = (key: string, lang: Language) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.key === key
          ? {
              ...entry,
              isEditing: { ...entry.isEditing, [lang]: false },
              editValue: { ...entry.editValue, [lang]: '' },
            }
          : entry
      )
    )
  }

  // Handle edit save
  const handleEditSave = (key: string, lang: Language, newValue: string) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.key === key
          ? {
              ...entry,
              translations: { ...entry.translations, [lang]: newValue },
              isEditing: { ...entry.isEditing, [lang]: false },
              editValue: { ...entry.editValue, [lang]: '' },
              status: {
                ...entry.status,
                [lang]: newValue ? 'complete' : 'missing',
              },
            }
          : entry
      )
    )
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedKeys.size === 0) return
    const confirmed = window.confirm(`Delete ${selectedKeys.size} translation keys? This cannot be undone.`)
    if (!confirmed) return
    setEntries(prev => prev.filter(entry => !selectedKeys.has(entry.key)))
    setSelectedKeys(new Set())
  }

  // Handle export
  const handleExport = () => {
    const exportData = {
      ...Object.fromEntries(supportedLanguages.map(lang => [lang, {} as Record<string, string>])),
    } as Record<Language, Record<string, string>>
    supportedLanguages.forEach(lang => {
      entries.forEach(entry => {
        if (entry.translations[lang]) {
          exportData[lang][entry.key] = entry.translations[lang]!
        }
      })
    })

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `translations-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Handle import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        const updates: Record<string, TranslationEntry> = {}

        entries.forEach(entry => {
          updates[entry.key] = { ...entry }
        })

        Object.entries(imported).forEach(([lang, translations]: [string, any]) => {
          if (supportedLanguages.includes(lang as Language)) {
            Object.entries(translations).forEach(([key, value]: [string, any]) => {
              if (!updates[key]) {
                updates[key] = {
                  key,
                  translations: Object.fromEntries(supportedLanguages.map(l => [l, undefined])) as Record<Language, string | undefined>,
                  status: Object.fromEntries(supportedLanguages.map(l => [l, 'missing'])) as Record<Language, 'complete' | 'missing' | 'fallback'>,
                  isEditing: Object.fromEntries(supportedLanguages.map(l => [l, false])) as Record<Language, boolean>,
                  editValue: Object.fromEntries(supportedLanguages.map(l => [l, ''])) as Record<Language, string>,
                }
              }
              updates[key].translations[lang as Language] = String(value)
              updates[key].status[lang as Language] = 'complete'
            })
          }
        })

        setEntries(Object.values(updates))
        alert('Translations imported successfully!')
      } catch {
        alert('Error importing translations. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const getStatusIcon = (status: 'complete' | 'missing' | 'fallback') => {
    switch (status) {
      case 'complete':
        return <Check className="w-4 h-4 text-green-500" />
      case 'missing':
        return <X className="w-4 h-4 text-red-500" />
      case 'fallback':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: 'complete' | 'missing' | 'fallback') => {
    switch (status) {
      case 'complete':
        return 'bg-green-50 border-green-200'
      case 'missing':
        return 'bg-red-50 border-red-200'
      case 'fallback':
        return 'bg-yellow-50 border-yellow-200'
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8 ${language !== 'en' ? 'font-sans' : ''}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">🌐 Translation Management</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage and organize all your application translations</p>
      </div>

      {/* Stats Section */}
      {showStats && (
        <div className="max-w-7xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {supportedLanguages.map(lang => {
            const langStats = (stats as any)[lang]
            const percentage = completionPercentage(lang)
            return (
              <div key={lang} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{lang.toUpperCase()}</span>
                  <span className="text-sm font-bold text-blue-600">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>✓ Complete:</span>
                    <span className="font-semibold">{langStats.complete}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>✗ Missing:</span>
                    <span className="font-semibold text-red-600">{langStats.missing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>⚠ Fallback:</span>
                    <span className="font-semibold text-yellow-600">{langStats.fallback}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Controls */}
      <div className="max-w-7xl mx-auto mb-8 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search keys..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              value={filters.searchTerm}
              onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>

          {/* Language Filter */}
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            value={filters.language}
            onChange={e => setFilters(prev => ({ ...prev, language: e.target.value as Language | 'all' }))}
          >
            <option value="all">All Languages</option>
            {supportedLanguages.map(lang => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            value={filters.status}
            onChange={e => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
          >
            <option value="all">All Status</option>
            <option value="complete">✓ Complete</option>
            <option value="missing">✗ Missing</option>
            <option value="fallback">⚠ Fallback</option>
          </select>

          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'preview' : 'table')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            {viewMode === 'table' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {viewMode === 'table' ? 'Preview' : 'Table'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <label className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold cursor-pointer flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            Import JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          {selectedKeys.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete {selectedKeys.size} Selected
            </button>
          )}
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors ml-auto"
          >
            {showStats ? 'Hide' : 'Show'} Stats
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-32">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedKeys.size === filteredEntries.length && filteredEntries.length > 0}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedKeys(new Set(filteredEntries.map(e => e.key)))
                          } else {
                            setSelectedKeys(new Set())
                          }
                        }}
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Key</th>
                    {supportedLanguages.map(lang => (
                      <th key={lang} className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                        {lang.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, idx) => (
                    <tr
                      key={entry.key}
                      className={`border-b border-gray-200 dark:border-slate-600 ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-700 dark:bg-opacity-50'}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedKeys.has(entry.key)}
                          onChange={e => {
                            const newSelected = new Set(selectedKeys)
                            if (e.target.checked) {
                              newSelected.add(entry.key)
                            } else {
                              newSelected.delete(entry.key)
                            }
                            setSelectedKeys(newSelected)
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                        {entry.key}
                      </td>
                      {supportedLanguages.map(lang => {
                        const status = entry.status[lang]
                        const isEditing = entry.isEditing[lang]
                        const value = entry.translations[lang]
                        const editValue = entry.editValue[lang]

                        return (
                          <td key={lang} className={`px-4 py-3 border-l border-gray-200 dark:border-slate-600 ${getStatusColor(status)}`}>
                            {isEditing ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-slate-700 dark:text-white"
                                  value={editValue}
                                  onChange={e => {
                                    setEntries(prev =>
                                      prev.map(en =>
                                        en.key === entry.key
                                          ? { ...en, editValue: { ...en.editValue, [lang]: e.target.value } }
                                          : en
                                      )
                                    )
                                  }}
                                />
                                <button
                                  onClick={() => handleEditSave(entry.key, lang, editValue)}
                                  className="p-1 bg-green-500 hover:bg-green-600 text-white rounded"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditCancel(entry.key, lang)}
                                  className="p-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div
                                className="flex items-start gap-2 group cursor-pointer"
                                onClick={() => handleEditStart(entry.key, lang)}
                              >
                                {getStatusIcon(status)}
                                <span className="text-sm text-gray-900 dark:text-gray-100 flex-1 break-words max-w-xs">
                                  {value || <span className="text-gray-400 italic">undefined</span>}
                                </span>
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredEntries.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold">No translations found</p>
                <p className="text-sm">Try adjusting your filters or search term</p>
              </div>
            )}
          </div>

          {/* Pagination Info */}
          <div className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
            Showing {filteredEntries.length} of {entries.length} translation keys
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {viewMode === 'preview' && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select language to preview:
              </label>
              <select
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                value={previewLanguage}
                onChange={e => setPreviewLanguage(e.target.value as Language)}
              >
                {supportedLanguages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview Content */}
            <div className={`bg-gray-50 dark:bg-slate-700 rounded-lg p-8 space-y-4 font-${previewLanguage}`}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredEntries[0]?.translations[previewLanguage] || 'Home'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredEntries.slice(0, 12).map(entry => (
                  <div key={entry.key} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-1">{entry.key}</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {entry.translations[previewLanguage] || entry.translations['en'] || entry.key}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
