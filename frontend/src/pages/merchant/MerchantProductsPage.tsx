import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { Plus, Edit2, Package, Sparkles, Check, X, AlertCircle } from 'lucide-react';

export const MerchantProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New product form
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('Edris Signature');
  const [fragranceFamily, setFragranceFamily] = useState('Oriental');
  const [concentration, setConcentration] = useState('Extrait de Parfum');
  const [volumeMl, setVolumeMl] = useState(100);
  const [price, setPrice] = useState(12500);
  const [sku, setSku] = useState('');
  const [stockQuantity, setStockQuantity] = useState(20);
  const [topNotes, setTopNotes] = useState('');
  const [heartNotes, setHeartNotes] = useState('');
  const [baseNotes, setBaseNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');

  const load = async () => {
    setLoading(true);
    const all = await api.getProducts();
    setProducts(all.filter((p) => p.merchantId === 1));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await api.saveProduct({
      name,
      brandName,
      categoryName: concentration,
      fragranceFamily,
      concentration,
      volumeMl,
      price: Number(price),
      sku: sku || `EDR-${Math.floor(100 + Math.random() * 900)}`,
      stockQuantity: Number(stockQuantity),
      topNotes,
      heartNotes,
      baseNotes,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
      shortDescription,
    });

    setIsModalOpen(false);
    // Reset form
    setName('');
    setTopNotes('');
    setHeartNotes('');
    setBaseNotes('');
    setImageUrl('');
    setShortDescription('');
    load();
  };

  const handleQuickStockUpdate = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stockQuantity + delta);
    await api.saveProduct({ id: product.id, stockQuantity: newStock });
    load();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-champagne-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
            Inventory & Catalog Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal">
            Merchant Fragrance Catalog
          </h1>
          <p className="text-xs text-gray-500 font-light mt-1">
            Manage your boutique offerings, update stock levels in real time, and register new artisanal perfumes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-gold text-xs px-5 py-2.5 font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Fragrance Flacon</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="glass-panel rounded-2xl border border-champagne-border overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-champagne-border text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Fragrance</th>
                <th className="pb-3 font-semibold">House & Family</th>
                <th className="pb-3 font-semibold">Concentration</th>
                <th className="pb-3 font-semibold">Price (ETB)</th>
                <th className="pb-3 font-semibold">Inventory Stock</th>
                <th className="pb-3 font-semibold text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const isLow = product.stockQuantity <= product.lowStockThreshold;

                return (
                  <tr key={product.id} className="hover:bg-gold-50/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-lg border border-champagne-border"
                        />
                        <div>
                          <p className="font-serif font-bold text-sm text-charcoal">{product.name}</p>
                          <p className="font-mono text-[11px] text-gray-400">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="font-medium text-charcoal">{product.brandName}</p>
                      <p className="text-[11px] text-gray-500">{product.fragranceFamily}</p>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-50 border border-gold-300 text-gold-900">
                        {product.concentration} • {product.volumeMl}ml
                      </span>
                    </td>
                    <td className="py-4 font-serif font-bold text-gold-900 text-sm">
                      {product.price.toLocaleString()} ETB
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isLow
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-green-50 text-green-700 border border-green-200'
                        }`}
                      >
                        {product.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center border border-champagne-border rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => handleQuickStockUpdate(product, -1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gold-50 font-bold"
                          title="Decrease stock"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold">{product.stockQuantity}</span>
                        <button
                          onClick={() => handleQuickStockUpdate(product, 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gold-50 font-bold"
                          title="Increase stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Fragrance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-2xl w-full glass-panel-elevated p-8 rounded-3xl border-2 border-gold-400/60 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-champagne-border">
              <h3 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-600" />
                <span>Register New Luxury Fragrance Flacon</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Fragrance Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Queen of Sheba Gold Extrait"
                    className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Brand / House</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Concentration</label>
                  <select
                    value={concentration}
                    onChange={(e) => setConcentration(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  >
                    <option value="Extrait de Parfum">Extrait de Parfum (24h+)</option>
                    <option value="Eau de Parfum">Eau de Parfum</option>
                    <option value="Eau de Toilette">Eau de Toilette</option>
                    <option value="Pure Perfume Oil">Pure Perfume Oil (Attar)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Fragrance Family</label>
                  <select
                    value={fragranceFamily}
                    onChange={(e) => setFragranceFamily(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  >
                    <option value="Oriental">Oriental & Amber</option>
                    <option value="Woody & Smoky">Woody & Smoky Oud</option>
                    <option value="Floral & Romantic">Floral & Romantic</option>
                    <option value="Gourmand Oriental">Gourmand Oriental</option>
                    <option value="Fresh & Citrus">Fresh Citrus & Bergamot</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Volume (ml)</label>
                  <input
                    type="number"
                    value={volumeMl}
                    onChange={(e) => setVolumeMl(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Price (Ethiopian Birr) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="EDR-SHEBA-100"
                    className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Initial Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Olfactory Notes */}
              <div className="space-y-2 pt-2 border-t border-champagne-border">
                <p className="font-serif font-bold text-charcoal">Olfactory Pyramid Notes</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={topNotes}
                    onChange={(e) => setTopNotes(e.target.value)}
                    placeholder="Top Notes (e.g. Bergamot, Saffron)"
                    className="px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  />
                  <input
                    type="text"
                    value={heartNotes}
                    onChange={(e) => setHeartNotes(e.target.value)}
                    placeholder="Heart Notes (e.g. Frankincense, Rose)"
                    className="px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  />
                  <input
                    type="text"
                    value={baseNotes}
                    onChange={(e) => setBaseNotes(e.target.value)}
                    placeholder="Base Notes (e.g. Oud, Bourbon Vanilla)"
                    className="px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Artisanal notes and inspiration..."
                  className="w-full px-3 py-2 bg-white border border-champagne-border rounded-lg focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-champagne-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-500 hover:text-charcoal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold text-xs px-6 py-2.5 font-semibold">
                  Publish to Boutique
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
