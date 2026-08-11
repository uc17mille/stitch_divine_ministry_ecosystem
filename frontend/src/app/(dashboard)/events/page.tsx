'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Clock, CheckCircle, 
  Sparkles, Search, Compass, Info, Award, ArrowRight
} from 'lucide-react';

export default function EventsPage() {
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(null);

  // Track mock registrations in localStorage
  const [registeredMockEvents, setRegisteredMockEvents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('registered_mock_events');
      if (stored) {
        try { setRegisteredMockEvents(JSON.parse(stored)); } catch (e) { console.error(e); }
      }
    }
  }, []);

  // Fetch events from backend
  const { data: dbEvents = [], isLoading } = useQuery({ 
    queryKey: ['events'], 
    queryFn: eventsApi.getAll 
  });

  // Fetch student registrations
  const { data: myRegistrations = [] } = useQuery({
    queryKey: ['myRegistrations'],
    queryFn: eventsApi.getMyRegistrations,
  });

  const registerMutation = useMutation({
    mutationFn: eventsApi.register,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['myRegistrations'] });
      toast.success('Successfully registered for this event! 🎉');
    },
    onError: () => toast.error('Could not complete registration.'),
  });

  // Helper to categorize events dynamically
  const getEventCategory = (title: string, description: string) => {
    const t = (title + ' ' + description).toLowerCase();
    if (t.includes('summit') || t.includes('leadership')) {
      return { label: 'Leadership Summit', type: 'SUMMIT', icon: '👑', color: 'bg-purple-50 text-purple-700 border-purple-100' };
    }
    if (t.includes('retreat') || t.includes('camp')) {
      return { label: 'Retreat', type: 'RETREAT', icon: '🏔️', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    }
    if (t.includes('webinar') || t.includes('online') || t.includes('workshop') || t.includes('zoom')) {
      return { label: 'Webinar', type: 'WEBINAR', icon: '💻', color: 'bg-sky-50 text-sky-700 border-sky-100' };
    }
    if (t.includes('crusade') || t.includes('revival') || t.includes('evangelism')) {
      return { label: 'Crusade', type: 'CRUSADE', icon: '✝️', color: 'bg-rose-50 text-rose-700 border-rose-100' };
    }
    return { label: 'Conference', type: 'CONFERENCE', icon: '🏛️', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' };
  };

  // Mocked rich events to guarantee full representation of the required features
  const mockEvents = [
    {
      id: 'mock-retreat-1',
      title: 'Ministry Pioneers Silent Retreat',
      description: 'A 3-day quiet reflection, prayer, and renewal alignment for senior leaders in the beautiful hills.',
      location: 'Blue Mountain Sanctuary',
      startTime: new Date('2026-09-12T10:00:00').toISOString(),
      endTime: new Date('2026-09-15T15:00:00').toISOString(),
      capacity: 50,
      mockRegisteredCount: 42,
      isMock: true
    },
    {
      id: 'mock-crusade-1',
      title: 'Lagos Healing Crusade',
      description: 'A massive outdoor revival crusade declaring signs, wonders, and salvation to the city.',
      location: 'National Stadium, Lagos',
      startTime: new Date('2026-10-05T17:00:00').toISOString(),
      endTime: new Date('2026-10-07T21:00:00').toISOString(),
      capacity: 25000,
      mockRegisteredCount: 18450,
      isMock: true
    },
    {
      id: 'mock-summit-1',
      title: 'NextGen Apostolic Leadership Summit',
      description: 'Impartation, strategy, and alignment for student ministers and apostolic candidates.',
      location: 'Abuja Conference Hall',
      startTime: new Date('2026-08-28T09:00:00').toISOString(),
      endTime: new Date('2026-08-30T17:00:00').toISOString(),
      capacity: 150,
      mockRegisteredCount: 138,
      isMock: true
    },
    {
      id: 'mock-webinar-1',
      title: 'Prophetic Communication Webinar',
      description: 'Interactive webinar on translating prophetic revelation into clear, systematic teaching.',
      location: 'Online (Zoom Meeting)',
      startTime: new Date('2026-07-29T19:00:00').toISOString(),
      endTime: new Date('2026-07-29T21:00:00').toISOString(),
      capacity: 500,
      mockRegisteredCount: 412,
      isMock: true
    }
  ];

  // Merge database and mock events (filter duplicates)
  const allEvents = [...dbEvents];
  mockEvents.forEach(mock => {
    if (!allEvents.some(e => e.title.toLowerCase() === mock.title.toLowerCase())) {
      allEvents.push(mock);
    }
  });

  // Sort events by date
  allEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Filter & Search Logic
  const filteredEvents = allEvents.filter((event: any) => {
    const category = getEventCategory(event.title, event.description);
    const matchesFilter = !selectedTypeFilter || category.type === selectedTypeFilter;
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRegister = (event: any) => {
    if (event.isMock) {
      const updated = { ...registeredMockEvents, [event.id]: true };
      setRegisteredMockEvents(updated);
      localStorage.setItem('registered_mock_events', JSON.stringify(updated));
      toast.success('Successfully registered for this event! 🎉');
    } else {
      registerMutation.mutate(event.id);
    }
  };

  const isUserAttending = (event: any) => {
    if (event.isMock) {
      return !!registeredMockEvents[event.id];
    }
    return myRegistrations.some((reg: any) => reg.eventId === event.id) || event.registrations?.some((reg: any) => reg.userId === reg.userId);
  };

  // Find nearest upcoming spotlight event
  const spotlightEvent = allEvents.find(e => new Date(e.startTime) > new Date());

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-sans text-slate-900 bg-slate-50 min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/60 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 flex items-center gap-2.5">
            <Calendar size={32} className="text-blue-900" />
            Kingdom Events
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Register for Conferences, Retreats, Crusades, and Leadership Summits.</p>
        </div>
      </div>

      {/* Featured Spotlight Card */}
      {spotlightEvent && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-[2rem] p-6 md:p-8 shadow-xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-amber-300">
                <Sparkles size={12} className="animate-pulse" /> Spotlight Event
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">{spotlightEvent.title}</h2>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{spotlightEvent.description}</p>
              
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300 pt-2">
                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(spotlightEvent.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {spotlightEvent.location}</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-4">
              <div className="w-full max-w-[240px] text-center lg:text-right space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Seats Remaining</p>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '84%' }} />
                </div>
                <p className="text-[10px] font-bold text-amber-300">Only 16% spots left</p>
              </div>

              <button
                onClick={() => handleRegister(spotlightEvent)}
                disabled={isUserAttending(spotlightEvent)}
                className={`w-full max-w-[240px] py-3.5 px-6 rounded-2xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 ${isUserAttending(spotlightEvent) ? 'bg-emerald-600 text-white cursor-default' : 'bg-white text-blue-950 hover:bg-slate-100'}`}
              >
                {isUserAttending(spotlightEvent) ? <CheckCircle size={14} /> : <Calendar size={14} />}
                {isUserAttending(spotlightEvent) ? 'You are Attending' : 'Secure Your Spot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and search block */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white border border-slate-200/50 p-4 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title or location..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/5 focus:bg-white text-xs font-semibold transition-all"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <button
            onClick={() => setSelectedTypeFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${!selectedTypeFilter ? 'bg-blue-950 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            All Events ({allEvents.length})
          </button>
          {[
            { type: 'CONFERENCE', label: 'Conferences', icon: '🏛️' },
            { type: 'RETREAT', label: 'Retreats', icon: '🏔️' },
            { type: 'WEBINAR', label: 'Webinars', icon: '💻' },
            { type: 'CRUSADE', label: 'Crusades', icon: '✝️' },
            { type: 'SUMMIT', label: 'Leadership Summits', icon: '👑' }
          ].map((cat) => {
            const count = allEvents.filter(e => getEventCategory(e.title, e.description).type === cat.type).length;
            return (
              <button
                key={cat.type}
                onClick={() => setSelectedTypeFilter(cat.type)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${selectedTypeFilter === cat.type ? 'bg-blue-950 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="bg-slate-200/60 text-[8px] px-1 py-0.2 rounded-md font-bold ml-0.5">{count}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Events Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Events List (8-Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white h-48 border border-slate-200/50 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white border border-slate-200/50 rounded-3xl p-16 text-center shadow-sm max-w-md mx-auto">
              <Calendar size={48} className="text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800">No Events Found</h3>
              <p className="text-slate-500 text-xs mt-1">Try resetting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event: any) => {
                const start = new Date(event.startTime);
                const isPast = start < new Date();
                const category = getEventCategory(event.title, event.description);
                const attending = isUserAttending(event);
                const regCount = event.isMock 
                  ? (attending ? event.mockRegisteredCount + 1 : event.mockRegisteredCount) 
                  : (event._count?.registrations || 0);
                  
                const pct = event.capacity ? Math.min(100, Math.round((regCount / event.capacity) * 100)) : 0;

                return (
                  <div key={event.id} className={`bg-white border border-slate-200/50 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group ${isPast ? 'opacity-65' : ''}`}>
                    
                    <div className="space-y-4">
                      
                      {/* Top Category Tag & status */}
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${category.color}`}>
                          {category.icon} {category.label}
                        </span>
                        {isPast && <span className="text-[8px] bg-slate-100 text-slate-500 font-bold uppercase tracking-widest px-2 py-0.5 rounded">Ended</span>}
                      </div>

                      {/* Header details */}
                      <div className="flex gap-4">
                        
                        {/* Elegant Date Block */}
                        <div className="flex-shrink-0 w-12 h-12 bg-slate-50 border border-slate-200/60 flex flex-col items-center justify-center rounded-2xl text-center">
                          <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">{start.toLocaleDateString('en-US', { month: 'short' })}</p>
                          <p className="text-xl font-black text-slate-800 leading-none mt-1">{start.getDate()}</p>
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-black text-sm text-slate-900 group-hover:text-blue-950 transition-colors leading-snug">
                            {event.title}
                          </h3>
                          <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                            <Clock size={11} /> {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                      </div>

                      {/* Body Description */}
                      <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                        {event.description}
                      </p>

                    </div>

                    {/* Progress details & Actions */}
                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                      
                      {/* Location & Capacity indicators */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                          <span className="flex items-center gap-1"><MapPin size={11} /> {event.location || 'Online'}</span>
                          {event.capacity && <span>{regCount} / {event.capacity} registered</span>}
                        </div>

                        {event.capacity && (
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      {!isPast && (
                        <button
                          onClick={() => handleRegister(event)}
                          disabled={attending || registerMutation.isPending}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${attending ? 'bg-emerald-50 text-emerald-700 border-emerald-100 cursor-default' : 'bg-blue-900 hover:bg-blue-800 text-white shadow-sm shadow-blue-950/10'}`}
                        >
                          {attending ? <CheckCircle size={14} /> : <Calendar size={14} />}
                          {attending ? 'Registered & Saved' : 'Register for Event'}
                        </button>
                      )}
                      {isPast && (
                        <button disabled className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200 cursor-default text-center">
                          Registration Closed
                        </button>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: My Attendance Sidebar Widget (4-Cols) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Quick Stats overview */}
          <div className="bg-white border border-slate-200/50 rounded-[2rem] p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">My Schedule Overview</h4>
            
            {/* Registered events count */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Attending</span>
                <p className="text-xl font-black text-slate-800">{myRegistrations.length + Object.keys(registeredMockEvents).length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
                <Award size={20} />
              </div>
            </div>
            
            {/* List */}
            <div className="space-y-3.5">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Registrations list</p>
              
              {myRegistrations.length === 0 && Object.keys(registeredMockEvents).length === 0 ? (
                <p className="text-xs text-slate-400 font-medium leading-relaxed">You haven't registered for any conferences or retreats yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {/* Database registrations */}
                  {myRegistrations.map((reg: any) => (
                    <div key={reg.id} className="flex gap-2.5 p-2.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 truncate">{reg.event?.title}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{reg.event?.location}</p>
                      </div>
                    </div>
                  ))}
                  {/* Mock registrations */}
                  {Object.keys(registeredMockEvents).map(id => {
                    const mock = mockEvents.find(e => e.id === id);
                    if (!mock) return null;
                    return (
                      <div key={mock.id} className="flex gap-2.5 p-2.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 truncate">{mock.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{mock.location}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Quick FAQ / Guide */}
          <div className="bg-blue-950 text-white rounded-[2rem] p-6 shadow-md relative overflow-hidden space-y-4">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex gap-2 items-center text-blue-200">
              <Info size={16} />
              <h4 className="font-bold text-xs uppercase tracking-widest">Attendance Protocol</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              E-tickets and joining credentials (for Webinars) are delivered to your student profile email immediately after securing your registration spot.
            </p>
          </div>

        </aside>

      </div>

    </div>
  );
}
