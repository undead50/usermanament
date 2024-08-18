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
            label: 'Option 1',
          },
          {
            key: '2',
            label: 'Option 2',
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
        key: '6',
        label: 'Option 6',
      },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          {
            key: '7',
            label: 'Option 7',
          },
          {
            key: '8',
            label: 'Option 8',
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
            background-color: #a9111d !important; // Darker red on hover
          }
          .ant-menu-submenu-title {
            color: white !important; // White text color for submenu titles
          }
          .ant-menu-submenu-title:hover {
            background-color: #a9111d !important; // Darker red on hover
          }
        `}
      </style>
    </Menu>
  );
}

export default MenuBar;
