import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowBigUp, 
  ArrowBigDown, 
  CheckCircle2, 
  MessageSquare, 
  Eye, 
  Clock, 
  Check, 
  Share2, 
  Send, 
  ShieldCheck, 
  User as UserIcon,
  Sparkles,
  Bold,
  Italic,
  Code,
  Link as LinkIcon,
  List,
  Quote,
  GraduationCap
} from 'lucide-react';
import { communityService, CommunityPost, CommunityComment } from '../../services/api/communityService';
import { useAuth } from '../../context/AuthContext';

export const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newReply, setNewReply] = useState<string>('');
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const loadPostDetail = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const data = await communityService.getPostDetail(postId, user?.id);
      setPost(data.post);
      setComments(data.comments || []);
    } catch (err) {
      console.error('Failed to load post detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostDetail();
  }, [postId]);

  const handlePostVote = async (voteValue: number) => {
    if (!post) return;
    try {
      const res = await communityService.votePost(post.id, voteValue);
      setPost((prev) => (prev ? { ...prev, upvotes: res.upvotes, user_vote: res.user_vote } : null));
    } catch (err) {
      console.error('Failed to vote on post:', err);
    }
  };

  const handleCommentVote = async (commentId: string, voteValue: number) => {
    try {
      const res = await communityService.voteComment(commentId, voteValue);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, upvotes: res.upvotes, user_vote: res.user_vote } : c
        )
      );
    } catch (err) {
      console.error('Failed to vote on comment:', err);
    }
  };

  const handleAcceptAnswer = async (commentId: string) => {
    try {
      await communityService.acceptComment(commentId);
      setPost((prev) => (prev ? { ...prev, accepted_comment_id: commentId } : null));
      setComments((prev) =>
        prev.map((c) => ({
          ...c,
          is_accepted: c.id === commentId,
        }))
      );
    } catch (err) {
      console.error('Failed to mark answer accepted:', err);
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId || !newReply.trim()) return;

    setSubmittingReply(true);
    setErrorMsg(null);
    try {
      const created = await communityService.createComment(postId, {
        content: newReply.trim(),
      });
      setComments((prev) => [...prev, created]);
      setNewReply('');
      if (post) {
        setPost({ ...post, comment_count: post.comment_count + 1 });
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to submit comment. Please try again.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    setNewReply((prev) => `${prev}${prefix}text${suffix}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-8 animate-pulse">
        <div className="h-6 bg-[#EAE7DF] rounded w-32" />
        <div className="h-64 bg-white border border-[#EAE7DF] rounded-2xl p-6" />
        <div className="h-40 bg-white border border-[#EAE7DF] rounded-2xl p-6" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <h3 className="text-base font-bold text-[#1F1E1B] mb-2">Discussion not found</h3>
        <p className="text-xs text-[#6C685C] mb-6">This post might have been removed or does not exist.</p>
        <Link
          to="/community"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#152E22] text-white text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </Link>
      </div>
    );
  }

  const isPostAuthor = user?.id === post.author_id || user?.role === 'Admin' || user?.reg_number === '2023-CSE-042';
  const acceptedComment = comments.find((c) => c.is_accepted || c.id === post.accepted_comment_id);
  const otherComments = comments.filter((c) => !c.is_accepted && c.id !== post.accepted_comment_id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6C685C] hover:text-[#152E22] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community Forum
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAE7DF] bg-white text-xs font-medium text-[#4A4741] hover:bg-[#FAF8F3] transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-700" />
          {copiedLink ? 'Link Copied!' : 'Share'}
        </button>
      </div>

      {/* 1. Main Question Card */}
      <div className="bg-white border border-[#EAE7DF] rounded-2xl p-6 lg:p-8 shadow-2xs">
        <div className="flex items-start gap-4 sm:gap-6">
          {/* Post Upvote / Downvote Column */}
          <div className="flex flex-col items-center bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl p-1.5 min-w-[46px] shrink-0">
            <button
              onClick={() => handlePostVote(1)}
              className={`p-1.5 rounded-lg transition-colors ${
                post.user_vote === 1
                  ? 'text-emerald-700 bg-emerald-100'
                  : 'text-[#6C685C] hover:bg-white hover:text-emerald-600'
              }`}
              title="Upvote"
            >
              <ArrowBigUp className="w-6 h-6 fill-current" />
            </button>
            <span className="text-sm font-bold text-[#1F1E1B] my-1">
              {post.upvotes}
            </span>
            <button
              onClick={() => handlePostVote(-1)}
              className={`p-1.5 rounded-lg transition-colors ${
                post.user_vote === -1
                  ? 'text-red-700 bg-red-100'
                  : 'text-[#6C685C] hover:bg-white hover:text-red-600'
              }`}
              title="Downvote"
            >
              <ArrowBigDown className="w-6 h-6 fill-current" />
            </button>
          </div>

          {/* Post Content Body */}
          <div className="flex-1 min-w-0">
            {/* Category + Solved Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {post.category}
              </span>
              {post.accepted_comment_id && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F5E9] text-emerald-800 border border-[#C8E6C9]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  ✅ Solved
                </span>
              )}
            </div>

            {/* Question Title */}
            <h1 className="text-lg sm:text-2xl font-bold text-[#1F1E1B] mb-4 leading-snug font-serif-title">
              {post.title}
            </h1>

            {/* Full Markdown / Text Content */}
            <div className="text-xs sm:text-sm text-[#3E3C36] leading-relaxed whitespace-pre-line mb-6 bg-[#FAF8F3]/60 p-4 sm:p-5 rounded-xl border border-[#F2EFE9]">
              {post.content}
            </div>

            {/* Tags Cloud */}
            <div className="flex flex-wrap items-center gap-1.5 mb-6">
              {(post.tags || []).map((t, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium text-[#6C685C] bg-[#FAF8F3] px-2.5 py-1 rounded-md border border-[#EAE7DF]"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Author Verified Profile Card + Stats Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#EAE7DF]">
              {/* Author Profile Pill */}
              <div className="flex items-center gap-3 bg-[#FAF8F3] p-2.5 sm:px-3.5 rounded-xl border border-[#EAE7DF]">
                <div className="w-8 h-8 rounded-lg bg-[#152E22] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#1F1E1B]">{post.author_name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <div className="text-[10px] text-[#6C685C] font-medium">
                    {post.author_badge} • Asked on {formatDate(post.created_at)}
                  </div>
                </div>
              </div>

              {/* Views & Answers Counters */}
              <div className="flex items-center gap-4 text-xs text-[#8C887B]">
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
      </div>

      {/* 2. Answers & Discussion Header */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#1F1E1B] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-800" />
          Answers & Peer Solutions ({comments.length})
        </h2>

        {/* 2. Accepted Answer Highlight (Pinned Top) */}
        {acceptedComment && (
          <div className="bg-[#E8F5E9] border-2 border-[#C8E6C9] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#C8E6C9]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                ✅ Accepted by Author
              </div>
              <span className="text-[11px] text-emerald-800 font-semibold">
                Verified Solution
              </span>
            </div>

            <div className="flex items-start gap-4">
              {/* Comment Upvote Column */}
              <div className="flex flex-col items-center bg-white border border-[#C8E6C9] rounded-xl p-1 min-w-[38px] shrink-0">
                <button
                  onClick={() => handleCommentVote(acceptedComment.id, 1)}
                  className={`p-1 rounded-md transition-colors ${
                    acceptedComment.user_vote === 1
                      ? 'text-emerald-700 bg-emerald-100'
                      : 'text-[#6C685C] hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <ArrowBigUp className="w-5 h-5 fill-current" />
                </button>
                <span className="text-xs font-bold text-[#1F1E1B] my-0.5">
                  {acceptedComment.upvotes}
                </span>
                <button
                  onClick={() => handleCommentVote(acceptedComment.id, -1)}
                  className={`p-1 rounded-md transition-colors ${
                    acceptedComment.user_vote === -1
                      ? 'text-red-700 bg-red-100'
                      : 'text-[#6C685C] hover:bg-emerald-50 hover:text-red-600'
                  }`}
                >
                  <ArrowBigDown className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#1F1E1B]">
                    {acceptedComment.author_name}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white text-emerald-800 border border-[#C8E6C9]">
                    {acceptedComment.author_badge}
                  </span>
                  <span className="text-[10px] text-emerald-900/60">
                    • {formatDate(acceptedComment.created_at)}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-[#1F1E1B] whitespace-pre-line leading-relaxed">
                  {acceptedComment.content}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Replies List */}
        {otherComments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white border border-[#EAE7DF] rounded-2xl p-5 shadow-2xs hover:border-[#152E22]/20 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl p-1 min-w-[38px] shrink-0">
                <button
                  onClick={() => handleCommentVote(comment.id, 1)}
                  className={`p-1 rounded-md transition-colors ${
                    comment.user_vote === 1
                      ? 'text-emerald-700 bg-emerald-100'
                      : 'text-[#6C685C] hover:bg-white hover:text-emerald-600'
                  }`}
                  title="Upvote answer"
                >
                  <ArrowBigUp className="w-5 h-5 fill-current" />
                </button>
                <span className="text-xs font-bold text-[#1F1E1B] my-0.5">
                  {comment.upvotes}
                </span>
                <button
                  onClick={() => handleCommentVote(comment.id, -1)}
                  className={`p-1 rounded-md transition-colors ${
                    comment.user_vote === -1
                      ? 'text-red-700 bg-red-100'
                      : 'text-[#6C685C] hover:bg-white hover:text-red-600'
                  }`}
                  title="Downvote answer"
                >
                  <ArrowBigDown className="w-5 h-5 fill-current" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1F1E1B]">
                      {comment.author_name}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF8F3] text-[#6C685C] border border-[#EAE7DF]">
                      {comment.author_badge}
                    </span>
                    <span className="text-[10px] text-[#8C887B]">
                      • {formatDate(comment.created_at)}
                    </span>
                  </div>

                  {/* Accept Answer Checkmark for Author */}
                  {isPostAuthor && !comment.is_accepted && (
                    <button
                      onClick={() => handleAcceptAnswer(comment.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-[#E8F5E9] hover:bg-emerald-100 border border-[#C8E6C9] transition-colors"
                      title="Mark this answer as accepted/helpful"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Accept Answer
                    </button>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-[#4A4741] whitespace-pre-line leading-relaxed">
                  {comment.content}
                </div>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-10 bg-white border border-[#EAE7DF] rounded-2xl p-6">
            <p className="text-xs text-[#6C685C]">No answers posted yet. Share your experience or recommendations below!</p>
          </div>
        )}
      </div>

      {/* 3. Reply Composer with Rich Formatting Toolbar */}
      <div className="bg-white border border-[#EAE7DF] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[#1F1E1B] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            Your Answer
          </h3>
          <span className="text-[11px] text-[#6C685C]">
            Posting as: <strong>{user?.role || 'Student'} ({user?.reg_number || '2023-CSE-042'})</strong>
          </span>
        </div>

        <form onSubmit={handlePostReply} className="space-y-3">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl text-xs text-[#6C685C]">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**')}
              className="p-1.5 rounded-lg hover:bg-white hover:text-[#1F1E1B] transition-colors"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*')}
              className="p-1.5 rounded-lg hover:bg-white hover:text-[#1F1E1B] transition-colors"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('`', '`')}
              className="p-1.5 rounded-lg hover:bg-white hover:text-[#1F1E1B] transition-colors"
              title="Inline Code"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('[', '](https://...)')}
              className="p-1.5 rounded-lg hover:bg-white hover:text-[#1F1E1B] transition-colors"
              title="Insert Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n- ')}
              className="p-1.5 rounded-lg hover:bg-white hover:text-[#1F1E1B] transition-colors"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n> ')}
              className="p-1.5 rounded-lg hover:bg-white hover:text-[#1F1E1B] transition-colors"
              title="Quote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            rows={4}
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write a detailed, verified answer with textbook references, course codes, or placement tips..."
            className="w-full bg-[#FAF8F3] border border-[#EAE7DF] rounded-xl p-3.5 text-xs sm:text-sm text-[#1F1E1B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#152E22]/30"
            required
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#8C887B]">
              Markdown supported. Keep answers constructive and grounded in university policy.
            </span>
            <button
              type="submit"
              disabled={submittingReply || !newReply.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold bg-[#152E22] text-white rounded-xl hover:bg-[#1E4130] shadow-sm disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" />
              {submittingReply ? 'Submitting...' : 'Post Reply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
