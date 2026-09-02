import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Calendar, 
  Tag, 
  Building, 
  Share2, 
  User as UserIcon,
  X,
  Phone,
  Clock,
  Sparkles,
  Shield,
  ExternalLink,
  Check
} from 'lucide-react';
import { marketplaceService, MarketplaceItem } from '../../services/api/marketplaceService';
import { useAuth } from '../../context/AuthContext';

export const ItemDetailPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('');
  const [submittingReport, setSubmittingReport] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const loadItemDetail = async () => {
    if (!itemId) return;
    setLoading(true);
    try {
      const data = await marketplaceService.getItemDetail(itemId);
      setItem(data);
    } catch (err) {
      console.error('Failed to load item detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItemDetail();
  }, [itemId]);

  const handleToggleSold = async () => {
    if (!item) return;
    const newStatus = item.status === 'ACTIVE' ? 'SOLD' : 'ACTIVE';
    setUpdatingStatus(true);
    try {
      await marketplaceService.updateItemStatus(item.id, newStatus);
      setItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !reportReason.trim()) return;
    setSubmittingReport(true);
    try {
      await marketplaceService.reportItem(item.id, reportReason.trim());
      setReportSuccess(true);
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportSuccess(false);
        setReportReason('');
      }, 1500);
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently listed';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently listed';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-8 animate-pulse">
        <div className="h-6 bg-[#EAE7DF] rounded w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-square bg-[#FAF8F3] rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-[#EAE7DF] rounded w-3/4" />
            <div className="h-6 bg-[#FAF8F3] rounded w-1/3" />
            <div className="h-24 bg-[#FAF8F3] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <h3 className="text-base font-bold text-[#1F1E1B] mb-2">Item not found</h3>
        <p className="text-xs text-[#6C685C] mb-6">This listing might have been removed or marked as sold.</p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#152E22] text-white text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const isSeller = user?.id === item.seller_id || user?.role === 'Admin' || (user?.name && user.name === item.seller_name);
  const images = item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80'];
  const activeImage = images[selectedImageIndex] || images[0];

  // WhatsApp prefilled link
  const rawPhone = item.seller_profile?.seller_phone || '+919876543210';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(
    `Hi ${item.seller_name}, I saw your listing for '${item.title}' (${formatPrice(item.price)}) on Veyon Campus Marketplace. Is it still available to pick up at ${item.seller_location}?`
  );
  const whatsappUrl = item.contact_links?.whatsapp || `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
  const emailUrl = item.contact_links?.email || `mailto:${item.seller_profile?.seller_email || 'student@soa.ac.in'}?subject=${encodeURIComponent(`Inquiry: ${item.title} on Veyon Marketplace`)}&body=${encodedMsg}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Navigation & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6C685C] hover:text-[#152E22] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campus Marketplace
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAE7DF] bg-white text-xs font-medium text-[#4A4741] hover:bg-[#FAF8F3] transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-700" />
          {copiedLink ? 'Link Copied!' : 'Share Listing'}
        </button>
      </div>

      {/* Main Product Card */}
      <div className="bg-white border border-[#EAE7DF] rounded-2xl overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 p-6 lg:p-8">
          
          {/* 1. Product Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-4/3 rounded-2xl bg-[#FAF8F3] border border-[#EAE7DF] overflow-hidden">
              <img
                src={activeImage}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-xs text-[#1F1E1B] shadow-2xs border border-[#EAE7DF]">
                  {item.condition.replace('_', ' ')}
                </span>
              </div>
              {item.status === 'SOLD' && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
                  <span className="px-4 py-1.5 bg-red-600 text-white font-bold text-sm rounded-full uppercase tracking-wider shadow">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Switcher (if multiple images) */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#152E22] ring-2 ring-emerald-600/30'
                        : 'border-[#EAE7DF] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-[#8C887B] px-1 pt-1">
              <span className="inline-flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {item.view_count} campus views
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Listed {formatDate(item.created_at)}
              </span>
            </div>
          </div>

          {/* 2. Product Specifications & Pricing */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 block">
                  {item.category.replace('_', ' ')}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1F1E1B] leading-snug font-serif-title">
                  {item.title}
                </h1>
              </div>

              <div className="flex items-baseline gap-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#152E22]">
                  {formatPrice(item.price)}
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {item.condition.replace('_', ' ')}
                </span>
              </div>

              {/* Campus Pickup Location */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF8F3] border border-[#EAE7DF] text-xs text-[#4A4741]">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-semibold text-[#1F1E1B]">Campus Pickup Point:</span> {item.seller_location}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-[#1F1E1B] uppercase tracking-wider mb-1.5">
                  Item Description
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4741] whitespace-pre-line leading-relaxed bg-[#FAF8F3]/60 p-4 rounded-xl border border-[#F2EFE9]">
                  {item.description}
                </p>
              </div>
            </div>

            {/* 4. Buyer / Seller Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#EAE7DF]">
              {isSeller ? (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#1F1E1B]">Seller Listing Controls:</div>
                  <button
                    onClick={handleToggleSold}
                    disabled={updatingStatus}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                      item.status === 'ACTIVE'
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    {updatingStatus
                      ? 'Updating...'
                      : item.status === 'ACTIVE'
                      ? 'Mark as Sold'
                      : 'Relist as Active'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {item.status === 'ACTIVE' ? (
                    <>
                      {/* Primary WhatsApp Contact */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Contact Seller on WhatsApp
                      </a>

                      {/* Secondary Email Contact */}
                      <a
                        href={emailUrl}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FAF8F3] hover:bg-[#EAE7DF] text-[#152E22] font-semibold text-xs border border-[#EAE7DF] transition-all"
                      >
                        <Mail className="w-4 h-4" />
                        Email Seller
                      </a>
                    </>
                  ) : (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center text-xs font-semibold text-red-700">
                      This item has been marked as Sold Out.
                    </div>
                  )}

                  {/* Moderation Link */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setIsReportModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#8C887B] hover:text-red-600 transition-colors"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Report Listing
                    </button>
                    <span className="text-[11px] text-emerald-800 font-medium">
                      Campus Hand-to-Hand Exchange
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Verified Seller Trust Profile Card */}
      <div className="bg-white border border-[#EAE7DF] rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shadow-xs">
              {item.seller_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1F1E1B]">{item.seller_name}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-[#6C685C]">
                Reg ID: <strong>{item.seller_reg_no || item.seller_profile?.seller_reg_no || '2023-CSE-042'}</strong> • {item.seller_profile?.seller_department || 'Computer Science'} • {item.seller_location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-[#E8F5E9] px-3.5 py-2 rounded-xl border border-[#C8E6C9]">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>Verified University Student • Safe Campus Exchange</span>
          </div>
        </div>
      </div>

      {/* Report Listing Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#EAE7DF] shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE7DF] mb-4">
              <h3 className="text-sm font-bold text-[#1F1E1B] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Report Listing
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-[#8C887B] hover:text-[#1F1E1B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-[#1F1E1B]">Report Submitted</h4>
                <p className="text-[11px] text-[#6C685C]">Our campus moderation team will inspect this listing.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                    Reason for Report
                  </label>
                  <textarea
                    rows={3}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="e.g. Inaccurate price, prohibited item, or unreachable seller..."
                    className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl p-3 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-[#6C685C] hover:bg-[#FAF8F3] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport || !reportReason.trim()}
                    className="px-4 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {submittingReport ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
