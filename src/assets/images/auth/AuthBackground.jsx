// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';import logo from 'assets/images/logo.png';

// ==============================|| AUTH BACKGROUND ||============================== //

export default function AuthBackground() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(18px)',
        zIndex: -1,
        bottom: 0,
        transform: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex', // Use flexbox
        alignItems: 'center', // Vertically center the content
        justifyContent: 'flex-start', // Left align the content
        paddingLeft: 2, // Optional: add some space from the left edge if needed
      }}
    >
      <img src={logo} alt="Logo" style={{ width: 'auto', height: 'auto' }} />
    </Box>
  );
}
