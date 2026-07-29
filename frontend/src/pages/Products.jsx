import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategories();
  const [data, setData] = useState({ items: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (search) params.set('search', search);
    params.set('page', page);
    params.set('limit', 9);

    api
      .get(`/products?${params.toString()}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [category, sort, minPrice, maxPrice, search, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Shop</span>
          <h1>The full range</h1>
        </div>
      </div>

      <div className="filters-bar">
        <form
          className="search-box"
          onSubmit={(e) => {
            e.preventDefault();
            updateParam('search', searchInput);
          }}
        >
          <input
            type="search"
            placeholder="Search products…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>

        <select value={category} onChange={(e) => updateParam('category', e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} aria-label="Sort products">
          <option value="">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top rated</option>
          <option value="newest">Newest</option>
        </select>

        <div className="price-range">
          <input
            type="number"
            placeholder="Min Rs."
            value={minPrice}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            aria-label="Minimum price"
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max Rs."
            value={maxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            aria-label="Maximum price"
          />
        </div>
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 320 }} />
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <div className="empty-state">
          <h3>Nothing matches those filters.</h3>
          <p>Try widening your price range or clearing the search.</p>
          <button className="btn btn-outline btn-sm" onClick={() => setSearchParams({})}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="results-count">{data.total} product{data.total !== 1 ? 's' : ''}</p>
          <div className="product-grid">
            {data.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: data.totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
