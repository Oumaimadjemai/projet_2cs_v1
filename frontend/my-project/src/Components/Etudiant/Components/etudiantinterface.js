import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  TeamOutlined,
  NotificationOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;

function EtudiantInterface() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Layout className="min-h-screen">
      <Sider 
        width={250}
        theme="light"
        className="border-r border-gray-200"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-mypurple">Espace Étudiant</h2>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          className="border-r-0"
        >
          <Menu.Item key="/etudiant/dashboard" icon={<UserOutlined />}>
            <Link to="/etudiant/dashboard">Mon Profil</Link>
          </Menu.Item>
          <Menu.Item key="/etudiant/groupes" icon={<TeamOutlined />}>
            <Link to="/etudiant/groupes">Mes Groupes</Link>
          </Menu.Item>
          <Menu.Item key="/etudiant/invitations" icon={<NotificationOutlined />}>
            <Link to="/etudiant/invitations">Invitations</Link>
          </Menu.Item>
          <Menu.Item 
            key="logout" 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            danger
          >
            Déconnexion
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content className="bg-[#ECF1F4] p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default EtudiantInterface;