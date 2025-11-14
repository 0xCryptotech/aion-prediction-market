import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Trophy, Medal, Award, TrendingUp, Target, Zap } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Leaderboard = () => {
  const [aiModels, setAiModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAiModels();
  }, []);

  const fetchAiModels = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/ai-models`);
      setAiModels(response.data);
    } catch (error) {
      console.error('Error fetching AI models:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getReputationBadge = (score) => {
    if (score >= 95) return { label: 'Elite', color: 'bg-purple-500' };
    if (score >= 90) return { label: 'Master', color: 'bg-blue-500' };
    if (score >= 85) return { label: 'Expert', color: 'bg-green-500' };
    if (score >= 80) return { label: 'Advanced', color: 'bg-orange-500' };
    return { label: 'Intermediate', color: 'bg-gray-500' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="leaderboard-page">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Models Leaderboard</h1>
        <p className="text-muted-foreground">Top performing AI forecasters ranked by reputation score</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {aiModels.slice(0, 3).map((model, index) => {
          const badge = getReputationBadge(model.reputation_score);
          return (
            <Card
              key={model.id}
              className={`relative overflow-hidden ${
                index === 0 ? 'md:col-start-2 md:row-start-1 border-yellow-500/50' : ''
              }`}
              data-testid={`podium-${index + 1}`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full ${
                index === 0 ? 'bg-yellow-500/10' : index === 1 ? 'bg-gray-400/10' : 'bg-orange-600/10'
              }`}></div>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {getRankIcon(model.rank)}
                </div>
                <img
                  src={model.avatar_url}
                  alt={model.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-purple-500/20"
                />
                <CardTitle className="text-xl">{model.name}</CardTitle>
                <CardDescription>{model.model_type}</CardDescription>
                <Badge className={`${badge.color} text-white mt-2`}>{badge.label}</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-center">
                <div>
                  <p className="text-3xl font-bold text-purple-600">{model.reputation_score}</p>
                  <p className="text-xs text-muted-foreground">Reputation Score</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t">
                  <div>
                    <p className="text-sm font-bold">{model.accuracy_rate}%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{model.total_predictions}</p>
                    <p className="text-xs text-muted-foreground">Predictions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <Card data-testid="leaderboard-table">
        <CardHeader>
          <CardTitle>Complete Rankings</CardTitle>
          <CardDescription>All AI models performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiModels.map((model) => {
              const badge = getReputationBadge(model.reputation_score);
              return (
                <div
                  key={model.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  data-testid={`leaderboard-row-${model.id}`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(model.rank)}
                    </div>
                    <img
                      src={model.avatar_url}
                      alt={model.name}
                      className="w-12 h-12 rounded-full border-2 border-purple-500/20"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold">{model.name}</p>
                        <Badge className={`${badge.color} text-white text-xs`}>{badge.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{model.model_type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-8 text-center">
                    <div>
                      <p className="text-lg font-bold text-purple-600">{model.reputation_score}</p>
                      <p className="text-xs text-muted-foreground">Reputation</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{model.accuracy_rate}%</p>
                      <p className="text-xs text-muted-foreground flex items-center justify-center">
                        <Target className="h-3 w-3 mr-1" />
                        Accuracy
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{model.total_predictions}</p>
                      <p className="text-xs text-muted-foreground flex items-center justify-center">
                        <Zap className="h-3 w-3 mr-1" />
                        Total
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">${(model.total_staked / 1000).toFixed(1)}k</p>
                      <p className="text-xs text-muted-foreground flex items-center justify-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Staked
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">${(model.total_earned / 1000).toFixed(1)}k</p>
                      <p className="text-xs text-muted-foreground">Earned</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;