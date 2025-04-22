import React, { useState, useEffect } from 'react';
import { List, Button, message, Card, Skeleton } from 'antd';
import { nodeAxios } from '../../../axios'; // Import spécifique de nodeAxios

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const response = await nodeAxios.get('/users/invitations');
      setInvitations(response.data.invitations || []);
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error.message);
      message.error(error.response?.data?.error || 'Erreur lors du chargement des invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (groupId, accept) => {
    setProcessing(groupId);
    try {
      const endpoint = accept ? 'accept' : 'decline';
      await nodeAxios.post(`/groups/${groupId}/${endpoint}`);
      
      setInvitations(prev => prev.filter(inv => inv.group_id !== groupId));
      message.success(accept ? 
        'Vous avez rejoint le groupe avec succès' : 
        'Invitation refusée'
      );
      
      // Rafraîchir les données si nécessaire
      if (accept) {
        // Vous pourriez vouloir rafraîchir la liste des groupes ici
      }
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error.message);
      message.error(error.response?.data?.error || 
        `Erreur lors de ${accept ? "l'acceptation" : "le refus"} de l'invitation`
      );
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Mes Invitations</h2>
      
      {loading ? (
        <Card>
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      ) : invitations.length === 0 ? (
        <Card>
          <p className="text-gray-500">Aucune invitation en attente</p>
        </Card>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={invitations}
          renderItem={(invite) => (
            <List.Item
              actions={[
                <Button 
                  type="primary" 
                  onClick={() => handleResponse(invite.group_id, true)}
                  className="bg-green-500"
                  loading={processing === invite.group_id}
                  disabled={!!processing}
                >
                  Accepter
                </Button>,
                <Button 
                  danger 
                  onClick={() => handleResponse(invite.group_id, false)}
                  loading={processing === invite.group_id}
                  disabled={!!processing}
                >
                  Refuser
                </Button>
              ]}
            >
              <List.Item.Meta
                title={<span className="font-medium">{invite.group_name}</span>}
                description={
                  <div className="space-y-1">
                    <p>Invitation de: {invite.chef_name}</p>
                    <p className="text-sm text-gray-500">
                      Reçue le: {new Date(invite.created_at).toLocaleDateString()}
                    </p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Invitations;