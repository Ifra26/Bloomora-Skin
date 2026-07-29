import { useState } from 'react';

export default function ProductForm({ product, categories, onSubmit, error }) {
  const [ingredients, setIngredients] = useState(
    product?.ingredients?.length ? product.ingredients : [{ name: '', pct: '' }]
  );
  const [imageUrl, setImageUrl] = useState(product?.images?.[0] || '');

  const addIngredientRow = () => setIngredients([...ingredients, { name: '', pct: '' }]);
  const updateIngredient = (i, key, value) => {
    const next = [...ingredients];
    next[i] = { ...next[i], [key]: value };
    setIngredients(next);
  };
  const removeIngredient = (i) => setIngredients(ingredients.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const cleanIngredients = ingredients
      .filter((ing) => ing.name.trim())
      .map((ing) => ({ name: ing.name.trim(), pct: Number(ing.pct) || 0 }));

    onSubmit({
      name: form.get('name'),
      category: form.get('category'),
      price: form.get('price'),
      stock: form.get('stock'),
      batch: form.get('batch'),
      ph: form.get('ph'),
      volume: form.get('volume'),
      description: form.get('description'),
      ingredients: cleanIngredients,
      images: imageUrl ? [imageUrl] : []
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="field">
        <label htmlFor="name">Product name</label>
        <input id="name" name="name" required defaultValue={product?.name} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" required defaultValue={product?.category}>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="volume">Volume / size</label>
          <input id="volume" name="volume" placeholder="e.g. 30ml" defaultValue={product?.volume} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="price">Price (Rs.)</label>
          <input id="price" name="price" type="number" min="1" step="0.01" required defaultValue={product?.price} />
        </div>
        <div className="field">
          <label htmlFor="stock">Stock quantity</label>
          <input id="stock" name="stock" type="number" min="0" required defaultValue={product?.stock} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="batch">Batch code</label>
          <input id="batch" name="batch" placeholder="AS-24-001" defaultValue={product?.batch} />
        </div>
        <div className="field">
          <label htmlFor="ph">pH (leave blank if N/A)</label>
          <input id="ph" name="ph" type="number" step="0.1" defaultValue={product?.ph ?? ''} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="image">Image URL</label>
        <input id="image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} defaultValue={product?.description} />
      </div>

      <div className="field">
        <label>Ingredients (formulation ticket)</label>
        {ingredients.map((ing, i) => (
          <div className="ingredient-row" key={i}>
            <input
              placeholder="Ingredient name"
              value={ing.name}
              onChange={(e) => updateIngredient(i, 'name', e.target.value)}
            />
            <input
              placeholder="% "
              type="number"
              value={ing.pct}
              onChange={(e) => updateIngredient(i, 'pct', e.target.value)}
            />
            <button type="button" onClick={() => removeIngredient(i)} aria-label="Remove ingredient">✕</button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={addIngredientRow}>+ Add ingredient</button>
      </div>

      <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 10 }}>
        {product?.id ? 'Save changes' : 'Create product'}
      </button>
    </form>
  );
}
