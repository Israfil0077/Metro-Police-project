// OfficerDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Dashboard.css';

export default function OfficerDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    pendingReports: 0,
    activeSOS: 0,
    pendingGD: 0,
    missingPersons: 0,
    assignedCases: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all counts in parallel
      const [reportsRes, sosRes, gdRes, missingRes] = await Promise.all([
        api.get('/crime-reports/all?status=pending'), // pending crime reports
        api.get('/sos/active'),                        // active SOS alerts
        api.get('/crime-reports/gd'),                  // pending GDs
        api.get('/missing-persons/all?status=missing') // missing persons
      ]);

      setStats({
        pendingReports: reportsRes.data.reports?.length || 0,
        activeSOS: sosRes.data.alerts?.length || 0,
        pendingGD: gdRes.data.gds?.length || 0,
        missingPersons: missingRes.data.reports?.length || 0,
        assignedCases: 0 // can be updated later if you implement assignment logic
      });
    } catch (error) {
      console.error('Error fetching officer stats:', error);
      // Set all stats to 0 if there's an error
      setStats({
        pendingReports: 0,
        activeSOS: 0,
        pendingGD: 0,
        missingPersons: 0,
        assignedCases: 0
      });
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Officer Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card warning">
          <h3>Pending Reports</h3>
          <p className="stat-number">{stats.pendingReports}</p>
          <Link to="/officer/reports">Review Reports</Link>
        </div>

        <div className="stat-card emergency">
          <h3>Active SOS Alerts</h3>
          <p className="stat-number">{stats.activeSOS}</p>
          <Link to="/officer/sos-monitoring">View Alerts</Link>
        </div>

        <div className="stat-card">
          <h3>Pending GD</h3>
          <p className="stat-number">{stats.pendingGD}</p>
          <Link to="/officer/gd">Review GD</Link>
        </div>

        <div className="stat-card">
          <h3>Missing Persons</h3>
          <p className="stat-number">{stats.missingPersons}</p>
          <Link to="/officer/missing-persons-management">View Cases</Link>
        </div>

        <div className="stat-card">
          <h3>Assigned Cases</h3>
          <p className="stat-number">{stats.assignedCases}</p>
          <Link to="/officer/cases">View Cases</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/officer/reports" className="action-card">
            <h3>Review Reports</h3>
            <p>Review and update crime reports</p>
          </Link>
          <Link to="/officer/gd" className="action-card">
            <h3>GD Management</h3>
            <p>Manage General Diary reports</p>
          </Link>
          <Link to="/officer/sos-monitoring" className="action-card emergency">
            <h3>SOS Monitoring</h3>
            <p>Real-time emergency alert monitoring</p>
          </Link>
          <Link to="/officer/missing-persons-management" className="action-card">
            <h3>Missing Persons</h3>
            <p>Manage missing person cases</p>
          </Link>
          <Link to="/officer/pcc-approval" className="action-card">
            <h3>PCC Approval</h3>
            <p>Approve/reject PCC applications</p>
          </Link>
          <Link to="/officer/crime-prediction-analytics" className="action-card">
            <h3>Crime Analytics</h3>
            <p>View crime pattern analytics</p>
          </Link>
          <Link to="/officer/patrolling-heatmap" className="action-card">
            <h3>Patrolling Heatmap</h3>
            <p>Smart patrolling visualization</p>
          </Link>
          <Link to="/officer/criminal-search" className="action-card">
            <h3>Criminal Database</h3>
            <p>Search criminal records</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
