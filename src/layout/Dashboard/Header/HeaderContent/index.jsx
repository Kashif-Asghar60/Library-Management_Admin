// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// project import
import { GithubOutlined } from '@ant-design/icons';
import DrawerHeader from '../../Drawer/DrawerHeader';
import { useMemo } from 'react';
import Logo from 'components/logo';

// import AuthContext and useAuth
import { useAuth } from '../../../../contexts/AuthContext';
import BASE_URL from '../../../../api/config';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  
  // Get the logout function from context
  const { logout } = useAuth();

  // Logout function with API call
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage

      if (token) {
        // Make an API request to logout
        console.log('Logging out...',token);
        const response = await fetch(`${BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            'Content-Type': 'application/json', // Indicate content type as JSON
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          // On success, logout the user from the app context
          logout();
          console.log('Successfully logged out');
          // Redirect or handle post-logout action if needed
        } else {
          console.error('Logout failed:', data);
        }
      } else {
        console.error('No token found for logout');
      }
    } catch (error) {
      console.error('Error during logout API call:', error);
    }
  };

  return (
    <>
      {/* Uncomment this if you want to use the search component */}
      {/* {!downLG && <Search />} */}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(to right, #33A1DF, #3D7DE5)', // Apply linear gradient
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          display: 'flex',  // Add this to ensure it's a flex container
        }}
      >
        <Logo 
          isIcon={!downLG} 
          sx={{ 
            width: downLG ? 'auto' : 35, 
            height: 35, 
            display: 'flex', 
            alignItems: 'center',
            py: 2,
          }} 
        />
      </Box>

      {/* Logout Button */}
      <Button 
        onClick={handleLogout} 
        variant="contained" 
        color="secondary" 
        sx={{ marginLeft: 'auto', marginRight: 2 }}
      >
        Logout
      </Button>

      {/* Optionally, you can include more components here like Profile, Notifications */}
      {/* <Notification /> */}
      {/* {!downLG && <Profile />} */}
      {/* {downLG && <MobileSection />} */}
    </>
  );
}
