import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, ShieldAlert, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brandsAndModels, setBrandsAndModels] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sort States (synced with URL search params)
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || 'All');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [selectedModel, setSelectedModel] = useState<string>(searchParams.get('model') || '');
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'recommended');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Initial load of categories and brands
  useEffect(() => {
    async function loadMeta() {
      try {
        const [catsRes, bmRes] = await Promise.all([
          api.getCategories(),
          api.getBrandsAndModels()
        ]);
        setCategories(catsRes.categories);
        setBrandsAndModels(bmRes.brandsAndModels || {});
      } catch (e) {
        console.error('Failed to load shop metadata:', e);
      }
    }
    loadMeta();
  }, []);

  // Sync state when URL params change
  useEffect(() => {
    const s = searchParams.get('search') || '';
    const b = searchParams.get('brand') || 'All';
    const c = searchParams.get('category') || 'All';
    const m = searchParams.get('model') || '';
    const so = searchParams.get('sort') || 'recommended';

    setSearch(s);
    setSelectedBrand(b);
    setSelectedCategory(c);
    setSelectedModel(m);
    setSort(so);
  }, [searchParams]);

  // Load products based on query filters
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await api.getProducts({
          brand: selectedBrand === 'All' ? undefined : selectedBrand,
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          model: selectedModel || undefined,
          search: search || undefined,
          sort
        });

        let list = res.products;
        if (inStockOnly) {
          list = list.filter(p => p.stock > 0);
        }
        setProducts(list);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedBrand, selectedCategory, selectedModel, search, sort, inStockOnly]);

  // Handle Search Input submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (search.trim()) {
      newParams.set('search', search.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedModel('');
    setSearch('');
    setInStockOnly(false);
    setSort('recommended');
    setSearchParams(new URLSearchParams());
  };

  const brands = Object.keys(brandsAndModels);
  const availableModels = selectedBrand && selectedBrand !== 'All' ? brandsAndModels[selectedBrand] || [] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Shop Protection
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse precision-cut tempered glass, privacy protectors, and camera lens armor.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by device or keyword..."
              className="w-full bg-[#111827] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Control Bar: Mobile Filter Toggle + Sorting */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 bg-[#111827] border border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:text-white"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>

        <div className="text-xs text-slate-400 font-medium">
          Showing <span className="text-white font-bold tabular-nums">{products.length}</span> products
          {selectedModel && <span> for <span className="text-blue-400 font-semibold">{selectedModel}</span></span>}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-[#111827] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            categories={categories}
            brands={brands}
            selectedBrand={selectedBrand}
            setSelectedBrand={b => {
              setSelectedBrand(b);
              setSelectedModel('');
            }}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            availableModels={availableModels}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1">
            <FilterSidebar
              categories={categories}
              brands={brands}
              selectedBrand={selectedBrand}
              setSelectedBrand={b => {
                setSelectedBrand(b);
                setSelectedModel('');
              }}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              availableModels={availableModels}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Product Grid Area */}
        <div className="col-span-1 lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(p => (
                <ProductCard key={p._id} product={p} selectedModelFilter={selectedModel} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#111827] border border-slate-800 rounded-2xl space-y-4">
              <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No protection found for this selection</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                We could not find any products matching your current filters. Try resetting the filters or searching for another smartphone model.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
