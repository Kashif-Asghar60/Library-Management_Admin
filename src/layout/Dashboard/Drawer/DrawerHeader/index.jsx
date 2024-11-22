import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from 'components/logo';
import { Box } from '@mui/material';

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  const theme = useTheme();

  return (
    <DrawerHeaderStyled theme={theme} open={!!open}>
 <Box
    sx={{
       backgroundColor: '#6ea2c9'   ,
    //  display: 'flex',
     /*  justifyContent: 'center', 
      alignItems: 'center', */
     width: '100%', 
    }}
  >
    <Logo isIcon={!open} sx={{ width: open ? 'auto' : 35, height: 35 ,}} />
  </Box>    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
