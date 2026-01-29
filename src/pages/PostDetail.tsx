import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useToast } from '../lib/ToastContext';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';
import Badge from '../components/Badge';

interface PostAuthor {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
}

interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  tags: string[];
  topic: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author?: PostAuthor;
}

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: PostAuthor;
}

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
      checkIfLiked();
    }
  }, [postId, user]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('cafecito_posts')
        .select(`
          *,
          author:profiles!author_id(id, full_name, avatar_url, bio)
        `)
        .eq('id', postId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPost(data as Post);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('cafecito_comments')
        .select(`
          *,
          author:profiles!author_id(id, full_name, avatar_url, bio)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const checkIfLiked = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cafecito_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    if (!user || !post) return;

    try {
      if (isLiked) {
        await supabase
          .from('cafecito_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        await supabase
          .from('cafecito_posts')
          .update({ likes_count: Math.max(0, post.likes_count - 1) })
          .eq('id', postId);

        setPost({ ...post, likes_count: Math.max(0, post.likes_count - 1) });
        setIsLiked(false);
      } else {
        await supabase
          .from('cafecito_likes')
          .insert({ post_id: postId, user_id: user.id });

        await supabase
          .from('cafecito_posts')
          .update({ likes_count: post.likes_count + 1 })
          .eq('id', postId);

        setPost({ ...post, likes_count: post.likes_count + 1 });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !post) return;

    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('cafecito_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      await supabase
        .from('cafecito_posts')
        .update({ comments_count: post.comments_count + 1 })
        .eq('id', postId);

      setNewComment('');
      fetchComments();
      setPost({ ...post, comments_count: post.comments_count + 1 });
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Enlace copiado al portapapeles', 'success');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Hace menos de 1h';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return 'Hace 1d';
    return `Hace ${Math.floor(diffInHours / 24)}d`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-[#6E6E6E]">Cargando...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6E6E6E] mb-4">Post no encontrado</p>
          <Button onClick={() => navigate('/cafecito')}>Volver a Comunidad</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/cafecito')}
          className="flex items-center text-[#6E6E6E] hover:text-[#7CA982] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a Comunidad
        </button>

        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="p-8">
            <div className="flex items-start space-x-4 mb-6">
              <img
                src={post.author?.avatar_url || 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200'}
                alt={post.author?.full_name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-[#3E6049]">
                      {post.author?.full_name}
                    </h3>
                    {post.author?.bio && (
                      <p className="text-sm text-[#6E6E6E]">{post.author.bio}</p>
                    )}
                    <p className="text-xs text-[#8E8E8E] mt-1">{formatDate(post.created_at)}</p>
                  </div>
                  <button className="text-[#6E6E6E] hover:text-[#3E6049] transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {post.topic && (
              <Badge variant="pink" className="mb-4">
                {post.topic}
              </Badge>
            )}

            <h1 className="text-3xl font-bold text-[#3E6049] mb-4">
              {post.title}
            </h1>

            <p className="text-lg text-[#5F5F5F] leading-relaxed mb-6 whitespace-pre-wrap">
              {post.content}
            </p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#CDE6E0]/30 text-[#3E6049] rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-6 pt-6 border-t border-[#E5E5E5]">
              <button
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center space-x-2 transition-colors ${
                  isLiked
                    ? 'text-[#e74865]'
                    : 'text-[#6E6E6E] hover:text-[#e74865]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{post.likes_count}</span>
              </button>

              <button className="flex items-center space-x-2 text-[#6E6E6E] hover:text-[#7CA982] transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{post.comments_count}</span>
              </button>

              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-[#6E6E6E] hover:text-[#7CA982] transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Compartir</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t-8 border-[#FAF7F2]" />

          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#3E6049] mb-6">
              Comentarios ({post.comments_count})
            </h2>

            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="flex space-x-4">
                  <img
                    src={user.user_metadata?.avatar_url || 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200'}
                    alt="Tu avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe un comentario..."
                      className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CA982] resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        type="submit"
                        disabled={!newComment.trim() || submittingComment}
                        className="flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>{submittingComment ? 'Enviando...' : 'Comentar'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-[#CDE6E0]/20 rounded-xl p-6 mb-8 text-center">
                <p className="text-[#6E6E6E] mb-4">
                  Inicia sesión para comentar y participar en la conversación
                </p>
                <Link to="/login">
                  <Button>Iniciar sesión</Button>
                </Link>
              </div>
            )}

            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-center text-[#8E8E8E] py-8">
                  No hay comentarios todavía. ¡Sé la primera en comentar!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <img
                      src={comment.author?.avatar_url || 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200'}
                      alt={comment.author?.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-[#3E6049]">
                            {comment.author?.full_name}
                          </span>
                          <span className="text-xs text-[#8E8E8E]">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-[#5F5F5F]">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
