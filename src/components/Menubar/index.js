import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import './MenuBar.css'

const { SubMenu } = Menu;

const items = [
  {
    key: 'sub1',
    label: 'Home',
    icon: <MailOutlined />,
    children: [
      {
        key: 'g1',
        label: 'User Approval',
        type: 'group',
        children: [
          {
            key: '',
            label: 'Dashboard',
          },
          {
            key: '/create-approval',
            label: 'Request Approval',
          },
          {
            key: '/approval-index',
            label: 'Pending',
          },
          {
            key: 'request-chain',
            label: 'Request Chain',
          },
         
        ],
      }
    ],
  },
  {
    key: 'sub2',
    label: 'Settings',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '/branch',
        label: 'Branch',
        url: '/branch',
      },
      {
        key: '/employee',
        label: 'Users',
      },
      
      {
        key: 'sub3',
        label: 'Application',
        children: [
          {
            key: '/application',
            label: 'Application',
          },
          {
            key: '/request',
            label: 'RequestType',
          },
          {
            key: '/role',
            label: 'Role',
          },
          {
            key: '/service',
            label: 'Service',
          }
        ],
      },
    ],
  },
];

function MenuBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const handleClick = (e) => {
    console.log('click ', e);
    navigate(e.key);
  };

  return (
    <Menu
      onClick={handleClick}
      theme="light"
      style={{
        width: 1000,
        backgroundColor: '#8F0000', // Red background
        color: 'white', // White text color
      }}
      selectedKeys={[selectedKey]}
      mode="horizontal"
      items={items}
    >
     
    </Menu>
  );
}

export default MenuBar;
