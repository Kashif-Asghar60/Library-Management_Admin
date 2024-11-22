
// assets
import {  BellOutlined ,FileTextOutlined, HistoryOutlined, FireOutlined, ClockCircleOutlined} from '@ant-design/icons';

// icons
const icons = {
    FileTextOutlined,
  
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const reports = {
  id: 'Reports',
  title: 'Reports',
  type: 'group',
  children: [
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/reports',
      icon: icons.FileTextOutlined,
      breadcrumbs: false

    },
   
    
  ]
};

export default reports;
