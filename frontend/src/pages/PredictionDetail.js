import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar, TrendingUp, Target, CheckCircle, Clock, AlertCircle, ArrowLeft, Coins } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PredictionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account, isConnected } = useWallet();
  const [prediction, setPrediction] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [staking, setStaking] = useState(false);

  useEffect(() => {
    fetchPrediction();
  }, [id]);

  const fetchPrediction = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/predictions/${id}`);
      setPrediction(response.data);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert('Please enter a valid stake amount');
      return;
    }

    setStaking(true);
    try {
      await axios.post(`${BACKEND_URL}/api/predictions/${id}/stake`, null, {
        params: {
          wallet_address: account,
          amount: parseFloat(stakeAmount)
        }
      });
      alert('Stake successful!');
      fetchPrediction();
      setStakeAmount('');
    } catch (error) {
      console.error('Error staking:', error);
      alert('Staking failed. Please try again.');
    } finally {
      setStaking(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5" />;
      case 'disputed':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'resolved':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'disputed':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl mb-4">Prediction not found</p>
        <Button onClick={() => navigate('/marketplace')}>Back to Marketplace</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="prediction-detail-page">
      <Button variant="ghost" onClick={() => navigate('/marketplace')} data-testid="back-btn">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Marketplace
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                      {prediction.category}
                    </Badge>
                    <Badge className={getStatusColor(prediction.status)}>
                      {getStatusIcon(prediction.status)}
                      <span className="ml-1">{prediction.status}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{prediction.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-base">{prediction.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <p className="text-sm text-muted-foreground mb-1">AI Model</p>
                  <p className="font-semibold">{prediction.ai_model_name}</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Prediction</p>
                  <p className="font-semibold text-blue-600">{prediction.prediction_value}</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Confidence Score</p>
                  <p className="font-semibold text-green-600">{(prediction.confidence_score * 100).toFixed(0)}%</p>
                </div>
                <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                  <p className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Event Date
                  </p>
                  <p className="font-semibold">{formatDate(prediction.event_date)}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Verification Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className="capitalize">{prediction.verification_status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Oracle Nodes</span>
                    <span className="font-medium">{prediction.oracle_nodes}/3 Verified</span>
                  </div>
                  {prediction.outcome && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Outcome</span>
                      <Badge className="bg-green-500/10 text-green-600">{prediction.outcome}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card data-testid="stake-card">
            <CardHeader>
              <CardTitle>Stake on Prediction</CardTitle>
              <CardDescription>Support this prediction with AION tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                <p className="text-sm text-muted-foreground mb-1">Total Staked</p>
                <p className="text-2xl font-bold text-purple-600">${prediction.total_stake.toLocaleString()}</p>
              </div>

              {prediction.status === 'active' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Stake Amount (AION)</label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                      data-testid="stake-input"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleStake}
                    disabled={!isConnected || staking}
                    data-testid="stake-btn"
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    {staking ? 'Staking...' : isConnected ? 'Stake Now' : 'Connect Wallet to Stake'}
                  </Button>
                </div>
              )}

              {prediction.status !== 'active' && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  This prediction is no longer active for staking
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatDate(prediction.created_at)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline">{prediction.category}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className={getStatusColor(prediction.status)}>{prediction.status}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetail;