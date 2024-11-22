
// assets
import {  SolutionOutlined } from '@ant-design/icons';

// icons
const icons = {
    SolutionOutlined,
  
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const lease = {
  id: 'lease',
  title: 'Lease',
  type: 'group',
  children: [
    {
      id: 'lease-management',
      title: 'Lease Overview',
      type: 'item',
      url: '/lease-management',
      icon: icons.SolutionOutlined,
      breadcrumbs: false

    },
    {
      id: 'borrow-history',
      title: 'Borrow History',
      type: 'item',
      url: '/borrow-history',
      icon: icons.SolutionOutlined,
      breadcrumbs: false

    },
   
    
  ]
};

export default lease;
