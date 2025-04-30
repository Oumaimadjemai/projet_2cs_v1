

// // export default Groupes;
// import React, { useState, useEffect } from 'react';
// import { 
//   Button, 
//   Input, 
//   List, 
//   Card, 
//   Modal, 
//   message, 
//   Table, 
//   Tag, 
//   Spin, 
//   Select 
// } from 'antd';
// import { nodeAxios } from '../../../axios';

// const { Option } = Select;

// const Groupes = () => {
//   // États principaux
//   const [groups, setGroups] = useState([]);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
//   const [inviteUserId, setInviteUserId] = useState(null);
//   const [currentGroup, setCurrentGroup] = useState(null);
//   const [allUsers, setAllUsers] = useState([]);
  
//   // États de chargement
//   const [loading, setLoading] = useState({
//     groups: false,
//     creating: false,
//     inviting: false,
//     users: false
//   });

//   // États des détails utilisateurs
//   const [userDetails, setUserDetails] = useState({});

//   // Charger les groupes de l'utilisateur au montage
//   useEffect(() => {
//     fetchUserGroups();
//   }, []);

//   // Récupérer les groupes de l'utilisateur
//   const fetchUserGroups = async () => {
//     setLoading(prev => ({ ...prev, groups: true }));
//     try {
//       const response = await nodeAxios.get('/groups/user');
//       setGroups(response.data);
      
//       // Récupérer les détails des membres
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

//   // Récupérer les détails des utilisateurs
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

//   // Récupérer tous les utilisateurs pour l'invitation
//   const fetchAllUsers = async () => {
//     setLoading(prev => ({ ...prev, users: true }));
//     try {
//       const response = await nodeAxios.get('/users');
//       setAllUsers(response.data);
//     } catch (error) {
//       message.error('Failed to load users');
//       console.error('Error loading users:', error);
//     } finally {
//       setLoading(prev => ({ ...prev, users: false }));
//     }
//   };

//   // Créer un nouveau groupe
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
      
//       // Mettre à jour les détails du créateur
//       await fetchUserDetails([response.data.group.chef_id]);
//     } catch (error) {
//       message.error(error.response?.data?.error || 'Failed to create group');
//     } finally {
//       setLoading(prev => ({ ...prev, creating: false }));
//     }
//   };

//   // Ouvrir le modal d'invitation
//   const showInviteModal = (group) => {
//     setCurrentGroup(group);
//     setIsInviteModalVisible(true);
//     setInviteUserId(null); // Réinitialiser la sélection
//     fetchAllUsers(); // Charger tous les utilisateurs
//   };

//   // Envoyer une invitation
//   const handleInvite = async () => {
//     if (!inviteUserId) {
//       message.warning('Please select a user to invite');
//       return;
//     }

//     try {
//       setLoading(prev => ({ ...prev, inviting: true }));
//       await nodeAxios.post(`/groups/${currentGroup._id}/invite/${inviteUserId}`);
      
//       message.success('Invitation sent successfully');
//       setIsInviteModalVisible(false);
//       setInviteUserId(null);
//     } catch (error) {
//       message.error(error.response?.data?.error || "Failed to send invitation");
//     } finally {
//       setLoading(prev => ({ ...prev, inviting: false }));
//     }
//   };

//   // Formater l'affichage des utilisateurs
//   const getUserDisplay = (userId) => {
//     return userDetails[userId]?.name || `User ${userId}`;
//   };

//   return (
//     <div className="p-6">
//       {/* En-tête avec création de groupe */}
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

//       {/* Liste des groupes */}
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
//                       onClick={() => showInviteModal(group)}
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

//       {/* Modal d'invitation */}
//       <Modal
//         title={`Invite to ${currentGroup?.name}`}
//         visible={isInviteModalVisible}
//         onOk={handleInvite}
//         onCancel={() => {
//           setIsInviteModalVisible(false);
//           setInviteUserId(null);
//         }}
//         okText={loading.inviting ? 'Sending...' : 'Send Invitation'}
//         cancelText="Cancel"
//         confirmLoading={loading.inviting}
//       >
//         <div className="space-y-4">
//           <Select
//             showSearch
//             placeholder="Select a user to invite"
//             optionFilterProp="children"
//             loading={loading.users}
//             style={{ width: '100%' }}
//             onChange={(value) => setInviteUserId(value)}
//             value={inviteUserId}
//             filterOption={(input, option) =>
//               option.children.toLowerCase().includes(input.toLowerCase())
//             }
//             notFoundContent={loading.users ? <Spin size="small" /> : null}
//           >
//             {allUsers.map(user => {
//               const isMember = currentGroup?.members.includes(user.id);
            
//               return (
//                 <Option 
//                   key={user.id} 
//                   value={user.id}
//                   disabled={isMember}
//                 >
//                   {`${user.prenom} ${user.nom} (${user.email})`}
//                   {isMember && <Tag color="green" className="ml-2">Already member</Tag>}
//                 </Option>
//               );
//             })}
//           </Select>
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
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  List,
  Card,
  Modal,
  message,
  Spin,
  Select,
  Tag
} from 'antd';
import { nodeAxios } from '../../../axios';
import photo from '../pages/image.png';

const { Option } = Select;

const Groupes = () => {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteUserId, setInviteUserId] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState({
    groups: false,
    creating: false,
    inviting: false,
    users: false
  });
  const [userDetails, setUserDetails] = useState({});
  

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const fetchUserGroups = async () => {
    setLoading(prev => ({ ...prev, groups: true }));
    try {
      const response = await nodeAxios.get('/groups/user');
      setGroups(response.data);

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

  const fetchUserDetails = async (userIds) => {
    try {
      const uniqueIds = [...new Set(userIds.filter(id => !userDetails[id]))];
      if (uniqueIds.length === 0) return;

      const details = {};
      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const response = await nodeAxios.get(`/users/${id}`);
            console.log("User fetched:", {
              id: id,
              photo_profil: response.data.photo_profil
            });
            details[id] = {
              name: `${response.data.prenom} ${response.data.nom}`,
              email: response.data.email,
              profileImageUrl: (response.data.photo_profil && response.data.photo_profil !== '') 
    ? response.data.photo_profil 
    : photo
           
            };
          } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            details[id] = {
              name: `User ${id}`,
              email: '',
              profileImageUrl: photo
            };
          }
        })
      );

      setUserDetails(prev => ({ ...prev, ...details }));
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
 

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

  const createGroup = async () => {
    if (!newGroupName.trim()) {
      message.warning('Please enter a group name');
      return;
    }
  
    try {
      setLoading(prev => ({ ...prev, creating: true }));
      const response = await nodeAxios.post('/groups/create-group', {
        name: newGroupName,
      });
  
      setGroups(prev => [response.data.group, ...prev]);
      setNewGroupName('');
      message.success('Group created successfully');
      await fetchUserDetails([response.data.group.chef_id]);
    } catch (error) {
      // Specific check for the "already created group" error
      if (error.response?.status === 400 && error.response?.data?.error === "Vous avez déjà créé un groupe pour cette année académique.") {
        alert("You have already created a group for this academic year");
      } else {
        // Default error message for other errors
        message.error(error.response?.data?.error || 'Failed to create group');
      }
  
      console.error('Error creating group:', error.response?.data || error.message);
    } finally {
      setLoading(prev => ({ ...prev, creating: false }));
    }
  };
  
  const showInviteModal = (group) => {
    setCurrentGroup(group);
    setIsInviteModalVisible(true);
    setInviteUserId(null);
    fetchAllUsers();
  };

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

  const getUserDisplay = (userId) => {
    return userDetails[userId]?.name || `User ${userId}`;
  };

  return (
    <div className="p-6">
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

      <div className="mb-6 ">
        {/* <h3 className="text-lg font-semibold mb-4">My Groups</h3> */}
        {loading.groups && groups.length === 0 ? (
          <Spin tip="Loading groups..." />
        ) : groups.length > 0 ? (
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={groups}
            renderItem={(group) => (
              <List.Item>
               
 <Card
  onClick={() => navigate(`/etudiant/group/${group._id}/select-theme`)}
  title={
    <div className="flex justify-between items-center">
      <span className="text-lg font-bold text-mypurple">{group.name}</span>
      <span className="text-sm text-gray-400">
        {new Date(group.created_at).toLocaleDateString()}
      </span>
    </div>
  }
  actions={[
    <Button
      type="primary"
      onClick={() => showInviteModal(group)}
      className="bg-mypurple hover:bg-purple-700 transition duration-200 rounded-full px-5"
    >
      Invite Member
    </Button>
  ]}
  className="max-w-sm w-full rounded-2xl shadow-[rgba(0,0,0,0.1)_0px_4px_12px] border border-gray-100 p-4 bg-white hover:shadow-[rgba(0,0,0,0.2)_0px_6px_15px] transition-all duration-300"
>
  <div className="space-y-4">
    <p className="text-gray-700">
      <span className="font-semibold text-gray-800">Leader:</span>{' '}
      {getUserDisplay(group.chef_id)}
    </p>

    <div>
      <p className="font-semibold text-gray-800 mb-2">Members:</p>
      <div className="flex -space-x-4 overflow-x-auto p-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {group.members.length > 0 ? (
          group.members.map(memberId => {
            const user = userDetails[memberId];
            const profileImage = user?.profileImageUrl || photo;

           
            return (
              <img
                key={memberId}
                src={profileImage}
                alt={user?.name || `User ${memberId}`}
                title={user?.name || `User ${memberId}`}
                className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover hover:scale-105 transition-transform duration-200"
              />
            );
          })
        ) : (
          <p className="text-gray-500">No members yet</p>
        )}
      </div>
    </div>
  </div>
</Card>



              </List.Item>
            )}
          />
        ) : (
          <p className="text-gray-500">You haven't joined any groups yet</p>
        )}
      </div>

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
