import { Box } from '@chakra-ui/react';
import  SmallHomeCarousel from './HomeCarousel'; // Assumindo que esse seja o carrossel

export function MainComponent({ role }: { role: string }) {
  return (
    <Box p={6}>
      {role === 'user' && <SmallHomeCarousel />} {/* Exibe apenas para usuários */}
    </Box>
  );
}
