import { useState, useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import SideBarComponent from '../components/SideBarComponent';
import HealthRecommendations from '../components/home/RecomendationsComponent';
import { DataComponent } from '../components/home/DataComponent';
import { AnamnesisFormComponent } from '../components/home/FormDataComponent';
import { MainComponent } from '../components/home/Components'; // Componente principal modificado
import { StatisticsComponent } from '../components/home/StatisticsComponent';
import { AdminComponent } from '../components/home/AdminComponent'; // AdminComponent
import { ProfileComponent } from '../components/home/ProfileComponent';

export function HomePage() {
  const [selectedComponent, setSelectedComponent] = useState('Home');
  const [role, setRole] = useState<string | null>(null);

  // Simulating the retrieval of the user role from localStorage (without JWT)
  useEffect(() => {
    const user = localStorage.getItem('user'); // Retrieve user data from localStorage
    if (user) {
      const parsedUser = JSON.parse(user); // Parse the stored user object
      setRole(parsedUser.role); // Set the role from the parsed user object
    } else {
      setRole(null); // No user data, set role to null
    }
  }, []);

  // Logic to render content based on role and selected component from sidebar
  const renderSelectedComponent = () => {
    if (role === 'admin') {
      return <AdminComponent />; // Show admin components if the role is admin
    } else if (role === 'user') {
      switch (selectedComponent) {
        case 'Home':
          return <MainComponent role={role} />; // Pass role to MainComponent
        case 'recomendation':
          return <HealthRecommendations />;
        case 'statistics':
          return <StatisticsComponent />;
        case 'data':
          return <DataComponent />;
        case 'anamnesis':
          return <AnamnesisFormComponent />;
        case 'profile':
          return <ProfileComponent />;
        default:
          return <MainComponent role={role} />;
      }
    } else {
      return <Heading>Bem-vindo! Por favor, faça login.</Heading>; // No role, show login prompt
    }
  };

  return (
    <Box display="flex">
      {role && <SideBarComponent onSelect={setSelectedComponent} />} {/* Show sidebar if role exists */}
      <Box flex="1" ml="8%" p={4} bgColor="gray.50" h="100vh" overflowY="auto">
        {renderSelectedComponent()} {/* Render selected component based on the role */}
      </Box>
    </Box>
  );
}

export default HomePage;
