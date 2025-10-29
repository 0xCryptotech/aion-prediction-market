import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Governance = () => {
  const { account, isConnected } = useWallet();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState({});

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/dao-proposals`);
      setProposals(response.data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId, vote) => {
    if (!isConnected) {
      alert('Please connect your wallet to vote');
      return;
    }

    setVoting({ ...voting, [proposalId]: true });
    try {
      await axios.post(`${BACKEND_URL}/api/dao-proposals/${proposalId}/vote`, null, {
        params: {
          wallet_address: account,
          vote: vote
        }
      });
      alert('Vote recorded successfully!');
      fetchProposals();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Voting failed. Please try again.');
    } finally {
      setVoting({ ...voting, [proposalId]: false });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'passed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'passed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return ((votes / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="governance-page">
      <div>
        <h1 className="text-3xl font-bold mb-2">DAO Governance</h1>
        <p className="text-muted-foreground">Participate in community-driven decision making</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {proposals.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {proposals.filter(p => p.status === 'passed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals */}
      <div className="space-y-4">
        {proposals.map((proposal) => {
          const forPercentage = calculatePercentage(proposal.votes_for, proposal.total_votes);
          const againstPercentage = calculatePercentage(proposal.votes_against, proposal.total_votes);

          return (
            <Card key={proposal.id} data-testid={`proposal-${proposal.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getStatusColor(proposal.status)}>
                    {getStatusIcon(proposal.status)}
                    <span className="ml-1 capitalize">{proposal.status}</span>
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Ends</p>
                    <p className="text-sm font-medium">{formatDate(proposal.end_date)}</p>
                  </div>
                </div>
                <CardTitle>{proposal.title}</CardTitle>
                <CardDescription>{proposal.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  <span>Proposed by {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</span>
                </div>

                {/* Voting Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Total Votes: {proposal.total_votes.toLocaleString()}</span>
                  </div>

                  {/* For Votes */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-green-600 font-medium flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        For
                      </span>
                      <span className="font-bold text-green-600">
                        {proposal.votes_for.toLocaleString()} ({forPercentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${forPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Against Votes */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-red-600 font-medium flex items-center">
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Against
                      </span>
                      <span className="font-bold text-red-600">
                        {proposal.votes_against.toLocaleString()} ({againstPercentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all duration-300"
                        style={{ width: `${againstPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              {proposal.status === 'active' && (
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-green-500/50 hover:bg-green-500/10 text-green-600"
                    onClick={() => handleVote(proposal.id, 'for')}
                    disabled={!isConnected || voting[proposal.id]}
                    data-testid="vote-for-btn"
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Vote For
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500/50 hover:bg-red-500/10 text-red-600"
                    onClick={() => handleVote(proposal.id, 'against')}
                    disabled={!isConnected || voting[proposal.id]}
                    data-testid="vote-against-btn"
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Vote Against
                  </Button>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>

      {proposals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No proposals available.</p>
        </div>
      )}
    </div>
  );
};

export default Governance;