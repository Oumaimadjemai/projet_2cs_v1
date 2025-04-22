// import React, { useState, useEffect } from 'react';
// import { Button, Input, List, Card, Modal, message } from 'antd';
// import axiosInstance from '../../../axios';
// import { nodeAxios } from '../../../axios'; // Assurez-vous que le chemin est correct

// const Groupes = () => {
//   const [groups, setGroups] = useState([]);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [inviteEmail, setInviteEmail] = useState('');
//   const [currentGroup, setCurrentGroup] = useState(null);

//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const fetchGroups = async () => {
//     try {
//       const response = await axiosInstance.get('/groups');
//       setGroups(response.data);
//     } catch (error) {
//       message.error('Erreur lors du chargement des groupes');
//     }
//   };

//   const createGroup = async () => {
//     try {
//       const response = await axiosInstance.post('/create-group', {
//         name: newGroupName
//       });
//       setGroups([...groups, response.data.group]);
//       setNewGroupName('');
//       message.success('Groupe créé avec succès');
//     } catch (error) {
//       message.error('Erreur lors de la création du groupe');
//     }
//   };

//   const showInviteModal = (group) => {
//     setCurrentGroup(group);
//     setIsModalVisible(true);
//   };

//   const handleInvite = async () => {
//     try {
//       await axiosInstance.post(`/groups/${currentGroup._id}/invite`, {
//         email: inviteEmail
//       });
//       message.success('Invitation envoyée');
//       setIsModalVisible(false);
//       setInviteEmail('');
//     } catch (error) {
//       message.error("Erreur lors de l'envoi de l'invitation");
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Mes Groupes</h2>
//         <div className="flex space-x-2">
//           <Input
//             placeholder="Nom du nouveau groupe"
//             value={newGroupName}
//             onChange={(e) => setNewGroupName(e.target.value)}
//             className="w-64"
//           />
//           <Button 
//             type="primary" 
//             onClick={createGroup}
//             className="bg-mypurple"
//           >
//             Créer un groupe
//           </Button>
//         </div>
//       </div>

//       <List
//         grid={{ gutter: 16, column: 3 }}
//         dataSource={groups}
//         renderItem={(group) => (
//           <List.Item>
//             <Card 
//               title={group.name}
//               actions={[
//                 <Button 
//                   type="link" 
//                   onClick={() => showInviteModal(group)}
//                 >
//                   Inviter
//                 </Button>
//               ]}
//             >
//               <p>Chef: {group.chef_id}</p>
//               <p>Membres: {group.members.length}</p>
//             </Card>
//           </List.Item>
//         )}
//       />

//       <Modal
//         title={`Inviter à ${currentGroup?.name}`}
//         visible={isModalVisible}
//         onOk={handleInvite}
//         onCancel={() => setIsModalVisible(false)}
//       >
//         <Input
//           placeholder="Email de l'étudiant"
//           value={inviteEmail}
//           onChange={(e) => setInviteEmail(e.target.value)}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default Groupes;
// import React, { useState, useEffect } from 'react';
// import { Button, Input, List, Card, Modal, message } from 'antd';
// import { nodeAxios } from '../../../axios'; // Import de nodeAxios seulement

// const Groupes = () => {
//   const [groups, setGroups] = useState([]);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [inviteEmail, setInviteEmail] = useState('');
//   const [currentGroup, setCurrentGroup] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const fetchGroups = async () => {
//     setLoading(true);
//     try {
//       const response = await nodeAxios.get('/groups');
//       setGroups(response.data);
//     } catch (error) {
//       message.error('Erreur lors du chargement des groupes');
//       console.error('Détails erreur:', error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createGroup = async () => {
//     if (!newGroupName.trim()) {
//       message.warning('Veuillez entrer un nom de groupe');
//       return;
//     }

//     try {
//       const response = await nodeAxios.post('/create-group', {
//         name: newGroupName
//       });
//       setGroups([response.data.group, ...groups]);
//       setNewGroupName('');
//       message.success('Groupe créé avec succès');
//     } catch (error) {
//       message.error(error.response?.data?.error || 'Erreur lors de la création du groupe');
//     }
//   };

//   const showInviteModal = (group) => {
//     setCurrentGroup(group);
//     setIsModalVisible(true);
//   };

//   const handleInvite = async () => {
//     if (!inviteEmail.trim()) {
//       message.warning('Veuillez entrer un email valide');
//       return;
//     }

//     try {
//       // Note: Vous devrez peut-être adapter selon votre API
//       await nodeAxios.post(`/groups/${currentGroup._id}/invite`, {
//         email: inviteEmail
//       });
//       message.success('Invitation envoyée avec succès');
//       setIsModalVisible(false);
//       setInviteEmail('');
//     } catch (error) {
//       message.error(error.response?.data?.error || "Erreur lors de l'envoi de l'invitation");
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Mes Groupes</h2>
//         <div className="flex gap-4">
//           <Input
//             placeholder="Nom du nouveau groupe"
//             value={newGroupName}
//             onChange={(e) => setNewGroupName(e.target.value)}
//             className="w-64"
//             onPressEnter={createGroup}
//           />
//           <Button 
//             type="primary" 
//             onClick={createGroup}
//             className="bg-mypurple"
//             loading={loading}
//           >
//             Créer un groupe
//           </Button>
//         </div>
//       </div>

//       {loading && groups.length === 0 ? (
//         <div className="text-center py-8">Chargement en cours...</div>
//       ) : (
//         <List
//           grid={{ gutter: 16, column: 3 }}
//           dataSource={groups}
//           renderItem={(group) => (
//             <List.Item>
//               <Card 
//                 title={group.name}
//                 actions={[
//                   <Button 
//                     type="link" 
//                     onClick={() => showInviteModal(group)}
//                     className="text-mypurple"
//                   >
//                     Inviter un membre
//                   </Button>
//                 ]}
//               >
//                 <p><strong>Chef:</strong> {group.chef_id}</p>
//                 <p><strong>Membres:</strong> {group.members.length}</p>
//                 <p><strong>Créé le:</strong> {new Date(group.created_at).toLocaleDateString()}</p>
//               </Card>
//             </List.Item>
//           )}
//         />
//       )}

//       <Modal
//         title={`Inviter un membre à ${currentGroup?.name}`}
//         visible={isModalVisible}
//         onOk={handleInvite}
//         onCancel={() => {
//           setIsModalVisible(false);
//           setInviteEmail('');
//         }}
//         okText="Envoyer l'invitation"
//         cancelText="Annuler"
//       >
//         <div className="space-y-4">
//           <Input
//             placeholder="Email de l'étudiant"
//             value={inviteEmail}
//             onChange={(e) => setInviteEmail(e.target.value)}
//             type="email"
//           />
//           {currentGroup && (
//             <p className="text-sm text-gray-500">
//               Un lien d'invitation sera envoyé à cet étudiant pour rejoindre le groupe "{currentGroup.name}"
//             </p>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Groupes;
// import React, { useState, useEffect } from 'react';
// import { Button, Input, List, Card, Modal, message, Table } from 'antd';
// import { nodeAxios } from '../../../axios';

// const Groupes = () => {
//   const [groups, setGroups] = useState([]);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [inviteUserId, setInviteUserId] = useState('');
//   const [currentGroup, setCurrentGroup] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [userInvitations, setUserInvitations] = useState([]);

//   // Fetch user's groups and invitations
//   useEffect(() => {
//     fetchUserGroups();
//     fetchUserInvitations();
//   }, []);

//   const fetchUserGroups = async () => {
//     setLoading(true);
//     try {
//       // This endpoint needs to be created in your Node backend
//       const response = await nodeAxios.get('/groups/user');
//       setGroups(response.data);
//     } catch (error) {
//       message.error('Error loading groups');
//       console.error('Error details:', error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserInvitations = async () => {
//     try {
//       const response = await nodeAxios.get('/users/invitations');
//       setUserInvitations(response.data.invitations);
//     } catch (error) {
//       console.error('Error fetching invitations:', error);
//     }
//   };

//   const createGroup = async () => {
//     if (!newGroupName.trim()) {
//       message.warning('Please enter a group name');
//       return;
//     }

//     try {
//       const response = await nodeAxios.post('/create-group', {
//         name: newGroupName
//       });
//       setGroups([response.data.group, ...groups]);
//       setNewGroupName('');
//       message.success('Group created successfully');
//     } catch (error) {
//       message.error(error.response?.data?.error || 'Error creating group');
//     }
//   };

//   const handleInvite = async () => {
//     if (!inviteUserId.trim()) {
//       message.warning('Please enter a user ID');
//       return;
//     }

//     try {
//       await nodeAxios.post(`/groups/${currentGroup._id}/invite/${inviteUserId}`);
//       message.success('Invitation sent successfully');
//       setIsModalVisible(false);
//       setInviteUserId('');
//     } catch (error) {
//       message.error(error.response?.data?.error || "Error sending invitation");
//     }
//   };

//   const handleAcceptInvitation = async (groupId) => {
//     try {
//       await nodeAxios.post(`/groups/${groupId}/accept`);
//       message.success('You have joined the group');
//       fetchUserGroups();
//       fetchUserInvitations();
//     } catch (error) {
//       message.error(error.response?.data?.error || "Error accepting invitation");
//     }
//   };

//   const handleDeclineInvitation = async (groupId) => {
//     try {
//       await nodeAxios.post(`/groups/${groupId}/decline`);
//       message.success('Invitation declined');
//       fetchUserInvitations();
//     } catch (error) {
//       message.error(error.response?.data?.error || "Error declining invitation");
//     }
//   };

//   const columns = [
//     {
//       title: 'Group Name',
//       dataIndex: 'group_name',
//       key: 'group_name',
//     },
//     {
//       title: 'Leader',
//       dataIndex: 'chef_name',
//       key: 'chef_name',
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <>
//           <Button 
//             type="link" 
//             onClick={() => handleAcceptInvitation(record.group_id)}
//             className="text-green-500"
//           >
//             Accept
//           </Button>
//           <Button 
//             type="link" 
//             onClick={() => handleDeclineInvitation(record.group_id)}
//             className="text-red-500"
//           >
//             Decline
//           </Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">My Groups</h2>
//         <div className="flex gap-4">
//           <Input
//             placeholder="New group name"
//             value={newGroupName}
//             onChange={(e) => setNewGroupName(e.target.value)}
//             className="w-64"
//             onPressEnter={createGroup}
//           />
//           <Button 
//             type="primary" 
//             onClick={createGroup}
//             className="bg-mypurple"
//             loading={loading}
//           >
//             Create Group
//           </Button>
//         </div>
//       </div>

//       {/* Invitations Table */}
//       {userInvitations.length > 0 && (
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold mb-4">Pending Invitations</h3>
//           <Table 
//             columns={columns} 
//             dataSource={userInvitations} 
//             rowKey="group_id"
//             pagination={false}
//           />
//         </div>
//       )}

//       {/* Groups List */}
//       {loading && groups.length === 0 ? (
//         <div className="text-center py-8">Loading...</div>
//       ) : (
//         <List
//           grid={{ gutter: 16, column: 3 }}
//           dataSource={groups}
//           renderItem={(group) => (
//             <List.Item>
//               <Card 
//                 title={group.name}
//                 actions={[
//                   <Button 
//                     type="link" 
//                     onClick={() => {
//                       setCurrentGroup(group);
//                       setIsModalVisible(true);
//                     }}
//                     className="text-mypurple"
//                   >
//                     Invite Member
//                   </Button>
//                 ]}
//               >
//                 <p><strong>Leader:</strong> {group.chef_id}</p>
//                 <p><strong>Members:</strong> {group.members.length}</p>
//                 <p><strong>Created:</strong> {new Date(group.created_at).toLocaleDateString()}</p>
//               </Card>
//             </List.Item>
//           )}
//         />
//       )}

//       {/* Invite Modal */}
//       <Modal
//         title={`Invite to ${currentGroup?.name}`}
//         visible={isModalVisible}
//         onOk={handleInvite}
//         onCancel={() => {
//           setIsModalVisible(false);
//           setInviteUserId('');
//         }}
//         okText="Send Invitation"
//         cancelText="Cancel"
//       >
//         <div className="space-y-4">
//           <Input
//             placeholder="User ID to invite"
//             value={inviteUserId}
//             onChange={(e) => setInviteUserId(e.target.value)}
//           />
//           {currentGroup && (
//             <p className="text-sm text-gray-500">
//               An invitation will be sent to this user to join "{currentGroup.name}"
//             </p>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Groupes;
// import React, { useState, useEffect } from 'react';
// import { Button, Input, List, Card, Modal, message, Table, Tag, Spin } from 'antd';
// import { nodeAxios } from '../../../axios';

// const Groupes = () => {
//   const [groups, setGroups] = useState([]);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
//   const [inviteUserId, setInviteUserId] = useState('');
//   const [currentGroup, setCurrentGroup] = useState(null);
//   const [loading, setLoading] = useState({
//     groups: false,
//     creating: false,
//     inviting: false
//   });
//   const [userDetails, setUserDetails] = useState({});

//   useEffect(() => {
//     fetchUserGroups();
//   }, []);

//   const fetchUserDetails = async (userIds) => {
//     try {
//       const uniqueIds = [...new Set(userIds.filter(id => !userDetails[id]))];
//       if (uniqueIds.length === 0) return;

//       const details = {};
//       await Promise.all(
//         uniqueIds.map(async (id) => {
//           try {
//             const response = await nodeAxios.get(`/users/${id}`);
//             details[id] = {
//               name: `${response.data.prenom} ${response.data.nom}`,
//               email: response.data.email
//             };
//           } catch (error) {
//             console.error(`Error fetching user ${id}:`, error);
//             details[id] = { name: `User ${id}`, email: '' };
//           }
//         })
//       );

//       setUserDetails(prev => ({ ...prev, ...details }));
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   const fetchUserGroups = async () => {
//     setLoading(prev => ({ ...prev, groups: true }));
//     try {
//       const response = await nodeAxios.get('/groups/user');
//       setGroups(response.data);
      
//       const allUserIds = response.data.flatMap(group => 
//         [group.chef_id, ...group.members]
//       );
//       await fetchUserDetails(allUserIds);
//     } catch (error) {
//       message.error('Failed to load groups');
//       console.error('Group load error:', error.response?.data || error.message);
//     } finally {
//       setLoading(prev => ({ ...prev, groups: false }));
//     }
//   };

//   const createGroup = async () => {
//     if (!newGroupName.trim()) {
//       message.warning('Please enter a group name');
//       return;
//     }

//     try {
//       setLoading(prev => ({ ...prev, creating: true }));
//       const response = await nodeAxios.post('/create-group', {
//         name: newGroupName
//       });
      
//       setGroups(prev => [response.data.group, ...prev]);
//       setNewGroupName('');
//       message.success('Group created successfully');
      
//       await fetchUserDetails([response.data.group.chef_id]);
//     } catch (error) {
//       message.error(error.response?.data?.error || 'Failed to create group');
//     } finally {
//       setLoading(prev => ({ ...prev, creating: false }));
//     }
//   };

//   const handleInvite = async () => {
//     if (!inviteUserId.trim()) {
//       message.warning('Please enter a user ID');
//       return;
//     }

//     try {
//       setLoading(prev => ({ ...prev, inviting: true }));
//       await nodeAxios.post(`/groups/${currentGroup._id}/invite/${inviteUserId}`);
      
//       message.success('Invitation sent successfully');
//       setIsInviteModalVisible(false);
//       setInviteUserId('');
//     } catch (error) {
//       message.error(error.response?.data?.error || "Failed to send invitation");
//     } finally {
//       setLoading(prev => ({ ...prev, inviting: false }));
//     }
//   };

//   const getUserDisplay = (userId) => {
//     return userDetails[userId]?.name || `User ${userId}`;
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">My Groups</h2>
//         <div className="flex gap-4">
//           <Input
//             placeholder="New group name"
//             value={newGroupName}
//             onChange={(e) => setNewGroupName(e.target.value)}
//             className="w-64"
//             onPressEnter={createGroup}
//           />
//           <Button 
//             type="primary" 
//             onClick={createGroup}
//             className="bg-mypurple"
//             loading={loading.creating}
//             disabled={loading.creating}
//           >
//             Create Group
//           </Button>
//         </div>
//       </div>

//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-4">My Groups</h3>
//         {loading.groups && groups.length === 0 ? (
//           <Spin tip="Loading groups..." />
//         ) : groups.length > 0 ? (
//           <List
//             grid={{ gutter: 16, column: 3 }}
//             dataSource={groups}
//             renderItem={(group) => (
//               <List.Item>
//                 <Card 
//                   title={group.name}
//                   actions={[
//                     <Button 
//                       type="primary" 
//                       onClick={() => {
//                         setCurrentGroup(group);
//                         setIsInviteModalVisible(true);
//                       }}
//                       className="bg-mypurple"
//                     >
//                       Invite Member
//                     </Button>
//                   ]}
//                   className="h-full"
//                 >
//                   <div className="space-y-2">
//                     <p>
//                       <span className="font-semibold">Leader:</span> {getUserDisplay(group.chef_id)}
//                     </p>
//                     <p className="font-semibold">Members:</p>
//                     <div className="max-h-32 overflow-y-auto border rounded p-2">
//                       {group.members.length > 0 ? (
//                         group.members.map(memberId => (
//                           <Tag key={memberId} className="mb-1">
//                             {getUserDisplay(memberId)}
//                           </Tag>
//                         ))
//                       ) : (
//                         <p className="text-gray-500">No members yet</p>
//                       )}
//                     </div>
//                     <p className="text-sm text-gray-500">
//                       Created: {new Date(group.created_at).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </Card>
//               </List.Item>
//             )}
//           />
//         ) : (
//           <p className="text-gray-500">You haven't joined any groups yet</p>
//         )}
//       </div>

//       <Modal
//         title={`Invite to ${currentGroup?.name}`}
//         visible={isInviteModalVisible}
//         onOk={handleInvite}
//         onCancel={() => {
//           setIsInviteModalVisible(false);
//           setInviteUserId('');
//         }}
//         okText={loading.inviting ? 'Sending...' : 'Send Invitation'}
//         cancelText="Cancel"
//         confirmLoading={loading.inviting}
//       >
//         <div className="space-y-4">
//           <Input
//             placeholder="User ID to invite"
//             value={inviteUserId}
//             onChange={(e) => setInviteUserId(e.target.value)}
//             disabled={loading.inviting}
//           />
//           {currentGroup && (
//             <p className="text-sm text-gray-500">
//               This will send an invitation to join "{currentGroup.name}"
//             </p>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Groupes;
import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Input, 
  List, 
  Card, 
  Modal, 
  message, 
  Table, 
  Tag, 
  Spin, 
  Select 
} from 'antd';
import { nodeAxios } from '../../../axios';

const { Option } = Select;

const Groupes = () => {
  // États principaux
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteUserId, setInviteUserId] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  
  // États de chargement
  const [loading, setLoading] = useState({
    groups: false,
    creating: false,
    inviting: false,
    users: false
  });

  // États des détails utilisateurs
  const [userDetails, setUserDetails] = useState({});

  // Charger les groupes de l'utilisateur au montage
  useEffect(() => {
    fetchUserGroups();
  }, []);

  // Récupérer les groupes de l'utilisateur
  const fetchUserGroups = async () => {
    setLoading(prev => ({ ...prev, groups: true }));
    try {
      const response = await nodeAxios.get('/groups/user');
      setGroups(response.data);
      
      // Récupérer les détails des membres
      const allUserIds = response.data.flatMap(group => 
        [group.chef_id, ...group.members]
      );
      await fetchUserDetails(allUserIds);
    } catch (error) {
      message.error('Failed to load groups');
      console.error('Group load error:', error.response?.data || error.message);
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  };

  // Récupérer les détails des utilisateurs
  const fetchUserDetails = async (userIds) => {
    try {
      const uniqueIds = [...new Set(userIds.filter(id => !userDetails[id]))];
      if (uniqueIds.length === 0) return;

      const details = {};
      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const response = await nodeAxios.get(`/users/${id}`);
            details[id] = {
              name: `${response.data.prenom} ${response.data.nom}`,
              email: response.data.email
            };
          } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            details[id] = { name: `User ${id}`, email: '' };
          }
        })
      );

      setUserDetails(prev => ({ ...prev, ...details }));
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Récupérer tous les utilisateurs pour l'invitation
  const fetchAllUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await nodeAxios.get('/users');
      setAllUsers(response.data);
    } catch (error) {
      message.error('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Créer un nouveau groupe
  const createGroup = async () => {
    if (!newGroupName.trim()) {
      message.warning('Please enter a group name');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, creating: true }));
      const response = await nodeAxios.post('/create-group', {
        name: newGroupName
      });
      
      setGroups(prev => [response.data.group, ...prev]);
      setNewGroupName('');
      message.success('Group created successfully');
      
      // Mettre à jour les détails du créateur
      await fetchUserDetails([response.data.group.chef_id]);
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to create group');
    } finally {
      setLoading(prev => ({ ...prev, creating: false }));
    }
  };

  // Ouvrir le modal d'invitation
  const showInviteModal = (group) => {
    setCurrentGroup(group);
    setIsInviteModalVisible(true);
    setInviteUserId(null); // Réinitialiser la sélection
    fetchAllUsers(); // Charger tous les utilisateurs
  };

  // Envoyer une invitation
  const handleInvite = async () => {
    if (!inviteUserId) {
      message.warning('Please select a user to invite');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, inviting: true }));
      await nodeAxios.post(`/groups/${currentGroup._id}/invite/${inviteUserId}`);
      
      message.success('Invitation sent successfully');
      setIsInviteModalVisible(false);
      setInviteUserId(null);
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to send invitation");
    } finally {
      setLoading(prev => ({ ...prev, inviting: false }));
    }
  };

  // Formater l'affichage des utilisateurs
  const getUserDisplay = (userId) => {
    return userDetails[userId]?.name || `User ${userId}`;
  };

  return (
    <div className="p-6">
      {/* En-tête avec création de groupe */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Groups</h2>
        <div className="flex gap-4">
          <Input
            placeholder="New group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-64"
            onPressEnter={createGroup}
          />
          <Button 
            type="primary" 
            onClick={createGroup}
            className="bg-mypurple"
            loading={loading.creating}
            disabled={loading.creating}
          >
            Create Group
          </Button>
        </div>
      </div>

      {/* Liste des groupes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">My Groups</h3>
        {loading.groups && groups.length === 0 ? (
          <Spin tip="Loading groups..." />
        ) : groups.length > 0 ? (
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={groups}
            renderItem={(group) => (
              <List.Item>
                <Card 
                  title={group.name}
                  actions={[
                    <Button 
                      type="primary" 
                      onClick={() => showInviteModal(group)}
                      className="bg-mypurple"
                    >
                      Invite Member
                    </Button>
                  ]}
                  className="h-full"
                >
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Leader:</span> {getUserDisplay(group.chef_id)}
                    </p>
                    <p className="font-semibold">Members:</p>
                    <div className="max-h-32 overflow-y-auto border rounded p-2">
                      {group.members.length > 0 ? (
                        group.members.map(memberId => (
                          <Tag key={memberId} className="mb-1">
                            {getUserDisplay(memberId)}
                          </Tag>
                        ))
                      ) : (
                        <p className="text-gray-500">No members yet</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(group.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <p className="text-gray-500">You haven't joined any groups yet</p>
        )}
      </div>

      {/* Modal d'invitation */}
      <Modal
        title={`Invite to ${currentGroup?.name}`}
        visible={isInviteModalVisible}
        onOk={handleInvite}
        onCancel={() => {
          setIsInviteModalVisible(false);
          setInviteUserId(null);
        }}
        okText={loading.inviting ? 'Sending...' : 'Send Invitation'}
        cancelText="Cancel"
        confirmLoading={loading.inviting}
      >
        <div className="space-y-4">
          <Select
            showSearch
            placeholder="Select a user to invite"
            optionFilterProp="children"
            loading={loading.users}
            style={{ width: '100%' }}
            onChange={(value) => setInviteUserId(value)}
            value={inviteUserId}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={loading.users ? <Spin size="small" /> : null}
          >
            {allUsers.map(user => {
              const isMember = currentGroup?.members.includes(user.id);
            
              return (
                <Option 
                  key={user.id} 
                  value={user.id}
                  disabled={isMember}
                >
                  {`${user.prenom} ${user.nom} (${user.email})`}
                  {isMember && <Tag color="green" className="ml-2">Already member</Tag>}
                </Option>
              );
            })}
          </Select>
          {currentGroup && (
            <p className="text-sm text-gray-500">
              This will send an invitation to join "{currentGroup.name}"
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Groupes;
