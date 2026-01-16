'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch } from 'react-icons/fi'

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue)
  const router = useRouter()

  useEffect(() => {
    setQuery(initialValue)
  }, [initialValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      router.push(`/?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, brands and more"
          className="w-full px-4 py-2.5 pl-10 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-flipkart-blue text-sm"
        />
        <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-4 bg-flipkart-yellow text-flipkart-blue rounded-r-sm hover:bg-yellow-400 transition"
        >
          <FiSearch size={18} />
        </button>
      </div>
    </form>
  )
}
