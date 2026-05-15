import React, { useState, useEffect } from 'react';
import './DiscordTracker.css';

const DiscordTracker = ({ guildId, botToken }) => {
  const [discordData, setDiscordData] = useState({
    members: 0,
    online: 0,
    idle: 0,
    dnd: 0,
    offline: 0,
    serverName: 'Loading...',
    icon: null,
    loading: true,
    error: null,
  });

  const [serverHealth, setServerHealth] = useState({
    uptime: '100%',
    latency: '0ms',
    memory: '0MB',
    cpu: '0%',
    lastChecked: new Date(),
    status: 'Healthy',
  });

  useEffect(() => {
    const fetchDiscordData = async () => {
      try {
        // Fetch Discord guild info
        const guildResponse = await fetch(
          `https://discord.com/api/v10/guilds/${guildId}`,
          {
            headers: { Authorization: `Bot ${botToken}` },
          }
        );

        if (!guildResponse.ok) {
          throw new Error('Failed to fetch guild data');
        }

        const guildData = await guildResponse.json();

        // Fetch guild members count
        const membersResponse = await fetch(
          `https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`,
          {
            headers: { Authorization: `Bot ${botToken}` },
          }
        );

        const membersData = await membersResponse.json();
        const membersList = Array.isArray(membersData) ? membersData : [];

        // Calculate member statuses
        let online = 0,
          idle = 0,
          dnd = 0,
          offline = 0;

        membersList.forEach((member) => {
          const status = member.user?.status || 'offline';
          if (status === 'online') online++;
          else if (status === 'idle') idle++;
          else if (status === 'dnd') dnd++;
          else offline++;
        });

        setDiscordData({
          members: guildData.member_count || 0,
          online,
          idle,
          dnd,
          offline,
          serverName: guildData.name,
          icon: guildData.icon
            ? `https://cdn.discordapp.com/icons/${guildId}/${guildData.icon}.png`
            : null,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Discord fetch error:', err);
        setDiscordData((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      }
    };

    const fetchServerHealth = async () => {
      try {
        const startTime = performance.now();
        const healthResponse = await fetch('/api/health');
        const latency = Math.round(performance.now() - startTime);

        if (healthResponse.ok) {
          const health = await healthResponse.json();
          setServerHealth({
            uptime: health.uptime || '100%',
            latency: `${latency}ms`,
            memory: health.memory || '0MB',
            cpu: health.cpu || '0%',
            lastChecked: new Date(),
            status: latency < 100 ? 'Healthy' : latency < 300 ? 'Warning' : 'Critical',
          });
        }
      } catch (err) {
        console.error('Server health fetch error:', err);
        setServerHealth((prev) => ({
          ...prev,
          status: 'Error',
        }));
      }
    };

    if (guildId && botToken) {
      fetchDiscordData();
      fetchServerHealth();

      // Refresh every 30 seconds
      const interval = setInterval(() => {
        fetchDiscordData();
        fetchServerHealth();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [guildId, botToken]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return '#43b581';
      case 'idle':
        return '#faa61a';
      case 'dnd':
        return '#f04747';
      default:
        return '#747f8d';
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'Healthy':
        return '#43b581';
      case 'Warning':
        return '#faa61a';
      case 'Critical':
        return '#f04747';
      default:
        return '#747f8d';
    }
  };

  return (
    <div className="tracker-container">
      {/* Discord Status Tracker */}
      <div className="tracker-card discord-tracker">
        <div className="tracker-header">
          <h2 className="tracker-title">
            {discordData.icon && (
              <img src={discordData.icon} alt="Server Icon" className="server-icon" />
            )}
            Discord Status
          </h2>
          <span className={`status-badge ${discordData.error ? 'error' : 'active'}`}>
            {discordData.error ? '⚠️ Error' : '🟢 Online'}
          </span>
        </div>

        {discordData.loading ? (
          <div className="loading">Loading Discord data...</div>
        ) : discordData.error ? (
          <div className="error">Error: {discordData.error}</div>
        ) : (
          <>
            <div className="server-info">
              <h3>{discordData.serverName}</h3>
              <p className="member-count">Total Members: <strong>{discordData.members}</strong></p>
            </div>

            <div className="status-grid">
              <div className="status-item">
                <div
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor('online') }}
                ></div>
                <div className="status-info">
                  <span className="status-label">Online</span>
                  <span className="status-count">{discordData.online}</span>
                </div>
              </div>

              <div className="status-item">
                <div
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor('idle') }}
                ></div>
                <div className="status-info">
                  <span className="status-label">Idle</span>
                  <span className="status-count">{discordData.idle}</span>
                </div>
              </div>

              <div className="status-item">
                <div
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor('dnd') }}
                ></div>
                <div className="status-info">
                  <span className="status-label">Do Not Disturb</span>
                  <span className="status-count">{discordData.dnd}</span>
                </div>
              </div>

              <div className="status-item">
                <div
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor('offline') }}
                ></div>
                <div className="status-info">
                  <span className="status-label">Offline</span>
                  <span className="status-count">{discordData.offline}</span>
                </div>
              </div>
            </div>

            <div className="tracker-footer">
              <small>Last updated: {discordData.lastUpdated || 'Just now'}</small>
            </div>
          </>
        )}
      </div>

      {/* Server Health Tracker */}
      <div className="tracker-card server-tracker">
        <div className="tracker-header">
          <h2 className="tracker-title">Server Health</h2>
          <span
            className="status-badge"
            style={{
              backgroundColor: getHealthColor(serverHealth.status),
            }}
          >
            {serverHealth.status}
          </span>
        </div>

        <div className="health-metrics">
          <div className="metric">
            <span className="metric-label">Uptime</span>
            <span className="metric-value">{serverHealth.uptime}</span>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${parseInt(serverHealth.uptime)}%`,
                  backgroundColor: getHealthColor('Healthy'),
                }}
              ></div>
            </div>
          </div>

          <div className="metric">
            <span className="metric-label">Response Time</span>
            <span className="metric-value">{serverHealth.latency}</span>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${Math.min(100, (parseInt(serverHealth.latency) / 300) * 100)}%`,
                  backgroundColor: parseInt(serverHealth.latency) < 100 ? '#43b581' : '#faa61a',
                }}
              ></div>
            </div>
          </div>

          <div className="metric">
            <span className="metric-label">Memory Usage</span>
            <span className="metric-value">{serverHealth.memory}</span>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${Math.min(100, parseInt(serverHealth.memory))}%`,
                  backgroundColor:
                    parseInt(serverHealth.memory) < 70
                      ? '#43b581'
                      : parseInt(serverHealth.memory) < 90
                        ? '#faa61a'
                        : '#f04747',
                }}
              ></div>
            </div>
          </div>

          <div className="metric">
            <span className="metric-label">CPU Usage</span>
            <span className="metric-value">{serverHealth.cpu}</span>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${Math.min(100, parseInt(serverHealth.cpu))}%`,
                  backgroundColor:
                    parseInt(serverHealth.cpu) < 70
                      ? '#43b581'
                      : parseInt(serverHealth.cpu) < 90
                        ? '#faa61a'
                        : '#f04747',
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="tracker-footer">
          <small>Last checked: {serverHealth.lastChecked.toLocaleTimeString()}</small>
        </div>
      </div>
    </div>
  );
};

export default DiscordTracker;
