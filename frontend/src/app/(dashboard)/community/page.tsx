'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Heart, MessageSquare, Send, Plus, Loader2,
  Hash, ShieldAlert, Sparkles, MessageCircle, MoreVertical,
  ThumbsUp, Volume2, Bookmark, Share2, Compass, AlertCircle, Filter
} from 'lucide-react';

export default function CommunityPage() {
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  
  // Channels / Group selection
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [visibleComments, setVisibleComments] = useState<Record<string, number>>({});
  const [postTag, setPostTag] = useState<string>('ENCOURAGEMENT');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  const parsePostContent = (content: string) => {
    const prefixes = ['[TESTIMONY]', '[QUESTION]', '[ENCOURAGEMENT]', '[REPORT]', '[RELATIONSHIP]'];
    const matched = prefixes.find(pref => content.startsWith(pref));
    
    if (matched) {
      const type = matched.slice(1, -1);
      const rawContent = content.substring(matched.length).trim();
      return { type, rawContent };
    }
    
    return { type: 'GENERAL', rawContent: content };
  };

  const renderPostBadge = (type: string) => {
    switch (type) {
      case 'TESTIMONY':
        return <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1">🕊️ Testimony</span>;
      case 'QUESTION':
        return <span className="text-[9px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-md flex items-center gap-1">❓ Question</span>;
      case 'ENCOURAGEMENT':
        return <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-md flex items-center gap-1">🤝 Encouragement</span>;
      case 'REPORT':
        return <span className="text-[9px] font-black uppercase bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-1 rounded-md flex items-center gap-1">📄 Ministry Report</span>;
      case 'RELATIONSHIP':
        return <span className="text-[9px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-1 rounded-md flex items-center gap-1">💬 Relationship</span>;
      default:
        return <span className="text-[9px] font-black uppercase bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1">📣 General</span>;
    }
  };

  // 1. Fetch spaces (groups)
  const { data: dbGroups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => communityApi.getGroups()
  });

  // 2. Fetch posts based on selected group
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts', selectedGroupId],
    queryFn: () => communityApi.getPosts(selectedGroupId || undefined),
  });

  // 3. Post Mutation
  const postMutation = useMutation({
    mutationFn: communityApi.createPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts', selectedGroupId] });
      setPostContent('');
      toast.success('Your post has been shared! ✨');
    },
    onError: () => {
      toast.error('Failed to share post.');
    }
  });

  // 4. Like Mutation
  const likeMutation = useMutation({
    mutationFn: communityApi.toggleLike,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts', selectedGroupId] });
    }
  });

  // 5. Comment Mutation
  const commentMutation = useMutation({
    mutationFn: communityApi.createComment,
    onSuccess: (_, vars: any) => {
      qc.invalidateQueries({ queryKey: ['posts', selectedGroupId] });
      setCommentContent(prev => ({ ...prev, [vars.postId]: '' }));
      toast.success('Comment posted.');
    }
  });

  // 6. Create Group Mutation
  const createGroupMutation = useMutation({
    mutationFn: (data: any) => communityApi.createGroup(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      setNewGroupName('');
      setNewGroupDesc('');
      setShowCreateGroup(false);
      toast.success('New discussion channel created!');
    },
    onError: () => {
      toast.error('Failed to create channel.');
    }
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    
    const prefixedContent = `[${postTag}] ${postContent.trim()}`;
    
    postMutation.mutate({
      content: prefixedContent,
      groupId: selectedGroupId || undefined
    });
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentContent[postId];
    if (!text || !text.trim()) return;

    commentMutation.mutate({
      content: text,
      postId
    });
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    createGroupMutation.mutate({
      name: newGroupName,
      description: newGroupDesc
    });
  };

  const toggleCommentsView = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Default seeded channels if database is completely empty
  const defaultGroups = [
    { id: 'all', name: 'General discussion', description: 'Central forum for general announcements & fellowship.' },
    ...dbGroups
  ];

  // Helper to format date
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-sans text-slate-900 bg-slate-50 min-h-screen">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/60 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 flex items-center gap-2.5">
            <Users size={32} className="text-blue-900" />
            Community Center
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Connect, share insights, and uplift fellow student ministers.</p>
        </div>
        <button 
          onClick={() => setShowCreateGroup(true)}
          className="bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-sm text-xs flex items-center gap-1.5"
        >
          <Plus size={16} /> New Channel
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Space List (3-Cols) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              <span>Discussion Spaces</span>
              <Compass size={14} />
            </div>

            <nav className="space-y-1.5">
              <button 
                onClick={() => setSelectedGroupId(null)}
                className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${!selectedGroupId ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Hash size={14} className={!selectedGroupId ? 'text-blue-900' : 'text-slate-400'} />
                All Spaces
              </button>

              {dbGroups.map((g: any) => (
                <button 
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${selectedGroupId === g.id ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Hash size={14} className={selectedGroupId === g.id ? 'text-blue-900' : 'text-slate-400'} />
                    {g.name}
                  </span>
                  {g._count?.posts > 0 && (
                    <span className="bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md text-[9px]">
                      {g._count.posts}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Guidelines Box */}
          <div className="bg-blue-950 text-white rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="relative z-10 flex gap-2 items-center text-blue-200">
              <ShieldAlert size={16} />
              <h4 className="font-bold text-xs uppercase tracking-wider">Honor & Respect</h4>
            </div>
            <p className="relative z-10 text-xs font-medium text-slate-300 leading-relaxed">
              We seek to establish a sanctuary of encouragement. Always respect other student views and maintain biblical honor.
            </p>
            {/* Background design */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
          </div>
        </aside>

        {/* Feed & Post Composer (6-Cols) */}
        <main className="lg:col-span-6 space-y-6">
          
          {/* Composer */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-5 md:p-6 shadow-sm">
            <form onSubmit={handlePostSubmit} className="space-y-4">
              
              {/* Category tags selector */}
              <div className="flex flex-wrap gap-1.5 pb-2">
                {[
                  { tag: 'TESTIMONY', label: 'Testimony', icon: '🕊️' },
                  { tag: 'QUESTION', label: 'Question', icon: '❓' },
                  { tag: 'ENCOURAGEMENT', label: 'Encouragement', icon: '🤝' },
                  { tag: 'REPORT', label: 'Ministry Report', icon: '📄' },
                  { tag: 'RELATIONSHIP', label: 'Relationship', icon: '💬' }
                ].map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => setPostTag(item.tag)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 border ${postTag === item.tag ? 'bg-blue-900 border-blue-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-indigo-700 flex items-center justify-center text-white font-bold shrink-0">
                  {user?.profile?.firstName?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder={
                      postTag === 'TESTIMONY' ? "Share a breakthrough, testimony, or victory God has done in your ministry..." :
                      postTag === 'QUESTION' ? "Ask a pedagogical or scriptural question to start a study discussion..." :
                      postTag === 'ENCOURAGEMENT' ? "Write an encouraging word, prayer, or scripture to lift the body..." :
                      postTag === 'REPORT' ? "Describe a ministry report, outreach summary, or ministry activity updates..." :
                      "Connect with others! Introduce yourself, find study partners, or request fellowship alignment..."
                    }
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                <span className="text-[10px] font-bold text-slate-400">
                  Posting to: <span className="text-slate-600 uppercase font-black">
                    {selectedGroupId ? dbGroups.find((g: any) => g.id === selectedGroupId)?.name : 'All Spaces'}
                  </span>
                </span>
                <button 
                  type="submit" 
                  disabled={!postContent.trim() || postMutation.isPending}
                  className="bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-800 disabled:opacity-50 transition-all text-xs flex items-center gap-1.5"
                >
                  {postMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Share
                </button>
              </div>
            </form>
          </div>

          {/* Post Filter Bar */}
          <div className="bg-white border border-slate-200/50 p-3 rounded-2xl shadow-sm flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1"><Filter size={12} /> Filter by type:</span>
            <button
              onClick={() => setSelectedTagFilter(null)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${!selectedTagFilter ? 'bg-blue-950 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              All Posts
            </button>
            {[
              { tag: 'TESTIMONY', label: 'Testimonies', icon: '🕊️' },
              { tag: 'QUESTION', label: 'Questions', icon: '❓' },
              { tag: 'ENCOURAGEMENT', label: 'Encouragements', icon: '🤝' },
              { tag: 'REPORT', label: 'Reports', icon: '📄' },
              { tag: 'RELATIONSHIP', label: 'Relationships', icon: '💬' }
            ].map((item) => (
              <button
                key={item.tag}
                onClick={() => setSelectedTagFilter(item.tag)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${selectedTagFilter === item.tag ? 'bg-blue-950 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          {postsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white h-40 border border-slate-200/50 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white border border-slate-200/50 rounded-3xl p-12 text-center shadow-sm">
              <Users size={48} className="text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800">No Posts Yet</h3>
              <p className="text-slate-500 text-xs mt-1">Be the first to encourage fellow student ministers in this space!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts
                .filter((post: any) => {
                  if (!selectedTagFilter) return true;
                  return post.content.startsWith(`[${selectedTagFilter}]`);
                })
                .map((post: any) => {
                  const hasLiked = post.likes?.some((like: any) => like.userId === user?.id);
                  const commentsList = post.comments || [];
                  const { type: postType, rawContent } = parsePostContent(post.content);

                  return (
                    <div key={post.id} className="bg-white border border-slate-200/50 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
                      
                      {/* Post Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center font-bold text-blue-900 shrink-0 border border-indigo-200/40">
                            {post.user?.profile?.firstName?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="flex items-center flex-wrap gap-2">
                              <p className="text-sm font-black text-slate-800">
                                {post.user?.profile ? `${post.user.profile.firstName} ${post.user.profile.lastName}` : post.user?.email}
                              </p>
                              <span className="text-[9px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full uppercase font-black">STUDENT</span>
                              {renderPostBadge(postType)}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{timeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                        <button className="text-slate-300 hover:text-slate-600 transition-colors p-1">
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      {/* Post Body */}
                      <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                        {rawContent}
                      </p>

                    {/* Action Bar */}
                    <div className="flex items-center gap-5 border-t border-slate-100 pt-3 text-xs font-bold text-slate-400">
                      <button 
                        onClick={() => likeMutation.mutate(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-rose-500' : 'hover:text-slate-600'}`}
                      >
                        <Heart size={16} className={hasLiked ? 'fill-rose-500 text-rose-500' : ''} />
                        {post._count?.likes || 0} Likes
                      </button>

                      <button 
                        onClick={() => toggleCommentsView(post.id)}
                        className="flex items-center gap-1.5 hover:text-slate-600 transition-colors"
                      >
                        <MessageSquare size={16} />
                        {post._count?.comments || 0} Comments
                      </button>
                    </div>

                    {/* Comments section */}
                    {showComments[post.id] && (
                      <div className="border-t border-slate-100 pt-4 space-y-4 bg-slate-50/50 p-4 rounded-2xl">
                        
                        {/* Nested comments list */}
                        {commentsList.length > 0 && (
                          <div className="space-y-3">
                            {commentsList.slice(0, visibleComments[post.id] || 3).map((comm: any) => (
                              <div key={comm.id} className="flex gap-2 text-xs">
                                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 text-[10px]">
                                  {comm.user?.profile?.firstName?.[0] || 'U'}
                                </div>
                                <div className="bg-white border border-slate-100 p-2.5 rounded-xl flex-1">
                                  <div className="flex items-center justify-between mb-0.5 font-bold text-[10px]">
                                    <span className="text-slate-800">{comm.user?.profile ? `${comm.user.profile.firstName} ${comm.user.profile.lastName}` : comm.user?.email}</span>
                                    <span className="text-slate-400">{timeAgo(comm.createdAt)}</span>
                                  </div>
                                  <p className="text-slate-600 font-medium">{comm.content}</p>
                                </div>
                              </div>
                            ))}
                            {commentsList.length > (visibleComments[post.id] || 3) && (
                              <button 
                                type="button"
                                onClick={() => setVisibleComments(prev => ({ ...prev, [post.id]: (prev[post.id] || 3) + 5 }))}
                                className="text-[10px] font-black text-blue-900 hover:text-blue-700 mt-2 block transition-colors bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg w-fit"
                              >
                                Load more comments ({commentsList.length - (visibleComments[post.id] || 3)} remaining)
                              </button>
                            )}
                          </div>
                        )}

                        {/* Inline comment form */}
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={commentContent[post.id] || ''}
                            onChange={(e) => setCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCommentSubmit(post.id);
                            }}
                            placeholder="Add kind words..."
                            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                          />
                          <button 
                            onClick={() => handleCommentSubmit(post.id)}
                            className="bg-blue-900 text-white p-2.5 rounded-xl hover:bg-blue-800 transition-colors shrink-0 flex items-center justify-center"
                          >
                            <Send size={12} />
                          </button>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </main>

        {/* Right Panel widgets (3-Cols) */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Active Members */}
          <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Active Fellowship</h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-blue-950">EA</div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Evangelist Arthur</p>
                  <span className="text-[9px] font-bold text-slate-400">Pastor • Online</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-blue-950">SN</div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Sister Naomi</p>
                  <span className="text-[9px] font-bold text-slate-400">Mentee • Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Testimony Ticker */}
          <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-indigo-900">
              <Sparkles size={16} />
              <h4 className="font-bold text-xs uppercase tracking-wider">Praise Reports</h4>
            </div>
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                "Our youth retreat saw 12 enrollments and three dedications! Thanks for all the prayer squads."
              </p>
              <p className="text-[10px] font-bold text-indigo-700 mt-2 text-right">— Bro. Daniel</p>
            </div>
          </div>

        </aside>

      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-none"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full p-6 md:p-8 rounded-3xl shadow-xl space-y-5 border border-slate-200/60"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900">Create Discussion Channel</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Setup a space centered around specific focus topics.</p>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Channel Name</label>
                  <input 
                    type="text" 
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g. Praise & testimonies" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Purpose / Description</label>
                  <textarea 
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="What should members post here?" 
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs font-medium transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateGroup(false)}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={!newGroupName.trim() || createGroupMutation.isPending}
                    className="flex-1 py-3 bg-blue-900 text-white rounded-xl font-bold text-xs hover:bg-blue-800 disabled:opacity-50 transition-colors"
                  >
                    {createGroupMutation.isPending ? 'Creating...' : 'Create Space'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
