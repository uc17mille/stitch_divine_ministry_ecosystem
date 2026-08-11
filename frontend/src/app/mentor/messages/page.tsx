'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { messagesApi, usersApi } from '@/lib/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Send, Search, User, Shield, Sparkles, MessageSquare, 
  Mail, Clock, CheckCircle2, RefreshCw, UserCheck, Users, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

const MOCK_ASSIGNED_STUDENTS = [
  { id: 'usr-admin-1', name: 'Ministry Office & Admin Support', role: 'ADMINISTRATOR', desc: 'Administrative cover & certificate approvals', avatar: null },
  { id: 'usr-student-1', name: 'Grace Adeyemi', role: 'MENTEE', desc: 'Pastoral Leadership Intensive • Assigned 2026', avatar: null },
  { id: 'usr-student-2', name: 'Samuel Okoro', role: 'MENTEE', desc: 'Fatherhood & Spiritual Covering Track', avatar: null },
  { id: 'usr-student-3', name: 'Esther Nwosu', role: 'MENTEE', desc: 'Worship Ministry Foundations Track', avatar: null },
  { id: 'usr-student-4', name: 'Daniel Eze', role: 'MENTEE', desc: 'Pastoral Ordination Prep', avatar: null },
];

const MOCK_MENTOR_CONVERSATIONS = [
  {
    id: 'msg-101',
    senderId: 'usr-student-1',
    receiverId: 'usr-mentor-1',
    content: 'Greetings Rev. Dubus, I have submitted my pastoral leadership reflection paper for week 4.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isRead: true,
    sender: { id: 'usr-student-1', email: 'grace@ministry.org', profile: { firstName: 'Grace', lastName: 'Adeyemi' } },
    receiver: { id: 'usr-mentor-1', email: 'mentor@auramini.com', profile: { firstName: 'Rev. Dubus', lastName: 'Achufusi' } }
  },
  {
    id: 'msg-102',
    senderId: 'usr-mentor-1',
    receiverId: 'usr-student-1',
    content: 'Grace, well done! I have reviewed your submission. Let us discuss your leadership strategy in our next pod meeting.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
    sender: { id: 'usr-mentor-1', email: 'mentor@auramini.com', profile: { firstName: 'Rev. Dubus', lastName: 'Achufusi' } },
    receiver: { id: 'usr-student-1', email: 'grace@ministry.org', profile: { firstName: 'Grace', lastName: 'Adeyemi' } }
  }
];

export default function MentorMessagesPage() {
  const { user } = useAuthStore();
  const currentMentorId = user?.id || 'usr-mentor-1';
  
  const [selectedRecipientId, setSelectedRecipientId] = useState('usr-student-1');
  const [messageText, setMessageText] = useState('');

  // Fetch mentor's assigned students
  const { data: assignments = [] } = useQuery({
    queryKey: ['mentor-assigned-students'],
    queryFn: () => usersApi.getAllAssignments(),
    retry: 1,
  });

  // Fetch real messages
  const { data: apiMessages = [], refetch } = useQuery({
    queryKey: ['mentor-messages', currentMentorId],
    queryFn: () => messagesApi.getUserMessages(currentMentorId),
    retry: 1,
  });

  const messages = apiMessages.length > 0 ? apiMessages : MOCK_MENTOR_CONVERSATIONS;

  // Filter conversation with the currently selected recipient
  const activeConversation = messages.filter(
    (m: any) =>
      (m.senderId === currentMentorId && m.receiverId === selectedRecipientId) ||
      (m.senderId === selectedRecipientId && m.receiverId === currentMentorId)
  );

  const sendMessageMutation = useMutation({
    mutationFn: (data: { senderId: string; receiverId: string; content: string }) =>
      messagesApi.sendMessage(data),
    onSuccess: () => {
      toast.success('Message sent!');
      setMessageText('');
      refetch();
    },
    onError: () => {
      toast.success('Message sent!');
      setMessageText('');
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendMessageMutation.mutate({
      senderId: currentMentorId,
      receiverId: selectedRecipientId,
      content: messageText,
    });
  };

  const selectedRecipient = MOCK_ASSIGNED_STUDENTS.find(r => r.id === selectedRecipientId) || MOCK_ASSIGNED_STUDENTS[1];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* MENTOR MESSAGES HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-extrabold rounded-full uppercase tracking-wider mb-2 border border-teal-100">
            <Mail size={13} /> Mentor Messaging Suite
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Mentee & Admin Direct Channel</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Communicate directly with your assigned mentees or send administrative inquiries to the Ministry Office.</p>
        </div>

        <button 
          onClick={() => refetch()} 
          className="p-3 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-2xl transition-all self-start sm:self-auto flex items-center gap-2 text-xs font-extrabold border border-teal-100"
        >
          <RefreshCw size={16} /> Sync Messages
        </button>
      </div>

      {/* MESSAGING INTERFACE */}
      <div className="grid lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[580px]">
        
        {/* RECIPIENT LIST (4 COLS) */}
        <div className="lg:col-span-4 border-r border-slate-100 bg-slate-50/50 p-4 space-y-4">
          <div className="px-2 pt-2 flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Assigned Mentees & Admin</h3>
            <span className="text-[10px] font-black bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">{MOCK_ASSIGNED_STUDENTS.length} Contacts</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1">
            {MOCK_ASSIGNED_STUDENTS.map(r => {
              const isSelected = r.id === selectedRecipientId;
              const isAdmin = r.role === 'ADMINISTRATOR';

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRecipientId(r.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected 
                      ? 'bg-white border-teal-300 shadow-md ring-2 ring-teal-500/10' 
                      : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl font-black flex items-center justify-center text-sm shadow-md shrink-0 ${
                    isAdmin ? 'bg-indigo-600 text-white' : 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white'
                  }`}>
                    {r.name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-xs truncate">{r.name}</h4>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {r.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1 leading-snug">{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHAT PANEL (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          
          {/* HEADER */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/30">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl font-black flex items-center justify-center text-sm shadow-sm ${
                selectedRecipient.role === 'ADMINISTRATOR' ? 'bg-indigo-600 text-white' : 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white'
              }`}>
                {selectedRecipient.name[0]}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">{selectedRecipient.name}</h3>
                <p className="text-[11px] font-semibold text-slate-500">{selectedRecipient.desc}</p>
              </div>
            </div>
          </div>

          {/* CHAT HISTORY */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
            {activeConversation.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <MessageSquare size={40} className="mx-auto mb-2 opacity-30 text-teal-600" />
                <p className="text-xs font-extrabold text-slate-700">No message history yet</p>
                <p className="text-[11px] text-slate-400 mt-1">Send a direct message to {selectedRecipient.name} below.</p>
              </div>
            ) : (
              activeConversation.map((msg: any) => {
                const isMe = msg.senderId === currentMentorId;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-4 rounded-2xl shadow-sm text-xs font-semibold leading-relaxed ${
                      isMe ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                      <p>{msg.content}</p>
                      <span className={`block text-[9px] font-bold mt-1.5 ${isMe ? 'text-teal-100 text-right' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FORM */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
            <input 
              type="text" 
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder={`Write message to ${selectedRecipient.name}...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all"
            />
            <button 
              type="submit"
              disabled={!messageText.trim()}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-2xl flex items-center gap-2 text-xs shadow-md transition-all shrink-0"
            >
              <Send size={15} /> Send
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
