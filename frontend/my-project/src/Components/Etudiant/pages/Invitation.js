// 
import React, { useState, useEffect } from 'react';
import { List, Button, message, Card, Skeleton, Tag } from 'antd';
import { nodeAxios } from '../../../axios';

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
    <div className="p-6  min-h-screen">
      <div className="max-w-4xl mx-auto   ">
        <div className="flex items-center mb-8 ">
          <h2 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
            Mes Invitations
          </h2>
          <Tag color="purple"  className="ml-4 text-sm font-medium rounded-full px-3 py-1 shadow-sm bg-white text-purple-700 border border-purple-200"
          >
            {invitations.length} en attente
          </Tag>
        </div>
        
        {loading ? (
          <Card 
            className="bg-white rounded-2xl shadow-md border border-gray-100 transition-all duration-300"
            bodyStyle={{ padding: '24px' }}
          >
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        ) : invitations.length === 0 ? (
          <Card 
            className="rounded-xl shadow-md border-0 bg-white text-center py-12"
            bodyStyle={{ padding: '40px' }}
          >
            <div className="text-purple-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Aucune invitation en attente</h3>
            <p className="text-gray-500">Vous n'avez pas de nouvelles invitations pour le moment</p>
          </Card>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={invitations}
            renderItem={(invite) => (
              <div className="mb-6">
                <Card
                  className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white"
                  bodyStyle={{ padding: '20px' }}
                >
                  {/* <List.Item 
                    actions={[
                      <Button 
                        type="primary" 
                        onClick={() => handleResponse(invite.group_id, true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 font-medium rounded-lg h-10 px-6 shadow-md hover:shadow-lg transition-all duration-300"
                        loading={processing === invite.group_id}
                        disabled={!!processing}
                      >
                        Accepter
                      </Button>,
                      <Button 
                        onClick={() => handleResponse(invite.group_id, false)}
                        className="border border-gray-300 font-medium rounded-lg h-10 px-6 shadow-sm hover:shadow-md transition-all duration-300 ml-2"
                        loading={processing === invite.group_id}
                        disabled={!!processing}
                      >
                        Refuser
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      }
                      title={<span className="text-lg font-semibold text-gray-800">{invite.group_name}</span>}
                      description={
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-gray-600">Invité par: <span className="font-medium text-gray-700">{invite.chef_name}</span></span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-500">
                              Reçue le: {new Date(invite.created_at).toLocaleDateString('fr-FR', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      }
                    />
                  </List.Item> */}
                  <List.Item>
  <div className="flex items-center justify-between flex-row-reverse">
    {/* Actions (Accepter / Refuser) */}
    <div className="flex space-x-2 space-x-reverse">
      <Button 
        type="primary" 
        onClick={() => handleResponse(invite.group_id, true)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 font-medium rounded-full h-10 px-6 shadow hover:shadow-lg transition"
        loading={processing === invite.group_id}
        disabled={!!processing}
      >
        Accepter
      </Button>
      <Button 
        onClick={() => handleResponse(invite.group_id, false)}
        className="border border-gray-300 font-medium rounded-full h-10 px-6 shadow-sm hover:shadow-md transition"
        loading={processing === invite.group_id}
        disabled={!!processing}
      >
        Refuser
      </Button>
    </div>

    {/* Meta infos (titre, description) */}
    <List.Item.Meta
      avatar={
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      }
      title={<span className="text-lg font-semibold text-gray-800">{invite.group_name}</span>}

      description={
        <div className="space-y-2 mt-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-gray-600">Invité par: <span className="font-medium text-gray-700">{invite.chef_name}</span></span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-500">
              Reçue le: {new Date(invite.created_at).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      }
     
    />
  </div>
</List.Item>

                </Card>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Invitations;