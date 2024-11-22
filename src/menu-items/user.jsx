// assets
import {  UserOutlined } from '@ant-design/icons';

// icons
const icons = {
    UserOutlined,
  
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const user = {
  id: 'user',
  title: 'User Management',
  type: 'group',
  children: [
    {
      id: 'user-page',
      title: 'Users',
      type: 'item',
      url: '/user-management',
      icon: icons.UserOutlined,
      breadcrumbs: false

    },
   
    
  ]
};

export default user;
