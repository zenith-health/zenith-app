import { Box, IconButton, VStack, Image, Tooltip } from '@chakra-ui/react';
import { FaHome, FaChartBar, FaDatabase, FaSignOutAlt, FaFileMedical, FaSearch, FaPersonBooth } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/health2-removebg.png';

interface SideBarProps {
  onSelect: (componentName: string) => void;
}

function SideBarComponent({ onSelect }: SideBarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove only user data (no need for JWT token handling)
    localStorage.removeItem('user');  // Removed token and role removal
    navigate('/'); // Redirect to home page after logout
  }

  return (
    <Box  
      w='8%' 
      h='100vh' 
      bgColor='green.900' 
      display='flex' 
      flexDirection='column' 
      justifyContent='space-between' 
      alignItems='center'
      position="fixed"
      top={0}
      left={0}
      py={4}
    >
      <Box mb={5}>
        <Image src={logo} alt="Health Logo" boxSize="50px" />
      </Box>

      <VStack spacing={12}>
        <Tooltip label="Home" fontSize="md">
          <IconButton 
            icon={<FaHome size="28px" />} 
            aria-label="Home" 
            color='white'
            bgColor='green.900'
            _hover={{ bg: 'green.700' }}
            onClick={() => onSelect('Home')}
            size="lg"
          />
        </Tooltip>  
        <Tooltip label="Anamnese" fontSize="md">
          <IconButton 
            icon={<FaFileMedical size="28px" />} 
            aria-label="Anamnese" 
            color='white'
            bgColor='green.900'
            _hover={{ bg: 'green.700' }}
            onClick={() => onSelect('anamnesis')}
            size="lg"
          />
        </Tooltip>
        <Tooltip label="Dados" fontSize="md">
          <IconButton 
            icon={<FaDatabase size="28px" />} 
            aria-label="Dados" 
            color='white'
            bgColor='green.900'
            _hover={{ bg: 'green.700' }}
            onClick={() => onSelect('data')}
            size="lg"
          />
        </Tooltip>
        <Tooltip label="Estatísticas" fontSize="md">
          <IconButton 
            icon={<FaChartBar size="28px" />} 
            aria-label="Estatísticas" 
            color='white'
            bgColor='green.900'
            _hover={{ bg: 'green.700' }}
            onClick={() => onSelect('statistics')}
            size="lg"
          />
        </Tooltip>
        <Tooltip label="Solutions" fontSize="md">
          <IconButton 
            icon={<FaSearch size="28px" />} 
            aria-label="Solution" 
            color='white'
            bgColor='green.900'
            _hover={{ bg: 'green.700' }}
            onClick={() => onSelect('recomendation')}
            size="lg"
          />
        </Tooltip>
        <Tooltip label="Profile" fontSize="md">
          <IconButton 
            icon={<FaPersonBooth size="28px" />} 
            aria-label="profile" 
            color='white'
            bgColor='green.900'
            _hover={{ bg: 'green.700' }}
            onClick={() => onSelect('profile')}
            size="lg"
          />
        </Tooltip>
      </VStack>

      <Tooltip label="Logout" fontSize="md">
        <IconButton 
          icon={<FaSignOutAlt size="28px" />} 
          aria-label="Logout" 
          color='white'
          bgColor='green.600'
          _hover={{ bg: 'red.500' }}
          onClick={handleLogout}
          size="lg"
          mt={4}
        />
      </Tooltip>
    </Box>
  );
}

export default SideBarComponent;
