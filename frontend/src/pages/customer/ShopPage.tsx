import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/customer/ProductCard';
import { api } from '../../services/api';
import { Product, Category, Brand } from '../../types';
import { Search, SlidersHorizontal, X, Sparkles, Filter } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');
  const [selectedConcentration, setSelectedConcentration] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [p, c, b] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getBrands(),
      ]);
      setProducts(p);
      setCategories(c);
      setBrands(b);
    };
    load();
  }, []);

  // Sync url param
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const search = searchParams.get('search');
    if (search) setSearchTerm(search);
  }, [searchParams]);

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    // Search
    if (
      searchTerm &&
      !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.topNotes?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Category
    if (selectedCategory !== 'all') {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat && product.categoryName !== cat.name) {
        return false;
      }
    }

    // Brand
    if (selectedBrand !== 'all') {
      const br = brands.find((b) => b.slug === selectedBrand);
      if (br && product.brandName !== br.name) {
        return false;
      }
    }

    // Concentration
    if (selectedConcentration !== 'all' && product.concentration !== selectedConcentration) {
      return false;
    }

    return true;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg;
    return b.isFeatured ? 1 : -1;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedConcentration('all');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
          Haute Perfumery Boutique
        </span>
        <h1 className="font-serif text-4xl font-bold text-charcoal">
          The Fragrance Collection
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
          Explore artisanal extraits, rare Cambodian ouds, and French niche perfumes. All certified authentic, priced in Ethiopian Birr (ETB), with white-glove doorstep delivery.
        </p>
      </div>

      {/* Search & Mobile Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-champagne-border">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search notes, oud, extrait..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white/80 border border-champagne-border rounded-xl focus:outline-none focus:border-gold-500"
          />
          <Search className="w-4 h-4 text-gold-600 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Sort & Filter Toggle */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-3 py-2 bg-white border border-champagne-border rounded-xl font-medium focus:outline-none focus:border-gold-500 text-charcoal"
            >
              <option value="featured">Featured Collection</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-gold-50 border border-gold-300 rounded-xl text-xs font-medium text-gold-900"
          >
            <Filter className="w-4 h-4 text-gold-600" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout (Sidebar Filters + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
          <div className="glass-panel p-6 rounded-2xl border border-champagne-border space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-champagne-border/70">
              <h3 className="font-serif font-bold text-sm text-charcoal flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold-600" />
                <span>Refine Collection</span>
              </h3>
              {(selectedCategory !== 'all' || selectedBrand !== 'all' || selectedConcentration !== 'all' || searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-red-500 hover:text-red-700 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Fragrance Family Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-800">
                Fragrance Family
              </h4>
              <div className="space-y-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                    className="text-gold-600 focus:ring-gold-500"
                  />
                  <span className={selectedCategory === 'all' ? 'font-semibold text-charcoal' : 'text-gray-600'}>
                    All Families
                  </span>
                </label>
                {categories.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === c.slug}
                      onChange={() => setSelectedCategory(c.slug)}
                      className="text-gold-600 focus:ring-gold-500"
                    />
                    <span className={selectedCategory === c.slug ? 'font-semibold text-charcoal' : 'text-gray-600'}>
                      {c.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2 pt-4 border-t border-champagne-border/60">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-800">
                Perfume House / Brand
              </h4>
              <div className="space-y-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === 'all'}
                    onChange={() => setSelectedBrand('all')}
                    className="text-gold-600 focus:ring-gold-500"
                  />
                  <span className={selectedBrand === 'all' ? 'font-semibold text-charcoal' : 'text-gray-600'}>
                    All Houses
                  </span>
                </label>
                {brands.map((b) => (
                  <label key={b.id} className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === b.slug}
                      onChange={() => setSelectedBrand(b.slug)}
                      className="text-gold-600 focus:ring-gold-500"
                    />
                    <span className={selectedBrand === b.slug ? 'font-semibold text-charcoal' : 'text-gray-600'}>
                      {b.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Concentration Filter */}
            <div className="space-y-2 pt-4 border-t border-champagne-border/60">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-800">
                Concentration
              </h4>
              <div className="space-y-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="concentration"
                    checked={selectedConcentration === 'all'}
                    onChange={() => setSelectedConcentration('all')}
                    className="text-gold-600 focus:ring-gold-500"
                  />
                  <span className={selectedConcentration === 'all' ? 'font-semibold text-charcoal' : 'text-gray-600'}>
                    All Concentrations
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="concentration"
                    checked={selectedConcentration === 'Extrait de Parfum'}
                    onChange={() => setSelectedConcentration('Extrait de Parfum')}
                    className="text-gold-600 focus:ring-gold-500"
                  />
                  <span className={selectedConcentration === 'Extrait de Parfum' ? 'font-semibold text-charcoal' : 'text-gray-600'}>
                    Extrait de Parfum (24h+)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="concentration"
                    checked={selectedConcentration === 'Eau de Parfum'}
                    onChange={() => setSelectedConcentration('Eau de Parfum')}
                    className="text-gold-600 focus:ring-gold-500"
                  />
                  <span className={selectedConcentration === 'Eau de Parfum' ? 'font-semibold text-charcoal' : 'text-gray-600'}>
                    Eau de Parfum
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-charcoal">{sortedProducts.length}</span> luxury fragrances
            </p>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="glass-panel p-16 rounded-2xl border border-champagne-border text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gold-100 flex items-center justify-center text-gold-700">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">
                No matching fragrances found
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Try loosening your filters or search terms to explore other pieces from our collection.
              </p>
              <button onClick={resetFilters} className="btn-gold text-xs">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
