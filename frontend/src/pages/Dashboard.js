import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { TrendingUp, Activity, Users, Lock, BarChart3, Target, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [aiModels, setAiModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, predictionsRes, modelsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/statistics`),
        axios.get(`${BACKEND_URL}/api/predictions?status=active`),
        axios.get(`${BACKEND_URL}/api/ai-models`)
      ]);

      setStats(statsRes.data);
      setPredictions(predictionsRes.data.slice(0, 5));
      setAiModels(modelsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Mon', predictions: 45, accuracy: 88 },
    { name: 'Tue', predictions: 52, accuracy: 90 },
    { name: 'Wed', predictions: 48, accuracy: 92 },
    { name: 'Thu', predictions: 61, accuracy: 89 },
    { name: 'Fri', predictions: 55, accuracy: 94 },
    { name: 'Sat', predictions: 42, accuracy: 91 },
    { name: 'Sun', predictions: 38, accuracy: 93 }
  ];

  const categoryData = [
    { name: 'Finance', value: 35, color: '#8b5cf6' },
    { name: 'Esports', value: 25, color: '#3b82f6' },
    { name: 'Climate', value: 20, color: '#10b981' },
    { name: 'Politics', value: 12, color: '#f59e0b' },
    { name: 'Tech', value: 8, color: '#ef4444' }
  ];

  const roadmapData = [
    {
      phase: 'Phase 1 - MVP',
      status: 'completed',
      progress: 100,
      items: [
        { name: 'Basic prediction marketplace', done: true },
        { name: 'AI models leaderboard', done: true },
        { name: 'Wallet integration (MetaMask)', done: true },
        { name: 'DAO governance system', done: true },
        { name: 'Dashboard analytics', done: true }
      ]
    },
    {
      phase: 'Phase 2 - Alpha',
      status: 'in-progress',
      progress: 68,
      items: [
        { name: 'Linera smart contract structure', done: true },
        { name: 'Backend Linera adapter', done: true },
        { name: 'Indexer for state sync', done: true },
        { name: 'CLI tools', done: true },
        { name: 'Testing infrastructure', done: true },
        { name: 'Full contract implementation', done: false },
        { name: 'Testnet deployment', done: false },
        { name: 'Atoma AI inference', done: false },
        { name: 'Real oracle verification', done: false }
      ]
    },
    {
      phase: 'Phase 3 - Beta',
      status: 'planned',
      progress: 0,
      items: [
        { name: 'Fusion Hub meta-learning', done: false },
        { name: 'Dispute resolution mechanism', done: false },
        { name: 'Advanced analytics', done: false },
        { name: 'Mobile app', done: false }
      ]
    },
    {
      phase: 'Phase 4 - Mainnet',
      status: 'planned',
      progress: 0,
      items: [
        { name: 'Security audit', done: false },
        { name: 'Multi-microchain deployment', done: false },
        { name: 'Full decentralization', done: false },
        { name: 'Token launch', done: false }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === 'in-progress') return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'border-green-500/20 bg-green-500/5';
    if (status === 'in-progress') return 'border-blue-500/20 bg-blue-500/5';
    return 'border-gray-500/20 bg-gray-500/5';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-purple-500/20" data-testid="stat-card-tvl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
            <Lock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.total_value_locked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20" data-testid="stat-card-predictions">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Predictions</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_predictions}</div>
            <p className="text-xs text-muted-foreground">Total: {stats?.total_predictions}</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20" data-testid="stat-card-accuracy">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.accuracy_rate}%</div>
            <p className="text-xs text-muted-foreground">Across all AI models</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20" data-testid="stat-card-users">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+2.1k this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card data-testid="chart-predictions">
          <CardHeader>
            <CardTitle>Prediction Activity</CardTitle>
            <CardDescription>Daily predictions over the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="predictions" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card data-testid="chart-categories">
          <CardHeader>
            <CardTitle>Market Categories</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap */}
      <Card data-testid="roadmap-section">
        <CardHeader>
          <CardTitle>Development Roadmap</CardTitle>
          <CardDescription>Project milestones and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roadmapData.map((phase, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getStatusColor(phase.status)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(phase.status)}
                    <h3 className="font-semibold text-lg">{phase.phase}</h3>
                  </div>
                  <Badge variant={phase.status === 'completed' ? 'default' : phase.status === 'in-progress' ? 'secondary' : 'outline'}>
                    {phase.progress}%
                  </Badge>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      phase.status === 'completed' ? 'bg-green-500' : 
                      phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${phase.progress}%` }}
                  ></div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {phase.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      {item.done ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={item.done ? 'text-muted-foreground line-through' : ''}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card data-testid="recent-predictions">
          <CardHeader>
            <CardTitle>Recent Predictions</CardTitle>
            <CardDescription>Latest active predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((pred) => (
                <div key={pred.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{pred.title}</p>
                    <p className="text-xs text-muted-foreground">{pred.ai_model_name}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {pred.category}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pred.confidence_score * 100}% confidence
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="top-ai-models">
          <CardHeader>
            <CardTitle>Top AI Models</CardTitle>
            <CardDescription>Highest reputation scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiModels.map((model, index) => (
                <div key={model.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.model_type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-600">{model.reputation_score}</p>
                    <p className="text-xs text-muted-foreground">{model.accuracy_rate}% accuracy</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;