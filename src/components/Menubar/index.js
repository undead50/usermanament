import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

const items = [
  {
    key: 'sub1',
    label: 'Home',
    icon: <MailOutlined />,
    children: [
      {
        key: 'g1',
        label: 'Item 1',
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
        ],
      },
      {
        key: 'g2',
        label: 'Settings',
        type: 'group',
        children: [
          {
            key: '3',
            label: 'Option 3',
          },
          {
            key: '4',
            label: 'Option 4',
          },
        ],
      },
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
          },
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
      style={{
        width: 1000,
        backgroundColor: '#8F0000', // Red background
        color: 'white', // White text color
      }}
      selectedKeys={[selectedKey]}
      mode="horizontal"
      items={items}
    >
      <style>
        {`
          .ant-menu-item {
            color: white !important; // White text color for items
          }
          .ant-menu-item:hover {
            background-color: yellow !important; // Darker red on hover
          }
          .ant-menu-submenu-title {
            color: white !important; // White text color for submenu titles
          }
          .ant-menu-submenu-title:hover {
            background-color: yellow !important; // Darker red on hover
          }
        `}
      </style>
    </Menu>
  );
}

export default MenuBar;
