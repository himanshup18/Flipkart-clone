'use client'

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="bg-white rounded-sm shadow-sm p-4 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">Filters</h3>
        {selectedCategory && (
          <button
            onClick={() => onCategoryChange('')}
            className="text-flipkart-blue text-xs font-medium hover:underline"
          >
            CLEAR ALL
          </button>
        )}
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Categories</h4>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onCategoryChange('')}
              className={`w-full text-left px-3 py-2 rounded-sm text-sm hover:bg-gray-50 transition ${
                selectedCategory === '' ? 'bg-blue-50 text-flipkart-blue font-medium' : 'text-gray-700'
              }`}
            >
              All Categories
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onCategoryChange(category.slug)}
                className={`w-full text-left px-3 py-2 rounded-sm text-sm hover:bg-gray-50 transition ${
                  selectedCategory === category.slug
                    ? 'bg-blue-50 text-flipkart-blue font-medium'
                    : 'text-gray-700'
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
