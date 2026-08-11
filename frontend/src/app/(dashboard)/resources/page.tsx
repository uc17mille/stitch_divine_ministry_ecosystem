'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { resourcesApi } from '@/lib/api';
import { toast } from 'sonner';
import { FolderOpen, Download, Search, ExternalLink } from 'lucide-react';

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources', search],
    queryFn: () => resourcesApi.getAll(search || undefined),
  });

  const downloadMutation = useMutation({
    mutationFn: resourcesApi.download,
    onSuccess: () => toast.success('Download recorded!'),
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><FolderOpen size={28} className="text-cyan-400" /> Resource Library</h1>
        <p className="text-slate-500">Access books, study guides, and ministry tools</p>
      </div>
      <div className="relative max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="input-field pl-12" />
      </div>
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <div key={i} className="glass-card h-40 animate-pulse" />)}</div>
      ) : resources.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <FolderOpen size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">No resources found yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource: any) => (
            <div key={resource.id} className="glass-card p-6 flex flex-col gap-4">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                <FolderOpen size={24} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold">{resource.title}</h3>
                {resource.description && <p className="text-slate-500 text-sm mt-1">{resource.description}</p>}
                <p className="text-xs text-slate-500 mt-2">{resource._count?.downloads || 0} downloads</p>
              </div>
              <div className="flex gap-2 mt-auto">
                <a href={resource.url} target="_blank" rel="noopener noreferrer"
                  onClick={() => downloadMutation.mutate(resource.id)}
                  className="btn-primary flex-1 text-sm py-2">
                  <Download size={14} /> Download
                </a>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn-ghost border border-slate-200 p-2">
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
