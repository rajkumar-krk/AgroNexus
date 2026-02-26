import { useState, useEffect } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import {
  Users,
  MessageSquare,
  Trophy,
  PlayCircle,
  Search,
  Mic,
  CheckCircle2,
  Eye,
  ThumbsUp,
  Share2,
  ChevronRight,
  Plus
} from 'lucide-react'
import { motion } from 'framer-motion'
import { TrustScore } from '../components/TrustScore'

export function Community() {
  const [activeCategory, setActiveCategory] = useState('questions')
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Use local seed data for community posts
        const seedPosts = [
          {
            id: 'cp-1',
            authorName: 'Suresh Kumar',
            authorId: 'u1',
            title: 'Tomato leaf curl - organic cure?',
            content: 'My tomato plants in Block C are showing signs of leaf curl. Are there any organic sprays I can use before it spreads?',
            viewsCount: 1240,
            answersCount: 23,
            isVerified: 1,
            userId: 'demo'
          },
          {
            id: 'cp-2',
            authorName: 'Meena Sharma',
            authorId: 'u2',
            title: 'Successful drip irrigation setup',
            content: 'Finally set up the IoT drip system. Saved nearly 40% water this week! Happy to help others with the technical part.',
            viewsCount: 850,
            answersCount: 12,
            isVerified: 0,
            userId: 'demo'
          },
          {
            id: 'cp-3',
            authorName: 'Anand Reddy',
            authorId: 'u3',
            title: 'Best Rabi season practices for wheat in Telangana',
            content: 'What seed variety and sowing practices are recommended for wheat in Telangana this season? Looking for veterans\' advice.',
            viewsCount: 670,
            answersCount: 8,
            isVerified: 1,
            userId: 'demo'
          }
        ]
        setPosts(seedPosts)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const categories = [
    { id: 'questions', label: 'Questions', icon: MessageSquare },
    { id: 'stories', label: 'Success Stories', icon: Trophy },
    { id: 'tips', label: 'Farming Tips', icon: CheckCircle2 },
  ]

  if (loading) return null

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Users className="text-primary" /> Kisan Connect
        </h2>
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input className="pl-10 rounded-xl bg-card" placeholder="Search discussions..." />
        </div>
      </div>

      {/* Farmer Trust Score */}
      <TrustScore />

      {/* Gamification Stats */}
      <Card className="p-4 bg-gradient-to-r from-primary to-secondary text-white overflow-hidden relative group">
        <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
          <Trophy size={140} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-none text-[10px] font-bold">LEVEL 7</Badge>
              <span className="font-heading font-black text-xl tracking-tight">Krishi Mitra (Farmer Friend)</span>
            </div>
            <div className="w-full md:w-64 h-2.5 bg-white/20 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                className="h-full bg-accent"
              />
            </div>
            <p className="text-[10px] font-bold text-white/80 tracking-widest uppercase">2,340 XP • 660 XP to Level 8</p>
          </div>
          <div className="flex gap-4">
            <BadgeItem icon="🌾" label="Early Adopter" />
            <BadgeItem icon="💧" label="Water Warrior" />
            <BadgeItem icon="🎓" label="Knowledge Sharer" />
          </div>
        </div>
      </Card>

      {/* Category Nav */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeCategory === cat.id
              ? 'bg-primary text-white shadow-lg'
              : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
          >
            <cat.icon size={18} />
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-5 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary">
                    {post.authorName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm">{post.authorName}</p>
                      {Number(post.isVerified) > 0 && (
                        <Badge className="bg-sprout/20 text-primary border-none text-[8px] h-4 flex items-center gap-1">
                          <CheckCircle2 size={10} /> VERIFIED
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">Posted 2 hours ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Plus size={18} className="rotate-45" />
                </Button>
              </div>

              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {post.content}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye size={16} />
                    <span className="text-xs font-bold">{post.viewsCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MessageSquare size={16} />
                    <span className="text-xs font-bold">{post.answersCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg gap-1.5">
                    <ThumbsUp size={14} /> <span className="text-xs font-bold">Helpful</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                    <Share2 size={14} />
                  </Button>
                </div>
              </div>

              {Number(post.isVerified) > 0 && (
                <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary mb-1">Expert Answer (Dr. Sharma)</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">Apply a mix of neem oil and soap solution every evening...</p>
                  </div>
                  <ChevronRight size={16} className="text-primary mt-3" />
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Video Tips Section */}
      <div className="pt-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <PlayCircle size={20} className="text-destructive" /> Featured Video Tips
        </h3>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          <VideoCard
            title="Drip Irrigation DIY"
            views="45k"
            img="https://images.unsplash.com/photo-1599148400620-8e1ff0bf28d8?auto=format&fit=crop&q=80"
          />
          <VideoCard
            title="Organic Pest Control"
            views="120k"
            img="https://images.unsplash.com/photo-1597362905293-385650fd540e?auto=format&fit=crop&q=80"
          />
        </div>
      </div>

      {/* Floating Action Buttons Area Replacement for Community */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 lg:bottom-10">
        <div className="bg-primary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 border border-white/20">
          <Button variant="ghost" className="p-0 h-auto text-white flex items-center gap-2 hover:bg-transparent">
            <Mic size={20} /> <span className="font-bold text-sm">Ask via Voice</span>
          </Button>
          <div className="w-px h-4 bg-white/30" />
          <Button variant="ghost" className="p-0 h-auto text-white flex items-center gap-2 hover:bg-transparent">
            <Plus size={20} /> <span className="font-bold text-sm">Post Question</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

function BadgeItem({ icon, label }: { icon: string, label: string }) {
  return (
    <div className="flex flex-col items-center group cursor-help">
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[8px] font-bold mt-1 text-white/70 uppercase tracking-tighter">{label}</span>
    </div>
  )
}

function VideoCard({ title, views, img }: { title: string, views: string, img: string }) {
  return (
    <div className="min-w-[200px] group cursor-pointer">
      <div className="relative h-28 rounded-2xl overflow-hidden mb-2">
        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={title} />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <PlayCircle className="text-white opacity-80" size={32} />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white font-bold">
          12:45
        </div>
      </div>
      <p className="font-bold text-xs truncate leading-tight">{title}</p>
      <p className="text-[10px] text-muted-foreground font-medium">{views} views • 👍 4.5k</p>
    </div>
  )
}
