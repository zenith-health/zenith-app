import { useState, useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import SideBarComponent from '../components/SideBarComponent';
import HealthRecommendations from '../components/home/RecomendationsComponent';
import { DataComponent } from '../components/home/DataComponent';
import { AnamnesisFormComponent } from '../components/home/FormDataComponent';
import { MainComponent } from '../components/home/Components'; // Componente principal modificado
import { StatisticsComponent } from '../components/home/StatisticsComponent';
import { AdminComponent } from '../components/home/AdminComponent'; // AdminComponent
import { ProfileComponent } from '../components/home/ProfileComponent'

export function HomePage() {
  const [selectedComponent, setSelectedComponent] = useState('Home');
  const [role, setRole] = useState<string | null>(null);

  // Simula a obtenção da role (exemplo)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Exemplo simplificado para pegar a role
      const decodedToken = { role: 'user' }; // Simulando decodificação do token
      setRole(decodedToken.role);
    } else {
      setRole(null); // Caso não tenha token
    }
  }, []);

  // Lógica para renderizar o conteúdo baseado na role e na escolha do sidebar
  const renderSelectedComponent = () => {
    if (role === 'admin') {
      return <AdminComponent />; // Exibe componentes de admin se for admin
    } else if (role === 'user') {
      switch (selectedComponent) {
        case 'Home':
          return <MainComponent role={role} />; // Passa a role para o MainComponent
        case 'recomendation':
          return <HealthRecommendations />;
        case 'statistics':
          return <StatisticsComponent />;
        case 'data':
          return <DataComponent />;
        case 'anamnesis':
          return <AnamnesisFormComponent />;
        case 'profile':
          return <ProfileComponent/>;
        default:
          return <MainComponent role={role} />;
      }
    } else {
      return <Heading>Bem-vindo! Por favor, faça login.</Heading>; // Caso não tenha role
    }
  };

  return (
    <Box display="flex">
      {role && <SideBarComponent onSelect={setSelectedComponent} />} {/* Exibe a sidebar apenas se a role existir */}
      <Box flex="1" ml="8%" p={4} bgColor="gray.50" h="100vh" overflowY="auto">
        {renderSelectedComponent()} {/* Renderiza o componente selecionado com base na role */}
      </Box>
    </Box>
  );
}

export default HomePage;
