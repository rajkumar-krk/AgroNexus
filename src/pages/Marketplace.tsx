import { useState } from 'react'
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
  CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Marketplace() {
  const [activeTab, setActiveTab] = useState('buy')

  const marketItems = [
    { id: 1, title: 'Premium Wheat', price: 2450, qty: '500kg', location: '12km away', seller: 'Rajesh F.', rating: 4.8, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80' },
    { id: 2, title: 'Organic Soybean', price: 5200, qty: '200kg', location: '5km away', seller: 'Meena S.', rating: 4.9, img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80' },
    { id: 3, title: 'Long-staple Cotton', price: 7800, qty: '1000kg', location: '25km away', seller: 'Kisan Coop', rating: 4.7, img: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80' },
  ]

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Store className="text-secondary" /> Agri Marketplace
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input className="pl-10 rounded-xl bg-white" placeholder="Search Mandi..." />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-2">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="buy" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-2xl h-14">
          <TabsTrigger value="buy" className="rounded-xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <ShoppingBag size={18} className="mr-2" /> Buy Inputs
          </TabsTrigger>
          <TabsTrigger value="sell" className="rounded-xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <TrendingUp size={18} className="mr-2" /> Sell Produce
          </TabsTrigger>
          <TabsTrigger value="rent" className="rounded-xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Truck size={18} className="mr-2" /> Rent Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                  <div className="relative h-48">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 backdrop-blur-md text-primary border-none font-bold">
                        {item.qty} Available
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
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <div className="text-right">
                        <p className="font-black text-primary leading-none">₹{item.price}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Per Quintal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} /> {item.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldCheck size={14} className="text-secondary" /> Verified
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                          {item.seller[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-none">{item.seller}</p>
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
        </TabsContent>

        <TabsContent value="sell" className="mt-6">
          <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
            <div className="max-w-xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-heading font-bold text-primary">Post Your Produce</h3>
                <p className="text-sm text-muted-foreground font-medium">Get the best bids from verified buyers across India</p>
              </div>

              <div className="space-y-4 bg-white p-6 rounded-2xl border-2 border-border shadow-sm">
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
                
                <div className="bg-white rounded-2xl border border-border overflow-hidden divide-y divide-border">
                  <BidItem name="Rajesh Traders" price={2450} time="2m ago" verified />
                  <BidItem name="Krishi Mandi Hub" price={2420} time="15m ago" />
                  <BidItem name="Shyam Fertilisers" price={2435} time="45m ago" verified />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

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
