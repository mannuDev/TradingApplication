import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getAdminDashboard,
  getAllUsers,
  getPendingKYC,
  getAllTransactions,
  approveKYC,
  rejectKYC,
  toggleUserStatus
} from '../../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingKYC, setPendingKYC] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingUserId, setRejectingUserId] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/products');
      return;
    }
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const loadDashboard = async () => {
    try {
      const [statsRes, kycRes, usersRes, txRes] = await Promise.all([
        getAdminDashboard(),
        getPendingKYC(),
        getAllUsers(),
        getAllTransactions()
      ]);
      setStats(statsRes.data);
      setPendingKYC(kycRes.data);
      setUsers(usersRes.data);
      setTransactions(txRes.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveKYC = async (userId) => {
    try {
      await approveKYC(userId);
      alert('KYC approved successfully');
      loadDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve KYC');
    }
  };

  const handleRejectKYC = async (userId) => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      await rejectKYC(userId, rejectReason);
      alert('KYC rejected');
      setRejectReason('');
      setRejectingUserId(null);
      loadDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject KYC');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await toggleUserStatus(userId);
      loadDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="neon-spinner"></div>
        <p className="loading-text">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 className="admin-title gradient-text">Admin Dashboard</h1>
        <p className="admin-subtitle">Manage users, KYC, and transactions</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`admin-tab ${activeTab === 'kyc' ? 'active' : ''}`}
          onClick={() => setActiveTab('kyc')}
        >
          KYC Review ({pendingKYC.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
      </div>

      {activeTab === 'dashboard' && stats && (
        <div className="admin-stats-grid">
          <div className="stat-card glass-card">
            <h3>Total Users</h3>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card glass-card">
            <h3>Verified Users</h3>
            <div className="stat-value positive">{stats.verifiedUsers}</div>
          </div>
          <div className="stat-card glass-card">
            <h3>Pending KYC</h3>
            <div className="stat-value warning">{stats.pendingKYC}</div>
          </div>
          <div className="stat-card glass-card">
            <h3>Total Transactions</h3>
            <div className="stat-value">{stats.totalTransactions}</div>
          </div>
          <div className="stat-card glass-card">
            <h3>Total Volume</h3>
            <div className="stat-value">₹{stats.totalVolume.toFixed(2)}</div>
          </div>
          <div className="stat-card glass-card">
            <h3>Active Users</h3>
            <div className="stat-value positive">{stats.activeUsers}</div>
          </div>
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="admin-content">
          <h2 className="section-title">Pending KYC Requests</h2>
          {pendingKYC.length === 0 ? (
            <div className="glass-card empty-state">
              <p>No pending KYC requests</p>
            </div>
          ) : (
            <div className="kyc-list">
              {pendingKYC.map((user) => (
                <div key={user._id} className="kyc-item glass-card">
                  <div className="kyc-user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <div className="kyc-details">
                      <p><strong>PAN:</strong> {user.pan}</p>
                      <p><strong>Aadhaar:</strong> {user.aadhaar}</p>
                      <p><strong>DOB:</strong> {new Date(user.dob).toLocaleDateString()}</p>
                      {user.address && (
                        <p><strong>Address:</strong> {user.address.city}, {user.address.state} - {user.address.pincode}</p>
                      )}
                    </div>
                    {user.kycImage && (
                      <div className="kyc-image-preview">
                        <img src={`http://localhost:5000${user.kycImage}`} alt="KYC Document" />
                      </div>
                    )}
                  </div>
                  <div className="kyc-actions">
                    <button
                      className="neon-button approve-btn"
                      onClick={() => handleApproveKYC(user._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="neon-button reject-btn"
                      onClick={() => setRejectingUserId(user._id)}
                    >
                      Reject
                    </button>
                  </div>
                  {rejectingUserId === user._id && (
                    <div className="reject-form">
                      <textarea
                        className="neon-input"
                        placeholder="Enter rejection reason..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows="3"
                      />
                      <div className="reject-actions">
                        <button
                          className="neon-button"
                          onClick={() => handleRejectKYC(user._id)}
                        >
                          Submit Rejection
                        </button>
                        <button
                          className="neon-button secondary-button"
                          onClick={() => {
                            setRejectingUserId(null);
                            setRejectReason('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-content">
          <h2 className="section-title">All Users</h2>
          <div className="users-table glass-card">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>KYC Status</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`kyc-badge ${u.kycStatus || 'pending'}`}>
                        {u.kycStatus || 'pending'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.isActive ? 'active' : 'banned'}`}>
                        {u.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => handleToggleUserStatus(u._id)}
                        disabled={u.role === 'admin'}
                      >
                        {u.isActive ? 'Ban' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="admin-content">
          <h2 className="section-title">All Transactions</h2>
          <div className="transactions-list">
            {transactions.map((tx) => (
              <div key={tx._id} className="transaction-item glass-card">
                <div className="tx-info">
                  <p><strong>User:</strong> {tx.user?.name} ({tx.user?.email})</p>
                  <p><strong>Product:</strong> {tx.product?.name}</p>
                  <p><strong>Units:</strong> {tx.units}</p>
                  <p><strong>Price:</strong> ₹{tx.priceAtPurchase.toFixed(2)}</p>
                  <p><strong>Total:</strong> ₹{(tx.units * tx.priceAtPurchase).toFixed(2)}</p>
                  <p><strong>Date:</strong> {new Date(tx.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

