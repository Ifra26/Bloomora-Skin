import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/ProductCard';
import FormulationTicket from '../components/FormulationTicket';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [hero, setHero] = useState(null);
  const { categories } = useCategories();

  useEffect(() => {
    api.get('/products?sort=rating&limit=8').then((data) => {
      setFeatured(data.items);
      setHero(data.items[0]);
    });
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Formulated openly, batch by batch</span>
            <h1 className="hero-title">
              Skincare that reads its own label to you.
            </h1>
            <p className="hero-sub">
              Every Bloomora product is published like a formulation sheet — the botanical,
              the percentage, the batch it came from. Saffron, sandalwood, turmeric, neem: named,
              not hinted at.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">Shop the range</Link>
              <Link to="/about" className="btn btn-outline">Read our formulation policy</Link>
            </div>
          </div>
          <div className="hero-visual">
            {hero && (
              <div className="hero-ticket-wrap">
                <img src={hero.images?.[0]} alt={hero.name} className="hero-image" />
                <div className="hero-ticket-float">
                  <p className="ticket-product-name">{hero.name}</p>
                  <FormulationTicket product={hero} compact />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Shop by concern</span>
            <h2>Five categories, nothing that doesn't earn its shelf.</h2>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link key={c.id} to={`/products?category=${c.id}`} className="category-tile">
              <span className="category-name">{c.name}</span>
              <span className="category-desc">{c.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Best rated</span>
            <h2>What customers reorder most.</h2>
          </div>
          <Link to="/products" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="promise-strip">
        <div className="container promise-grid">
          <div>
            <span className="eyebrow">01</span>
            <p>Named botanicals only — no "proprietary blend" on any label.</p>
          </div>
          <div>
            <span className="eyebrow">02</span>
            <p>Small batches, dated and numbered, made in Karachi.</p>
          </div>
          <div>
            <span className="eyebrow">03</span>
            <p>Cash on delivery across Pakistan, or bank transfer at checkout.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
