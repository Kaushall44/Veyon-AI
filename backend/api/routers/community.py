from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Query, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

try:
    from backend.database.session import get_sync_db
    from backend.database.models import User, CommunityPost, CommunityComment, CommunityVote, Notification
    from backend.middleware.rbac import get_current_user_from_token
    from backend.database.supabase_client import supabase_insert, supabase_select, supabase_update
except ImportError:
    from database.session import get_sync_db
    from database.models import User, CommunityPost, CommunityComment, CommunityVote, Notification
    from middleware.rbac import get_current_user_from_token
    from database.supabase_client import supabase_insert, supabase_select, supabase_update

router = APIRouter(prefix="/community", tags=["Veyon Campus Community & Alumni Network"])

# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------
class CreatePostPayload(BaseModel):
    title: str = Field(..., min_length=3, max_length=255, example="How to prepare for NVIDIA AI On-Campus Drive?")
    content: str = Field(..., min_length=5, example="Can seniors or alumni share what core topics in PyTorch and C++ are asked?")
    category: str = Field("ACADEMIC", example="CAREER")  # ACADEMIC, CAREER, RESEARCH, CAMPUS_LIFE, ALUMNI_QA
    tags: List[str] = Field(default_factory=list, example=["Placements", "PyTorch", "Interviews"])

class CreateCommentPayload(BaseModel):
    content: str = Field(..., min_length=2, example="Focus on CUDA memory hierarchy and model quantization techniques!")
    parent_comment_id: Optional[str] = Field(None, example=None)

class VotePayload(BaseModel):
    vote_value: Optional[int] = Field(None, ge=-1, le=1, example=1)
    vote: Optional[int] = Field(None, ge=-1, le=1, example=1)

    def get_val(self) -> int:
        if self.vote_value is not None:
            return self.vote_value
        if self.vote is not None:
            return self.vote
        return 1

def resolve_user_badge(user: User) -> str:
    """Helper to compute verified campus trust badge."""
    role = (user.role or "Student").strip().title()
    if role == "Student":
        reg = user.reg_number or "2024-CSE-042"
        return f"🎓 Student • {reg}"
    elif role == "Alumni":
        dept = user.department or "CSE"
        return f"🌟 Verified Alumni • {dept}"
    elif role in ("Faculty", "Labincharge", "Lab_Incharge", "Estates", "Grievance", "Admin"):
        return f"🏛️ Faculty Mentor • {user.department or 'SOA'}"
    return f"Verified {role}"

# ---------------------------------------------------------------------------
# 1. GET /api/community/posts (List & Filter)
# ---------------------------------------------------------------------------
@router.get("/posts")
def list_community_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    sort_by: str = Query("hot", pattern="^(hot|new|top|unanswered)$"),
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_sync_db)
):
    """
    Retrieves paginated community forum posts with search, category filtering,
    tag matching, and hot/new/top sorting.
    """
    query = db.query(CommunityPost)

    # Filter by category
    if category and category.upper() != "ALL":
        query = query.filter(CommunityPost.category.ilike(f"%{category}%"))

    # Filter by search string
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                CommunityPost.title.ilike(search_pattern),
                CommunityPost.content.ilike(search_pattern)
            )
        )

    # Filter by tag
    if tag:
        tag_str = tag.strip().lower()
        # JSON containment / string search fallback
        query = query.filter(CommunityPost.tags.cast(db.bind.dialect.name == 'postgresql' and func.jsonb or func.text).ilike(f"%{tag_str}%"))

    # Filter unanswered
    if sort_by == "unanswered":
        query = query.filter(CommunityPost.comment_count == 0)

    total_count = query.count()

    # Sorting logic
    if sort_by == "new":
        query = query.order_by(CommunityPost.created_at.desc())
    elif sort_by == "top":
        query = query.order_by(CommunityPost.upvotes.desc(), CommunityPost.created_at.desc())
    elif sort_by == "hot":
        # Hot rank formula: upvotes * 2 + comment_count * 3
        query = query.order_by(CommunityPost.upvotes.desc(), CommunityPost.comment_count.desc(), CommunityPost.created_at.desc())
    else:
        query = query.order_by(CommunityPost.created_at.desc())

    offset = (page - 1) * limit
    posts = query.offset(offset).limit(limit).all()

    # If database has 0 posts (first launch), seed baseline discussions
    if total_count == 0 and page == 1:
        seed_posts = [
            CommunityPost(
                title="How to secure NVIDIA / Microsoft on-campus interview shortlist?",
                content="Hey everyone! For the upcoming campus placement season, what are the most critical DSA and System Design topics asked during technical rounds? Any tips from recent alumni?",
                category="CAREER",
                tags=["Placements", "Interviews", "DSA", "Alumni"],
                author_id="u1000000-0000-0000-0000-000000000001",
                author_name="Kaushal Raj Gupta",
                author_role="Student",
                author_badge="🎓 Student • 2023-CSE-042",
                upvotes=24,
                view_count=182,
                comment_count=3
            ),
            CommunityPost(
                title="GPU Cluster access guidelines for 7th Semester Capstone Projects",
                content="Faculty circular updated: High-Performance Computing (HPC) nodes with RTX 4090 are available for Deep Learning and Robotics. Make sure your project proposal is signed by your guide.",
                category="RESEARCH",
                tags=["AI Lab", "HPC", "PyTorch", "Capstone"],
                author_id="u1000000-0000-0000-0000-000000000002",
                author_name="Dr. S. Panigrahi",
                author_role="Faculty",
                author_badge="🏛️ Faculty Mentor • CSE",
                upvotes=38,
                view_count=310,
                comment_count=5
            ),
            CommunityPost(
                title="Best electives for Cloud Computing and DevOps track in 3rd Year?",
                content="Confused between Distributed Systems vs Cloud Infrastructure Architecture. Which course has better hands-on lab assignments with Kubernetes and AWS?",
                category="ACADEMIC",
                tags=["Syllabus", "Electives", "DevOps", "AWS"],
                author_id="u1000000-0000-0000-0000-000000000001",
                author_name="Ananya Sharma",
                author_role="Student",
                author_badge="🎓 Student • 2024-CSE-118",
                upvotes=15,
                view_count=94,
                comment_count=2
            )
        ]
        for p in seed_posts:
            db.add(p)
        db.commit()
        posts = seed_posts
        total_count = len(seed_posts)

    return {
        "posts": [p.to_dict() for p in posts],
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": max(1, (total_count + limit - 1) // limit)
    }

# ---------------------------------------------------------------------------
# 2. POST /api/community/posts (Create Question / Discussion)
# ---------------------------------------------------------------------------
@router.post("/posts", status_code=status.HTTP_201_CREATED)
def create_community_post(
    payload: CreatePostPayload,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Creates a new community post / question with verified author badge.
    """
    badge = resolve_user_badge(current_user)
    
    clean_category = payload.category.strip().upper()
    if clean_category not in ["ACADEMIC", "CAREER", "RESEARCH", "CAMPUS_LIFE", "ALUMNI_QA"]:
        clean_category = "ACADEMIC"

    new_post = CommunityPost(
        title=payload.title.strip(),
        content=payload.content.strip(),
        category=clean_category,
        tags=payload.tags,
        author_id=current_user.id,
        author_name=current_user.full_name,
        author_role=current_user.role or "Student",
        author_badge=badge,
        upvotes=1,  # Author automatically upvotes their own post
        view_count=1,
        comment_count=0
    )
    db.add(new_post)
    db.flush()

    # Record author's initial upvote
    initial_vote = CommunityVote(
        user_id=current_user.id,
        target_id=new_post.id,
        target_type="POST",
        vote_value=1
    )
    db.add(initial_vote)
    db.commit()
    db.refresh(new_post)

    supabase_insert("community_posts", new_post.to_dict())

    return new_post.to_dict()

# ---------------------------------------------------------------------------
# 3. GET /api/community/posts/{post_id} (Post Detail & Comment Thread)
# ---------------------------------------------------------------------------
@router.get("/posts/{post_id}")
def get_community_post_detail(
    post_id: str,
    db: Session = Depends(get_sync_db),
    user_id: Optional[str] = None
):
    """
    Returns full post detail with threaded comments (accepted answer pinned to top).
    Increments view count.
    """
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Community post '{post_id}' not found."
        )

    # Increment view counter
    post.view_count += 1
    db.commit()
    db.refresh(post)

    # Fetch comments
    raw_comments = db.query(CommunityComment).filter(
        CommunityComment.post_id == post_id
    ).all()

    # Sort comments: Accepted answer first, then by upvotes desc, then created_at asc
    sorted_comments = sorted(
        raw_comments,
        key=lambda c: (c.is_accepted, c.upvotes, c.created_at),
        reverse=True
    )

    # If user_id provided, fetch their active vote on post and comments
    user_vote = 0
    comment_votes = {}
    if user_id:
        p_vote = db.query(CommunityVote).filter(
            CommunityVote.user_id == user_id,
            CommunityVote.target_id == post_id
        ).first()
        if p_vote:
            user_vote = p_vote.vote_value

        c_votes = db.query(CommunityVote).filter(
            CommunityVote.user_id == user_id,
            CommunityVote.target_id.in_([c.id for c in raw_comments])
        ).all()
        for cv in c_votes:
            comment_votes[cv.target_id] = cv.vote_value

    comments_payload = []
    for c in sorted_comments:
        c_dict = c.to_dict()
        c_dict["user_vote"] = comment_votes.get(c.id, 0)
        comments_payload.append(c_dict)

    post_payload = post.to_dict()
    post_payload["user_vote"] = user_vote

    return {
        "post": post_payload,
        "comments": comments_payload
    }

# ---------------------------------------------------------------------------
# 4. POST /api/community/posts/{post_id}/comments (Reply / Answer)
# ---------------------------------------------------------------------------
@router.post("/posts/{post_id}/comments", status_code=status.HTTP_201_CREATED)
def create_community_comment(
    post_id: str,
    payload: CreateCommentPayload,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Submits a comment/answer to a post, updates comment count, and notifies post author.
    """
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Community post '{post_id}' not found."
        )

    badge = resolve_user_badge(current_user)

    new_comment = CommunityComment(
        post_id=post_id,
        author_id=current_user.id,
        author_name=current_user.full_name,
        author_role=current_user.role or "Student",
        author_badge=badge,
        content=payload.content.strip(),
        upvotes=1,
        is_accepted=False,
        parent_comment_id=payload.parent_comment_id
    )
    db.add(new_comment)
    db.flush()

    # Record author's initial upvote
    initial_vote = CommunityVote(
        user_id=current_user.id,
        target_id=new_comment.id,
        target_type="COMMENT",
        vote_value=1
    )
    db.add(initial_vote)

    # Increment post comment count
    post.comment_count += 1

    # Dispatch in-app notification if commenter is not post author
    if post.author_id != current_user.id:
        notif = Notification(
            user_id=post.author_id,
            title="New reply on your post",
            message=f"{current_user.full_name} replied to '{post.title[:45]}...'",
            category="COMMUNITY",
            link_path=f"/community/{post.id}"
        )
        db.add(notif)

    db.commit()
    db.refresh(new_comment)

    supabase_insert("community_comments", new_comment.to_dict())

    return new_comment.to_dict()

# ---------------------------------------------------------------------------
# 5. POST /api/community/posts/{post_id}/vote (Upvote / Downvote Post)
# ---------------------------------------------------------------------------
@router.post("/posts/{post_id}/vote")
def vote_community_post(
    post_id: str,
    payload: VotePayload,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Toggles or updates upvote (+1) or downvote (-1) on a post.
    """
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post '{post_id}' not found."
        )

    existing_vote = db.query(CommunityVote).filter(
        CommunityVote.user_id == current_user.id,
        CommunityVote.target_id == post_id
    ).first()

    requested_vote = payload.get_val()

    if existing_vote:
        if existing_vote.vote_value == requested_vote:
            # Clicking same vote button cancels vote
            post.upvotes -= existing_vote.vote_value
            db.delete(existing_vote)
            new_vote = 0
        else:
            # Switching vote from +1 to -1 or vice-versa
            diff = requested_vote - existing_vote.vote_value
            post.upvotes += diff
            existing_vote.vote_value = requested_vote
            new_vote = requested_vote
    else:
        if requested_vote != 0:
            new_v = CommunityVote(
                user_id=current_user.id,
                target_id=post_id,
                target_type="POST",
                vote_value=requested_vote
            )
            db.add(new_v)
            post.upvotes += requested_vote
            new_vote = requested_vote
        else:
            new_vote = 0

    db.commit()
    db.refresh(post)

    return {
        "target_id": post_id,
        "upvotes": post.upvotes,
        "user_vote": new_vote
    }

# ---------------------------------------------------------------------------
# 6. POST /api/community/comments/{comment_id}/vote (Upvote Comment)
# ---------------------------------------------------------------------------
@router.post("/comments/{comment_id}/vote")
def vote_community_comment(
    comment_id: str,
    payload: VotePayload,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Toggles or updates upvote/downvote on a comment.
    """
    comment = db.query(CommunityComment).filter(CommunityComment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment '{comment_id}' not found."
        )

    existing_vote = db.query(CommunityVote).filter(
        CommunityVote.user_id == current_user.id,
        CommunityVote.target_id == comment_id
    ).first()

    requested_vote = payload.get_val()

    if existing_vote:
        if existing_vote.vote_value == requested_vote:
            comment.upvotes -= existing_vote.vote_value
            db.delete(existing_vote)
            new_vote = 0
        else:
            diff = requested_vote - existing_vote.vote_value
            comment.upvotes += diff
            existing_vote.vote_value = requested_vote
            new_vote = requested_vote
    else:
        if requested_vote != 0:
            new_v = CommunityVote(
                user_id=current_user.id,
                target_id=comment_id,
                target_type="COMMENT",
                vote_value=requested_vote
            )
            db.add(new_v)
            comment.upvotes += requested_vote
            new_vote = requested_vote
        else:
            new_vote = 0

    db.commit()
    db.refresh(comment)

    return {
        "target_id": comment_id,
        "upvotes": comment.upvotes,
        "user_vote": new_vote
    }

# ---------------------------------------------------------------------------
# 7. POST /api/community/comments/{comment_id}/accept (Accepted Answer)
# ---------------------------------------------------------------------------
@router.post("/comments/{comment_id}/accept")
def accept_community_comment(
    comment_id: str,
    db: Session = Depends(get_sync_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Marks a comment as the 'Accepted / Helpful Answer' by the original post author.
    """
    comment = db.query(CommunityComment).filter(CommunityComment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment '{comment_id}' not found."
        )

    post = db.query(CommunityPost).filter(CommunityPost.id == comment.post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parent post not found."
        )

    # Only post author or Admin can accept an answer
    if post.author_id != current_user.id and current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the author of the question can mark an answer as accepted."
        )

    # Toggle previous accepted comments to False
    db.query(CommunityComment).filter(
        CommunityComment.post_id == post.id
    ).update({"is_accepted": False})

    # Mark this comment accepted
    comment.is_accepted = True
    post.accepted_comment_id = comment.id

    # Notify commenter
    if comment.author_id != current_user.id:
        notif = Notification(
            user_id=comment.author_id,
            title="Your answer was accepted! 🎉",
            message=f"The author accepted your answer on '{post.title[:45]}...'",
            category="COMMUNITY",
            link_path=f"/community/{post.id}"
        )
        db.add(notif)

    db.commit()
    db.refresh(comment)
    db.refresh(post)

    return {
        "status": "success",
        "accepted_comment_id": comment.id,
        "is_accepted": True,
        "message": "Comment successfully marked as accepted answer."
    }
