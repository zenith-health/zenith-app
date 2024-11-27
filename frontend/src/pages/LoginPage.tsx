import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import LoginComponent from '../components/LoginComponent';
import SignUpComponent from '../components/SignUpComponent';
import TextSlider from '../components/TextSliderLogin';
import Logo from '../assets/ZENITH.png';

function LoginPage() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <Box 
      w='100vw' 
      h='100vh' 
      display='flex' 
      justifyContent='center' 
      alignItems='center'
    >
      <Box
        w='60%'
        h='100%' 
        bgColor='green.900' 
        display='flex'
        justifyContent='center'
        alignItems='center'
        p={10}
      >
        <TextSlider />
      </Box>
      <Box 
        w='40%' 
        h='100%' 
        bg='rgba(255, 255, 255, 0.9)' 
        display='flex' 
        flexDir='column' 
        justifyContent='center' 
        alignItems='center'
        p={10}
      >
        <Box
          w='100%'
          h='100%'
          bgImage={`url(${Logo})`}
          bgPosition="center" 
          bgRepeat="no-repeat" 
          bgSize="300px"
          position="relative" 
        />
        
        {showSignUp ? <SignUpComponent setShowSignUp={setShowSignUp} /> : <LoginComponent setShowSignUp={setShowSignUp} />}
      </Box>
    </Box>
  );
}

export default LoginPage;
