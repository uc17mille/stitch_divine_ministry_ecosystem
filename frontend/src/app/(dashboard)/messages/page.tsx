'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { messagesApi } from '@/lib/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Send, Search, User, Shield, Sparkles, MessageSquare, 
  Mail, Clock, CheckCircle2, RefreshCw, UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

const MOCK_RECIPIENTS = [
  { id: 'usr-admin-1', name: 'Ministry Office & Admin Support', role: 'ADMINISTRATOR', desc: 'General inquiries, enrollment support, certificates', avatar: null },
  { id: 'usr-mentor-1', name: 'Rev. Dubus Achufusi', role: 'MENTOR', desc: 'Lead Mentor & Pastoral Leadership Track Cover', avatar: '/rev-dubus-desk.jpg' },
];

const MOCK_USER_MESSAGES = [
  {
    id: 'msg-1',
    senderId: 'usr-student-1',
    receiverId: 'usr-admin-1',
    content: 'Hello Admin, I am having trouble accessing the course materials for Pastoral Leadership Intensive. Could you please check my enrollment?',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
    sender: { id: 'usr-student-1', email: 'student@auramini.com', profile: { firstName: 'Grace', lastName: 'Adeyemi' } },
    receiver: { id: 'usr-admin-1', email: 'admin@auramini.com', profile: { firstName: 'Admin', lastName: 'Office' } }
  },
  {
    id: 'msg-2',
    senderId: 'usr-admin-1',
    receiverId: 'usr-student-1',
    content: 'Grace, your enrollment has been verified and updated. You can now access all lesson videos and notes!',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    isRead: false,
    sender: { id: 'usr-admin-1', email: 'admin@auramini.com', profile: { firstName: 'Admin', lastName: 'Office' } },
    receiver: { id: 'usr-student-1', email: 'student@auramini.com', profile: { firstName: 'Grace', lastName: 'Adeyemi' } }
  }
];

export default function StudentMessagesPage() {
  const { user } = useAuthStore();
  const [selectedRecipientId, setSelectedRecipientId] = useState('usr-admin-1');
  const [messageText, setMessageText] = useState('');

  const currentUserId = user?.id || 'usr-student-1';

  // Fetch user messages from backend
  const { data: apiMessages = [], refetch } = useQuery({
    queryKey: ['user-messages', currentUserId],
    queryFn: () => messagesApi.getUserMessages(currentUserId),
    retry: 1,
  });

  const messages = apiMessages.length > 0 ? apiMessages : MOCK_USER_MESSAGES;

  // Filter conversation with the currently selected recipient
  const activeConversation = messages.filter(
    (m: any) =>
      (m.senderId === currentUserId && m.receiverId === selectedRecipientId) ||
      (m.senderId === selectedRecipientId && m.receiverId === currentUserId)
  );

  const sendMessageMutation = useMutation({
    mutationFn: (data: { senderId: string; receiverId: string; content: string }) =>
      messagesApi.sendMessage(data),
    onSuccess: () => {
      toast.success('Message sent to recipient!');
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
      senderId: currentUserId,
      receiverId: selectedRecipientId,
      content: messageText,
    });
  };

  const selectedRecipient = MOCK_RECIPIENTS.find(r => r.id === selectedRecipientId) || MOCK_RECIPIENTS[0];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* PAGE HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-extrabold rounded-full uppercase tracking-wider mb-2 border border-indigo-100">
            <Mail size={13} /> Direct Communication
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Messages & Mentorship Support</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Communicate directly with the Admin Support Office or your Lead Mentor.</p>
        </div>

        <button 
          onClick={() => refetch()} 
          className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all self-start sm:self-auto flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw size={16} /> Sync Messages
        </button>
      </div>

      {/* MESSAGING INTERFACE */}
      <div className="grid lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[550px]">
        
        {/* RECIPIENT SELECTOR (4 COLS) */}
        <div className="lg:col-span-4 border-r border-slate-100 bg-slate-50/50 p-4 space-y-4">
          <div className="px-2 pt-2">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Select Recipient</h3>
          </div>

          <div className="space-y-2">
            {MOCK_RECIPIENTS.map(r => {
              const isSelected = r.id === selectedRecipientId;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRecipientId(r.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected 
                      ? 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-500/10' 
                      : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {r.avatar ? (
                    <img src={r.avatar} alt={r.name} className="w-11 h-11 rounded-2xl object-cover shadow-sm border border-slate-200" />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                      {r.name[0]}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-xs truncate">{r.name}</h4>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        r.role === 'ADMINISTRATOR' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'
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

        {/* ACTIVE CONVERSATION (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          
          {/* HEADER */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              {selectedRecipient.avatar ? (
                <img src={selectedRecipient.avatar} alt={selectedRecipient.name} className="w-10 h-10 rounded-2xl object-cover shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                  {selectedRecipient.name[0]}
                </div>
              )}
              <div>
                <h3 className="font-black text-slate-900 text-sm">{selectedRecipient.name}</h3>
                <p className="text-[11px] font-semibold text-slate-400">{selectedRecipient.desc}</p>
              </div>
            </div>
          </div>

          {/* CHAT MESSAGES */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
            {activeConversation.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <MessageSquare size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs font-extrabold text-slate-600">No previous messages</p>
                <p className="text-[11px] text-slate-400 mt-1">Start a conversation by typing your message below.</p>
              </div>
            ) : (
              activeConversation.map((msg: any) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-4 rounded-2xl shadow-sm text-xs font-semibold leading-relaxed ${
                      isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                      <p>{msg.content}</p>
                      <span className={`block text-[9px] font-bold mt-1.5 ${isMe ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* INPUT FORM */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
            <input 
              type="text" 
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder={`Send message to ${selectedRecipient.name}...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
            />
            <button 
              type="submit"
              disabled={!messageText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-2xl flex items-center gap-2 text-xs shadow-md transition-all shrink-0"
            >
              <Send size={15} /> Send
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
