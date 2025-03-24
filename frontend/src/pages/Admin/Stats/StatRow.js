import React from 'react';
import StatCard from './StatCard';
import './Stats.css'

function StatRow ({totalRequests, pendingRequests, userCanceledCount, adminCanceledCount, activeVehicles}) {
  const statNames = [
    { title: 'Total # of requests', value: totalRequests },
    { title: 'Pending rides', value: pendingRequests },
    { title: 'User cancelled rides', value: userCanceledCount },
    { title: 'Admin cancelled rides', value: adminCanceledCount },
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