import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  ArrowBigUp, 
  ArrowBigDown, 
  Search, 
  Plus, 
  Flame, 
  Clock, 
  Award, 
  HelpCircle, 
  Tag, 
  CheckCircle2, 
  Eye, 
  Sparkles,
  X,
  BookOpen,
  Briefcase,
  FlaskConical,
  Coffee,
  GraduationCap,
  Calendar,
  Share2,
  TrendingUp,
  User as UserIcon
} from 'lucide-react';
import { communityService, CommunityPost } from '../../services/api/communityService';
import { useAuth } from '../../context/AuthContext';
import { ImageUploadZone } from '../../components/ui/ImageUploadZone';

const CATEGORIES = [
  { id: 'ALL', label: 'All Posts', icon: Sparkles },
  { id: 'ACADEMIC', label: 'Academic & Syllabus', icon: BookOpen },
  { id: 'CAREER', label: 'Placements & Careers', icon: Briefcase },
  { id: 'RESEARCH', label: 'Research & Projects', icon: FlaskConical },
  { id: 'CAMPUS_LIFE', label: 'Campus Life', icon: Coffee },
  { id: 'ALUMNI_QA', label: 'Alumni AMA', icon: GraduationCap },
];

const TRENDING_TAGS = [
  'BTech2025',
  'PyTorchLab',
  'CampusDrive',
  'HostelMess',
  'SemesterExam',
  'CapstoneProject',
  'DevOps',
  'NVIDIA'
];

export const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top' | 'unanswered'>('hot');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('ACADEMIC');
  const [newTags, setNewTags] = useState<string>('');
  const [postImage, setPostImage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await communityService.fetchPosts({
        category: activeCategory === 'ALL' ? undefined : activeCategory,
        sort_by: sortBy,
        search: searchQuery || undefined,
        tag: selectedTag || undefined,
      });
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to fetch community posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [activeCategory, sortBy, selectedTag]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPosts();
  };

  const handleVote = async (e: React.MouseEvent, postId: string, voteValue: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await communityService.votePost(postId, voteValue);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, upvotes: res.upvotes, user_vote: res.user_vote }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to vote on post:', err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setFormError('Please provide both a question title and content description.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const tagsArray = newTags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter((t) => t.length > 0);

      const finalContent = postImage.trim()
        ? `${newContent.trim()}\n\n![Attached Image](${postImage.trim()})`
        : newContent.trim();

      const created = await communityService.createPost({
        title: newTitle.trim(),
        content: finalContent,
        category: newCategory,
        tags: tagsArray,
      });

      setPosts((prev) => [created, ...prev]);
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
      setPostImage('');
    } catch (err: any) {
      setFormError(err.response?.data?.detail || 'Failed to publish question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#152E22] via-[#1A3B2C] to-[#244F3B] rounded-2xl p-6 lg:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            Veyon Campus Community & Alumni Network
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2 font-serif-title">
            Veyon Campus Community & Alumni Network
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm mb-6 leading-relaxed">
            The decentralized peer-to-peer forum for engineering students, faculty, and industry-placed alumni. Ask questions, verify policy nuances, and discuss tech stacks.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, questions, placement drives, or keywords..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 transition-all"
              />
            </form>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#FAF9F5] text-[#152E22] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-white shadow-sm hover:shadow transition-all active:scale-[0.98] shrink-0"
            >
              <Plus className="w-4 h-4 text-[#152E22]" />
              Ask a Question / Share Knowledge
            </button>
          </div>
        </div>
      </div>

      {/* 2. Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedTag(null);
              }}
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

      {/* Trending Tags Cloud */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-[#6C685C]">
        <div className="inline-flex items-center gap-1 font-semibold text-[#1F1E1B] shrink-0">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
          <span>Trending Tags:</span>
        </div>
        {TRENDING_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
              selectedTag === tag
                ? 'bg-emerald-800 text-white font-semibold'
                : 'bg-white border border-[#EAE7DF] text-[#4A4741] hover:bg-[#FAF8F3]'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* 3. Controls Bar: Sort + Active Tag Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-[#EAE7DF] shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSortBy('hot')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sortBy === 'hot'
                ? 'bg-[#EBF7EE] text-[#152E22] font-semibold'
                : 'text-[#6C685C] hover:bg-[#FAF8F3]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            🔥 Hot
          </button>
          <button
            onClick={() => setSortBy('new')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sortBy === 'new'
                ? 'bg-[#EBF7EE] text-[#152E22] font-semibold'
                : 'text-[#6C685C] hover:bg-[#FAF8F3]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            ✨ Newest
          </button>
          <button
            onClick={() => setSortBy('top')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sortBy === 'top'
                ? 'bg-[#EBF7EE] text-[#152E22] font-semibold'
                : 'text-[#6C685C] hover:bg-[#FAF8F3]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-purple-500" />
            ⭐ Top Upvoted
          </button>
          <button
            onClick={() => setSortBy('unanswered')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sortBy === 'unanswered'
                ? 'bg-[#EBF7EE] text-[#152E22] font-semibold'
                : 'text-[#6C685C] hover:bg-[#FAF8F3]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            ❓ Unanswered
          </button>
        </div>

        {selectedTag && (
          <div className="flex items-center gap-2 bg-[#FAF8F3] border border-[#EAE7DF] px-3 py-1 rounded-lg text-xs text-[#1F1E1B]">
            <Tag className="w-3 h-3 text-emerald-600" />
            <span>Tag: <strong>#{selectedTag}</strong></span>
            <button onClick={() => setSelectedTag(null)} className="text-[#8C887B] hover:text-red-600 ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Posts Feed & Skeleton Loading */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-[#EAE7DF] rounded-xl p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-16 bg-[#FAF8F3] rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-[#EAE7DF] rounded w-3/4" />
                  <div className="h-3 bg-[#FAF8F3] rounded w-1/2" />
                  <div className="h-10 bg-[#FAF8F3] rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#EAE7DF] rounded-2xl p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#1F1E1B] mb-1">No discussions found</h3>
          <p className="text-xs text-[#6C685C] mb-6">
            Be the first student or alumni to start a conversation in this category!
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#152E22] text-white rounded-xl text-xs font-semibold hover:bg-[#1E4130] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ask Question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/community/${post.id}`}
              className="block bg-white border border-[#EAE7DF] hover:border-[#152E22]/30 rounded-xl p-4 sm:p-5 transition-all hover:shadow-xs group"
            >
              <div className="flex items-start gap-4">
                {/* Left Side: Upvote / Downvote Counter */}
                <div className="flex flex-col items-center bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl p-1 min-w-[42px] shrink-0">
                  <button
                    onClick={(e) => handleVote(e, post.id, 1)}
                    className={`p-1 rounded-lg transition-colors ${
                      post.user_vote === 1
                        ? 'text-emerald-700 bg-emerald-100'
                        : 'text-[#6C685C] hover:bg-white hover:text-emerald-600'
                    }`}
                    title="Upvote"
                  >
                    <ArrowBigUp className="w-5 h-5 fill-current" />
                  </button>
                  <span className="text-xs font-bold text-[#1F1E1B] my-0.5">
                    {post.upvotes}
                  </span>
                  <button
                    onClick={(e) => handleVote(e, post.id, -1)}
                    className={`p-1 rounded-lg transition-colors ${
                      post.user_vote === -1
                        ? 'text-red-700 bg-red-100'
                        : 'text-[#6C685C] hover:bg-white hover:text-red-600'
                    }`}
                    title="Downvote"
                  >
                    <ArrowBigDown className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Category + Solved Badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {post.category}
                    </span>
                    {post.accepted_comment_id && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 className="w-3 h-3" />
                        ✅ Solved
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-sm sm:text-base font-bold text-[#1F1E1B] group-hover:text-[#152E22] transition-colors mb-1.5 line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Snippet */}
                  <p className="text-xs text-[#6C685C] line-clamp-2 mb-3 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Author Footer + Stats */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F2EFE9]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-[#1F1E1B]">
                        {post.author_name}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF8F3] text-[#6C685C] border border-[#EAE7DF]">
                        {post.author_badge}
                      </span>
                      <span className="text-[11px] text-[#8C887B]">
                        • {formatDate(post.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#8C887B]">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        {post.comment_count} replies
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {post.view_count} views
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Ask Question / Create Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#EAE7DF] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE7DF] bg-[#FAF8F3]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F1E1B]">Ask a Question / Share Knowledge</h3>
                  <p className="text-[11px] text-[#6C685C]">Posted with your verified university credentials ({user?.reg_number || '2023-CSE-042'})</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#8C887B] hover:text-[#1F1E1B] p-1 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                  Question Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How to prepare for NVIDIA AI On-Campus Technical Rounds?"
                  className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl px-3 py-2 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                  >
                    <option value="ACADEMIC">Academic & Syllabus</option>
                    <option value="CAREER">Placements & Careers</option>
                    <option value="RESEARCH">Research & Projects</option>
                    <option value="CAMPUS_LIFE">Campus Life</option>
                    <option value="ALUMNI_QA">Alumni AMA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. BTech2025, PyTorchLab, CampusDrive"
                    className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl px-3.5 py-2 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1E1B] mb-1">
                  Context & Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your question or share your knowledge so students and alumni can provide insightful answers..."
                  className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl p-3 text-xs text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
                  required
                />
              </div>

              <ImageUploadZone
                onImageSelected={(url) => setPostImage(url)}
                onImageRemoved={() => setPostImage('')}
                currentImage={postImage}
                label="Attach Screenshot, Problem Diagram or Notes (Optional)"
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE7DF]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6C685C] hover:bg-[#FAF8F3] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-[#152E22] text-white rounded-xl hover:bg-[#1E4130] shadow-sm disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Publishing...' : 'Publish Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
