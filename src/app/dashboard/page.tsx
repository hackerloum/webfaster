'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Plus,
  Sparkles,
  Globe,
  Clock,
  TrendingUp,
  MoreVertical,
  Search,
  Filter,
  FolderOpen,
  Zap,
  Users,
  BarChart3,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  Download,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  updatedAt: string;
  status: 'draft' | 'published';
  views: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // TODO: Fetch actual projects from API
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          name: 'Portfolio Website',
          description: 'Modern portfolio with animations',
          updatedAt: '2024-01-15T10:30:00Z',
          status: 'published',
          views: 1234,
        },
        {
          id: '2',
          name: 'E-commerce Store',
          description: 'Full-featured online store',
          updatedAt: '2024-01-14T15:20:00Z',
          status: 'draft',
          views: 456,
        },
        {
          id: '3',
          name: 'Landing Page',
          description: 'SaaS product landing page',
          updatedAt: '2024-01-13T09:15:00Z',
          status: 'published',
          views: 890,
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length.toString(),
      change: '+2 this week',
      icon: FolderOpen,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Total Views',
      value: '2.5K',
      change: '+12% this month',
      icon: Eye,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'AI Generations',
      value: '47',
      change: '+8 today',
      icon: Sparkles,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-500/10',
    },
    {
      label: 'Published Sites',
      value: '2',
      change: '1 pending',
      icon: Globe,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-500/10',
    },
  ];

  const quickActions = [
    {
      title: 'Generate with AI',
      description: 'Create a website from text prompt',
      icon: Sparkles,
      color: 'from-purple-400 to-purple-600',
      href: '/',
    },
    {
      title: 'Browse Templates',
      description: 'Start from a pre-built template',
      icon: FolderOpen,
      color: 'from-blue-400 to-blue-600',
      href: '/templates',
    },
    {
      title: 'View Analytics',
      description: 'Track your website performance',
      icon: BarChart3,
      color: 'from-pink-400 to-pink-600',
      href: '/analytics',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-500/[0.08] rounded-full blur-[120px]" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/[0.05] bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold text-white hidden sm:inline">AI Website Builder</span>
                <span className="text-xl font-bold text-white sm:hidden">Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="hidden sm:flex bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.06]"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Invite Team
                </Button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                  Welcome back, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">John</span>
                </h1>
                <p className="text-white/60 text-base sm:text-lg">
                  Let&apos;s build something amazing today
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => router.push('/')}
                className="bg-white text-black hover:bg-white/90 font-semibold h-12 sm:h-14 px-6 sm:px-8 w-full sm:w-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                className="bg-white/[0.02] border border-white/[0.05] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/[0.04] transition-all group"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className={`${stat.bgColor} p-2 sm:p-3 rounded-lg sm:rounded-xl`}>
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/60 mb-1 sm:mb-2">{stat.label}</div>
                <div className="text-xs text-green-400">{stat.change}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="group bg-white/[0.02] border border-white/[0.05] rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:bg-white/[0.04] transition-all"
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.color} mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{action.title}</h3>
                  <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">{action.description}</p>
                  <div className="flex items-center text-purple-400 text-xs sm:text-sm font-medium group-hover:gap-2 transition-all">
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Recent Projects</h2>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 sm:h-11 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/40 w-full sm:w-64"
                  />
                </div>
                <Button
                  variant="outline"
                  className="bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.06] h-10 sm:h-11 px-3 sm:px-4"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Filter</span>
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white/[0.02] border border-white/[0.05] rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse"
                  >
                    <div className="aspect-video bg-white/[0.05] rounded-lg sm:rounded-xl mb-4" />
                    <div className="h-5 bg-white/[0.05] rounded mb-2" />
                    <div className="h-4 bg-white/[0.05] rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.05] mb-4">
                  <FolderOpen className="w-8 h-8 text-white/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
                <p className="text-white/60 mb-6">Create your first website to get started</p>
                <Button
                  size="lg"
                  onClick={() => router.push('/')}
                  className="bg-white text-black hover:bg-white/90 font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Project
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                    className="group bg-white/[0.02] border border-white/[0.05] rounded-xl sm:rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          project.status === 'published'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => router.push(`/editor/${project.id}`)}
                            className="bg-white text-black hover:bg-white/90"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {project.name}
                        </h3>
                        <button className="text-white/40 hover:text-white/60 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(project.updatedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{project.views}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
