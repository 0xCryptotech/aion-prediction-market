import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar, TrendingUp, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Marketplace = () => {
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ['all', 'Finance', 'Esports', 'Climate', 'Politics', 'Technology'];

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    filterPredictions();
  }, [activeTab, selectedCategory, predictions]);

  const fetchPredictions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/predictions`);
      setPredictions(response.data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPredictions = () => {
    let filtered = predictions;

    if (activeTab !== 'all') {
      filtered = filtered.filter(p => p.status === activeTab);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredPredictions(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'disputed':
        return <AlertCircle className="h-4 w-4" />;
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

  const getCategoryColor = (category) => {
    const colors = {
      Finance: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      Esports: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      Climate: 'bg-green-500/10 text-green-600 border-green-500/20',
      Politics: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      Technology: 'bg-red-500/10 text-red-600 border-red-500/20'
    };
    return colors[category] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="marketplace-page">
      <div>
        <h1 className="text-3xl font-bold mb-2">Prediction Marketplace</h1>
        <p className="text-muted-foreground">Explore AI-powered predictions across various categories</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            data-testid={`category-filter-${category}`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active">Active</TabsTrigger>
          <TabsTrigger value="resolved" data-testid="tab-resolved">Resolved</TabsTrigger>
          <TabsTrigger value="disputed" data-testid="tab-disputed">Disputed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPredictions.map((prediction) => (
              <Card
                key={prediction.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/prediction/${prediction.id}`)}
                data-testid={`prediction-card-${prediction.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getCategoryColor(prediction.category)}>
                      {prediction.category}
                    </Badge>
                    <Badge className={getStatusColor(prediction.status)}>
                      {getStatusIcon(prediction.status)}
                      <span className="ml-1">{prediction.status}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{prediction.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{prediction.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">AI Model</span>
                    <span className="font-medium">{prediction.ai_model_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Prediction</span>
                    <span className="font-medium text-purple-600">{prediction.prediction_value}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{(prediction.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Stake</span>
                    <span className="font-bold text-green-600">${prediction.total_stake.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Event Date
                    </span>
                    <span className="font-medium">{formatDate(prediction.event_date)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" data-testid="view-details-btn">
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredPredictions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No predictions found for the selected filters.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;