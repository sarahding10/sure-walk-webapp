import React from 'react';
import StatCard from './StatCard';
import './Stats.css'

function StatRow ({totalRequests, pendingRequests, activeVehicles}) {
  const statNames = [
    { title: 'Total # of requests', value: totalRequests },
    { title: 'Pending rides', value: pendingRequests },
    { title: 'User cancelled rides', value: '5' },
    { title: 'Admin cancelled rides', value: '0' },
    { title: 'Total # of vehicles out', value: activeVehicles }
  ];

  return (
    <div className="statistics-row">
      {statNames.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
        />
      ))}
    </div>
  );
};

export default StatRow;