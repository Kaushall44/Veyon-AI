import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Tag, 
  Eye, 
  SlidersHorizontal,
  X,
  Store,
  BookOpen,
  Laptop,
  Bike,
  FlaskConical,
  Bed,
  CheckCircle2,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { marketplaceService, MarketplaceItem } from '../../services/api/marketplaceService';
import { useAuth } from '../../context/AuthContext';
import { ImageUploadZone } from '../../components/ui/ImageUploadZone';

const CATEGORIES = [
  { id: 'ALL', label: 'All Items', icon: Store },
  { id: 'TEXTBOOKS', label: '📚 Textbooks & Notes', icon: BookOpen },
  { id: 'ELECTRONICS', label: '💻 Laptops & Tech', icon: Laptop },
  { id: 'CYCLES', label: '🚲 Cycles & Mobility', icon: Bike },
  { id: 'LAB_COATS', label: '🥼 Lab Gear & Tools', icon: FlaskConical },
  { id: 'HOSTEL_ESSENTIALS', label: '🛏️ Hostel Essentials', icon: Bed },
];

const CONDITIONS = [
  { id: 'ALL', label: 'Any Condition' },
  { id: 'BRAND_NEW', label: 'Brand New' },
  { id: 'LIKE_NEW', label: 'Like New' },
  { id: 'GOOD', label: 'Good Condition' },
  { id: 'FAIR', label: 'Fair' },
];

export const MarketplacePage: React.FC = () => {
  const { user } = useAuth();

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedCondition, setSelectedCondition] = useState<string>('ALL');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [hideSold, setHideSold] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [category, setCategory] = useState<string>('TEXTBOOKS');
  const [condition, setCondition] = useState<string>('LIKE_NEW');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [sellerPhone, setSellerPhone] = useState<string>('');
  const [sellerLocation, setSellerLocation] = useState<string>('Hostel 4, Room 210');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await marketplaceService.fetchItems({
        category: activeCategory === 'ALL' ? undefined : activeCategory,
        condition: selectedCondition === 'ALL' ? undefined : selectedCondition,
        min_price: minPrice ? parseFloat(minPrice) : undefined,
        max_price: maxPrice ? parseFloat(maxPrice) : undefined,
        status: hideSold ? 'ACTIVE' : undefined,
        search: searchQuery || undefined,
        sort_by: sortBy,
      });
      setItems(data.items || []);
    } catch (err) {
      console.error('Failed to load marketplace items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [activeCategory, selectedCondition, hideSold, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadItems();
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price || !sellerLocation.trim()) {
      setModalError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setModalError(null);

    try {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        setModalError('Please enter a valid price in INR.');
        setSubmitting(false);
        return;
      }

      const created = await marketplaceService.createItem({
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        category,
        condition,
        images: imageUrl.trim() ? [imageUrl.trim()] : [],
        seller_phone: sellerPhone.trim() || undefined,
        seller_location: sellerLocation.trim(),
      });

      setItems((prev) => [created, ...prev]);
      setIsModalOpen(false);

      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setSellerPhone('');
    } catch (err: any) {
      setModalError(err.response?.data?.detail || 'Failed to list item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Controls */}
      <div className="bg-gradient-to-r from-[#152E22] via-[#1E4130] to-[#2B5741] rounded-2xl p-6 lg:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Campus Marketplace
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2 font-serif-title">
            Veyon Verified Campus Marketplace
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm mb-6 leading-relaxed">
            The trusted second-hand exchange exclusively for university students and alumni. Buy and sell textbooks, calculators, bicycles, and lab equipment with verified student credentials.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculators, books, lab coats, cycles, electronics..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 transition-all"
              />
            </form>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#FAF9F5] text-[#152E22] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-white shadow-sm hover:shadow transition-all active:scale-[0.98] shrink-0"
            >
              <Plus className="w-4 h-4 text-[#152E22]" />
              Sell an Item
            </button>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#152E22] text-white shadow-sm font-semibold'
                  : 'bg-white border border-[#EAE7DF] text-[#4A4741] hover:bg-[#FAF8F3] hover:text-[#1F1E1B]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-[#8C887B]'}`} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 2. Secondary Filter Bar (Condition, Price, Hide Sold, Sort) */}
      <div className="bg-white border border-[#EAE7DF] rounded-xl p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Condition Select */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C887B]" />
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="bg-[#FAF8F3] border border-[#EAE7DF] rounded-lg px-2.5 py-1.5 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#152E22]"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond.id} value={cond.id}>
                    {cond.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min - Max Price Inputs */}
            <div className="flex items-center gap-1.5 text-xs text-[#6C685C]">
              <span>Price:</span>
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-16 bg-[#FAF8F3] border border-[#EAE7DF] rounded-lg px-2 py-1 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-16 bg-[#FAF8F3] border border-[#EAE7DF] rounded-lg px-2 py-1 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none"
              />
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    loadItems();
                  }}
                  className="text-xs text-red-600 hover:underline ml-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Hide Sold Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#4A4741] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hideSold}
                onChange={(e) => setHideSold(e.target.checked)}
                className="rounded border-[#EAE7DF] text-[#152E22] focus:ring-0 focus:ring-offset-0"
              />
              <span>Hide Sold Items</span>
            </label>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8C887B]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#FAF8F3] border border-[#EAE7DF] rounded-lg px-2.5 py-1.5 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none"
            >
              <option value="newest">✨ Newest First</option>
              <option value="price_asc">💵 Price: Low to High</option>
              <option value="price_desc">💰 Price: High to Low</option>
              <option value="popular">🔥 Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Items Grid & Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-[#EAE7DF] rounded-2xl overflow-hidden p-4 space-y-3 animate-pulse">
              <div className="aspect-4/3 bg-[#FAF8F3] rounded-xl" />
              <div className="h-4 bg-[#EAE7DF] rounded w-3/4" />
              <div className="h-3 bg-[#FAF8F3] rounded w-1/2" />
              <div className="h-4 bg-[#FAF8F3] rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#EAE7DF] rounded-2xl p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#1F1E1B] mb-1">No items found</h3>
          <p className="text-xs text-[#6C685C] mb-6">
            There are no active campus listings matching your search or filters. Be the first to list an item!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#152E22] text-white rounded-xl text-xs font-semibold hover:bg-[#1E4130] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Sell an Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/marketplace/${item.id}`}
              className="group bg-white border border-[#EAE7DF] hover:border-[#152E22]/30 rounded-2xl overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col"
            >
              {/* Image Preview with Condition Pill Overlay */}
              <div className="relative aspect-4/3 bg-[#FAF8F3] overflow-hidden border-b border-[#EAE7DF]">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-[#1F1E1B] shadow-2xs border border-[#EAE7DF]">
                    {item.condition.replace('_', ' ')}
                  </span>
                </div>
                {item.status === 'SOLD' && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
                    <span className="px-3 py-1 bg-red-600 text-white font-bold text-xs rounded-full uppercase tracking-wider shadow">
                      SOLD
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-[#8C887B] inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.view_count}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1F1E1B] group-hover:text-[#152E22] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="text-base font-extrabold text-[#152E22]">
                    {formatPrice(item.price)}
                  </div>
                </div>

                {/* Seller & Location Footer */}
                <div className="pt-3 border-t border-[#F2EFE9] space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#4A4741]">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#1F1E1B] truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      {item.seller_name}
                    </span>
                    <span className="text-[10px] text-[#8C887B] shrink-0 font-mono">
                      {item.seller_reg_no || '2023-CSE-042'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#6C685C] truncate">
                    <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span className="truncate">{item.seller_location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 4. Create Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#EAE7DF] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE7DF] bg-[#FAF8F3] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F1E1B]">Sell an Item on Campus</h3>
                  <p className="text-[11px] text-[#6C685C]">Verified under Reg: {user?.reg_number || '2023-CSE-042'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8C887B] hover:text-[#1F1E1B] p-1 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 space-y-4 overflow-y-auto">
              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                  Item Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Casio FX-991EX Scientific Calculator"
                  className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 750"
                    className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl px-3.5 py-2 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl px-3 py-2 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                  >
                    <option value="TEXTBOOKS">📚 Textbooks & Notes</option>
                    <option value="ELECTRONICS">💻 Laptops & Tech</option>
                    <option value="CYCLES">🚲 Cycles & Mobility</option>
                    <option value="LAB_COATS">🥼 Lab Gear & Tools</option>
                    <option value="HOSTEL_ESSENTIALS">🛏️ Hostel Essentials</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl px-3 py-2 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                  >
                    <option value="BRAND_NEW">Brand New (Unopened)</option>
                    <option value="LIKE_NEW">Like New (Mint)</option>
                    <option value="GOOD">Good (Minor wear)</option>
                    <option value="FAIR">Fair (Visible use)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                    WhatsApp Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="e.g. +919876543210"
                    className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl px-3.5 py-2 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                  Campus Pickup Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={sellerLocation}
                  onChange={(e) => setSellerLocation(e.target.value)}
                  placeholder="e.g. Hostel 4, Room 210 or Library Lawn"
                  className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                  required
                />
              </div>

              <ImageUploadZone
                onImageSelected={(url) => setImageUrl(url)}
                onImageRemoved={() => setImageUrl('')}
                currentImage={imageUrl}
                label="Product Photo / Item Picture"
              />

              <div>
                <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the item's condition, reason for selling, and best times to meet on campus..."
                  className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl p-3 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE7DF]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6C685C] hover:bg-[#FAF8F3] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-[#152E22] text-white rounded-xl hover:bg-[#1E4130] shadow-sm disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Listing...' : 'List Item for Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
