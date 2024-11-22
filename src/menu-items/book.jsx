// assets
import {  BookOutlined } from '@ant-design/icons';

// icons
const icons = {
    
    BookOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const book = {
  id: 'books',
  title: ' Books Management',
  type: 'group',
  children: [
    {
      id: 'book-management',
      title: 'Manage Books',
      type: 'item',
      url: '/book-management',
      icon: icons.BookOutlined
    },
    {
      id: 'assign-book',
      title: 'Assign Book',
      type: 'item',
      url: '/assign-book',
      icon: icons.BookOutlined
    }
  ]
};

export default book;
