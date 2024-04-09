import React, { useState, useEffect } from 'react';
import ModernMaestroApi from '../api/api';

function UserInteractionsList({ targetId }) {
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    async function fetchInteractions() {
      const allInteractions = await ModernMaestroApi.getUserInteractions();
      // Filter interactions for the specific composition
      const filteredInteractions = allInteractions.filter(interaction => interaction.target_id === targetId && interaction.target_type === 'composition');
      setInteractions(filteredInteractions);
    }
    fetchInteractions();
  }, [targetId]);

  return (
    <div>
      <h2>User Interactions</h2>
      {interactions.length > 0 ? (
        <ul>
          {interactions.map((interaction) => (
            <li key={interaction.interaction_id}>
              {interaction.interaction_type === 'comment' ? `Comment: ${interaction.content}` : `Rating: ${interaction.rating}`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No interactions to display.</p>
      )}
    </div>
  );
}

export default UserInteractionsList;
