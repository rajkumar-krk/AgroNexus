import { useState, useEffect } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import {
  ShoppingBag,
  Store,
  Truck,
  Search,
  TrendingUp,
  ShieldCheck,
  Clock,
  MapPin,
  Plus,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  X,
  IndianRupee,
  Package
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'

// Seed listings for first-time load
const seedListings = [
  { cropType: 'Wheat', variety: 'HD-2967', quantity: 500, unit: 'kg', price: 2450, currency: 'INR', location: 'Hyderabad', sellerName: 'Rajesh F.', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80', isVerified: 1 },
  { cropType: 'Soybean', variety: 'JS-9560', quantity: 200, unit: 'kg', price: 5200, currency: 'INR', location: 'Pune', sellerName: 'Meena S.', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80', isVerified: 1 },
  { cropType: 'Cotton', variety: 'Bt Cotton', quantity: 1000, unit: 'kg', price: 7800, currency: 'INR', location: 'Nagpur', sellerName: 'Kisan Coop', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80', isVerified: 1 },
  { cropType: 'Rice', variety: 'Basmati', quantity: 300, unit: 'kg', price: 3600, currency: 'INR', location: 'Lucknow', sellerName: 'Anand Farms', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80', isVerified: 0 },
]

export function Marketplace() {
  const [activeTab, setActiveTab] = useState('buy')
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newListing, setNewListing] = useState({
    cropType: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    price: '',
    location: '',
  })

  // Fetch or seed listings from MongoDB
  useEffect(() => {
    const fetchListings = async () => {
      try {
        await api.seedListings()
        const data = await api.getListings()
        setListings(data)
      } catch (err) {
        console.error('Error fetching listings:', err)
        setListings(seedListings.map((s, i) => ({ id: `seed-${i}`, ...s })))
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  // Create new listing
  const handleCreateListing = async () => {
    if (!newListing.cropType || !newListing.quantity || !newListing.price) return

    const listing = {
      cropType: newListing.cropType,
      variety: newListing.variety || newListing.cropType,
      quantity: parseInt(newListing.quantity),
      unit: newListing.unit,
      price: parseInt(newListing.price),
      currency: 'INR',
      location: newListing.location || 'Hyderabad',
      sellerName: 'You',
      rating: 5.0,
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80',
      isVerified: 0,
    }

    try {
      const created = await api.createListing(listing)
      setListings(prev => [created, ...prev])
    } catch {
      setListings(prev => [{ id: `local-${Date.now()}`, ...listing }, ...prev])
    }

    setNewListing({ cropType: '', variety: '', quantity: '', unit: 'kg', price: '', location: '' })
    setShowCreateModal(false)
  }

  // Filter listings by search query
  const filteredListings = listings.filter(item =>
    !searchQuery ||
    item.cropType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.variety?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sellerName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return null

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Store className="text-secondary" /> Agri Marketplace
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              className="pl-10 rounded-xl bg-card"
              placeholder="Search Mandi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-2">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="buy" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-2xl h-14">
          <TabsTrigger value="buy" className="rounded-xl font-bold text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <ShoppingBag size={18} className="mr-2" /> Buy Inputs
          </TabsTrigger>
          <TabsTrigger value="sell" className="rounded-xl font-bold text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <TrendingUp size={18} className="mr-2" /> Sell Produce
          </TabsTrigger>
          <TabsTrigger value="rent" className="rounded-xl font-bold text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Truck size={18} className="mr-2" /> Rent Tools
          </TabsTrigger>
        </TabsList>

        {/* ═══ BUY TAB — Dynamic Listings ═══ */}
        <TabsContent value="buy" className="mt-6 space-y-6">
          {/* Create Listing Button */}
          <div className="flex justify-end">
            <Button onClick={() => setShowCreateModal(true)} className="rounded-xl font-bold shadow-lg shadow-primary/20">
              <Plus size={18} className="mr-1" /> Create Listing
            </Button>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                  <div className="relative h-48">
                    <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.cropType} />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 backdrop-blur-md text-primary border-none font-bold">
                        {item.quantity}{item.unit} Available
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-destructive shadow-sm">
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{item.cropType}</h3>
                        <p className="text-xs text-muted-foreground">{item.variety}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary leading-none">₹{item.price?.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Per Quintal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} /> {item.location}
                      </div>
                      {Number(item.isVerified) > 0 && (
                        <div className="flex items-center gap-1">
                          <ShieldCheck size={14} className="text-secondary" /> Verified
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                          {item.sellerName?.[0] || '?'}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-none">{item.sellerName}</p>
                          <p className="text-[10px] text-accent font-bold">⭐ {item.rating}</p>
                        </div>
                      </div>
                      <Button size="sm" className="rounded-lg font-bold">View Deal</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <Card className="p-8 text-center border-dashed">
              <Package size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="font-bold">No listings found</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different search or create a new listing.</p>
            </Card>
          )}
        </TabsContent>

        {/* ═══ SELL TAB ═══ */}
        <TabsContent value="sell" className="mt-6">
          <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <div className="max-w-xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-heading font-bold text-primary">Post Your Produce</h3>
                <p className="text-sm text-muted-foreground font-medium">Get the best bids from verified buyers across India</p>
              </div>

              <div className="space-y-4 bg-card p-6 rounded-2xl border-2 border-border shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Crop</label>
                    <Input className="rounded-xl h-12 font-bold" defaultValue="Wheat (Gehun)" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quantity (Quintals)</label>
                    <Input className="rounded-xl h-12 font-bold" defaultValue="50" type="number" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/5 border-2 border-secondary/20 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-secondary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">AI Price Suggestion</span>
                    </div>
                    <Badge className="bg-secondary text-white border-none text-[10px] animate-pulse">Live</Badge>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-black text-secondary">₹2,420 - ₹2,480</p>
                      <p className="text-[10px] font-bold text-muted-foreground italic">Current Mandi Rate: ₹2,380</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-secondary font-bold h-8 px-2 hover:bg-secondary/10">
                      Why this price? <CheckCircle2 size={12} className="ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your Asking Price</label>
                  <Input className="rounded-xl h-14 text-xl font-black text-primary border-2 focus:border-primary" defaultValue="2450" />
                </div>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button className="h-14 rounded-xl font-black text-lg shadow-xl shadow-primary/20">
                    Post to Mandi
                  </Button>
                  <Button variant="outline" className="h-14 rounded-xl font-bold border-2 flex items-center gap-2">
                    <Plus size={20} /> Add Quality Photos
                  </Button>
                </div>
              </div>

              {/* Live Bids Simulation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Clock size={14} /> Live Bids Today
                  </h4>
                  <span className="text-[10px] font-bold text-secondary">3 New Bids</span>
                </div>

                <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
                  <BidItem name="Rajesh Traders" price={2450} time="2m ago" verified />
                  <BidItem name="Krishi Mandi Hub" price={2420} time="15m ago" />
                  <BidItem name="Shyam Fertilisers" price={2435} time="45m ago" verified />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ═══ RENT TAB ═══ */}
        <TabsContent value="rent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RentalCard
              title="Modern Tractor (4x4)"
              price={800}
              owner="Suresh Tools"
              rating={4.7}
              img="https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80"
            />
            <RentalCard
              title="Drone Spray Service"
              price={1200}
              owner="AgriFly Tech"
              rating={4.9}
              img="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Blockchain Badge Info */}
      <Card className="p-4 bg-muted/20 border-dashed flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
          <ShieldCheck size={28} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold leading-none mb-1">Blockchain Verified Marketplace</h4>
          <p className="text-xs text-muted-foreground">Every transaction is secured, transparent, and verified on-chain to prevent fraud.</p>
        </div>
        <Button variant="ghost" size="sm" className="text-secondary font-bold underline">Learn More</Button>
      </Card>

      {/* ═══ CREATE LISTING MODAL ═══ */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-secondary text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-heading font-bold">Create Listing</h3>
                  <p className="text-xs text-white/80">List your produce on the marketplace</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Crop Type *</label>
                  <Input
                    value={newListing.cropType}
                    onChange={(e) => setNewListing(prev => ({ ...prev, cropType: e.target.value }))}
                    placeholder="e.g. Wheat, Rice, Cotton"
                    className="rounded-xl h-12 font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Variety</label>
                    <Input
                      value={newListing.variety}
                      onChange={(e) => setNewListing(prev => ({ ...prev, variety: e.target.value }))}
                      placeholder="e.g. HD-2967"
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location</label>
                    <Input
                      value={newListing.location}
                      onChange={(e) => setNewListing(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Your city"
                      className="rounded-xl h-12"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quantity (kg) *</label>
                    <Input
                      type="number"
                      value={newListing.quantity}
                      onChange={(e) => setNewListing(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="500"
                      className="rounded-xl h-12 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price (₹/quintal) *</label>
                    <Input
                      type="number"
                      value={newListing.price}
                      onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="2450"
                      className="rounded-xl h-12 font-bold"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateListing}
                  disabled={!newListing.cropType || !newListing.quantity || !newListing.price}
                  className="w-full h-14 rounded-xl font-bold text-lg shadow-xl shadow-primary/20"
                >
                  <Plus size={20} className="mr-2" /> Post Listing
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BidItem({ name, price, time, verified = false }: { name: string, price: number, time: string, verified?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs">
          {name[0]}
        </div>
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-bold leading-none">{name}</p>
            {verified && <ShieldCheck size={12} className="text-secondary" />}
          </div>
          <p className="text-[10px] text-muted-foreground">{time}</p>
        </div>
      </div>
      <div className="text-right flex items-center gap-3">
        <div>
          <p className="text-sm font-black text-primary leading-none">₹{price}/q</p>
          <p className="text-[10px] text-sprout font-bold uppercase tracking-tighter">Matched Ask</p>
        </div>
        <Button size="sm" className="rounded-lg h-8 text-xs font-bold">Accept</Button>
      </div>
    </div>
  )
}

function RentalCard({ title, price, owner, rating, img }: { title: string, price: number, owner: string, rating: number, img: string }) {
  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden hover:border-primary/20 transition-all">
      <div className="w-full sm:w-40 h-40">
        <img src={img} className="w-full h-full object-cover" alt={title} />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{title}</h3>
            <Badge variant="outline" className="text-secondary border-secondary/20">Available</Badge>
          </div>
          <p className="text-xs text-muted-foreground font-medium">By {owner} • ⭐ {rating}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-lg font-black text-primary">₹{price}<span className="text-xs font-normal text-muted-foreground">/day</span></p>
          </div>
          <Button size="sm" className="rounded-xl font-bold px-6">Book Now</Button>
        </div>
      </div>
    </Card>
  )
}
