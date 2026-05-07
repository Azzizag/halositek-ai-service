import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';
import './ProductsPage.css';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
];

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: 'Over $500', min: 500, max: Infinity },
];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by price
    const range = priceRanges[selectedPriceRange];
    result = result.filter(p => p.price >= range.min && p.price <= range.max);

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategory, selectedPriceRange, sortBy, searchQuery]);

  return (
    <div className="products-page page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
          </h1>
        </div>

        <div className="products-layout">
          <aside className="products-sidebar">
            {/* Categories */}
            <div className="filter-section">
              <h3>Categories</h3>
              <label className={`filter-option ${selectedCategory === 'all' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === 'all'}
                  onChange={() => setSelectedCategory('all')}
                />
                All Categories
              </label>
              {categories.map(cat => (
                <label key={cat.id} className={`filter-option ${selectedCategory === cat.id ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                  />
                  {cat.icon} {cat.name}
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="filter-section">
              <h3>Price Range</h3>
              {priceRanges.map((range, i) => (
                <label key={i} className={`filter-option ${selectedPriceRange === i ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === i}
                    onChange={() => setSelectedPriceRange(i)}
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </aside>

          <div className="products-main">
            <div className="products-toolbar">
              <p className="products-count">
                <SlidersHorizontal size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                Showing <strong>{filteredProducts.length}</strong> products
              </p>
              <div className="products-sort">
                <label>Sort by:</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="products-grid-main">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="no-results">
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search query.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
