
// assets
import {  BellOutlined } from '@ant-design/icons';

// icons
const icons = {
    BellOutlined,
  
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const notification = {
  id: 'notification',
  title: 'Notifications',
  type: 'group',
  children: [
    {
      id: 'notification-management',
      title: 'Notify Users',
      type: 'item',
      url: '/notifications',
      icon: icons.BellOutlined,
      breadcrumbs: false

    },
   
    
  ]
};

export default notification;
