import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Heading,
  Text,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../context/userContext'; // Import UserContext

interface Anamnese {
  id: string;
  historico_medico: string;
  alergias: string;
  medicamentos: string;
  user_id: string;
}

export function DataComponent() {
  const [anamnesisList, setAnamnesisList] = useState<Anamnese[]>([]);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [selectedAnamnesis, setSelectedAnamnesis] = useState<Anamnese | null>(null);
  const toast = useToast();
  const { user } = useContext(UserContext); // Correctly destructure user from context

  useEffect(() => {
    const fetchAnamnesisData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado no localStorage');
        }

        // Decodifica o token para obter as informações do usuário
        const decodedToken: any = jwtDecode(token);
        console.log('Token decodificado:', decodedToken); // Log do token decodificado

        const response = await fetch('http://localhost:5000/api/anamnesis', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        setAnamnesisList(data);
      } catch (error) {
        console.error('Error fetching anamnese data:', error);
        toast({
          title: "Erro ao buscar dados",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchAnamnesisData();
  }, [toast]); // Added toast to the dependency array for best practices

  const deleteAnamnesis = async (id: string) => {
    if (!id) {
      console.error('ID inválido ou não definido.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado no localStorage');
      }

      const response = await fetch(`http://localhost:5000/api/anamnesis/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete anamnese: ${response.statusText}`);
      }

      setAnamnesisList((prevList) => prevList.filter((anamnese) => anamnese.id !== id));
      toast({
        title: "Registro deletado com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting anamnese:', error);
      toast({
        title: "Erro ao deletar",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleViewData = (anamnese: Anamnese) => {
    setSelectedAnamnesis(anamnese);
    setIsDataModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAnamnesis(null);
    setIsDataModalOpen(false);
  };

  // Função de exportação via e-mail com SendGrid
  const exportDataViaEmail = async () => {
    const token = localStorage.getItem("token");

    // Check if the user is logged in
    if (!token) {
      alert("Usuário não logado");
      return;
    }

    // Decodifica o token para obter o ID do usuário
    const decodedToken: any = jwtDecode(token);
    console.log('Token decodificado:', decodedToken); // Log do token decodificado

    const userId = decodedToken.sub; // Assuming 'sub' contains the user_id
    const userEmail = decodedToken.email; // Assuming 'email' contains the user's email

    if (!userId || !userEmail) {
      alert("User information is incomplete.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/export/anamnesis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, email: userEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      const result = await response.json();
      console.log(result.message);

      toast({
        title: "Dados exportados com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Erro ao exportar dados",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6}>
      <Heading>Seus Dados de Anamnese</Heading>
      {anamnesisList.length > 0 ? (
        <SimpleGrid columns={[1, 2, 3]} spacing={4} mt={4}>
          {anamnesisList.map((anamnese) => (
            <Box key={anamnese.id} borderWidth="1px" p={4} borderRadius="md">
              <Box>
                <Text fontWeight="bold">Histórico Médico:</Text>
                <Text isTruncated noOfLines={1}>
                  {anamnese.historico_medico}
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Alergias:</Text>
                <Text>{anamnese.alergias}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Medicamentos em Uso:</Text>
                <Text>{anamnese.medicamentos}</Text>
              </Box>
              <Button mt={2} mr={2} colorScheme="green" onClick={() => handleViewData(anamnese)}>
                Visualizar Dados
              </Button>
              <Button mt={2} colorScheme="red" onClick={() => deleteAnamnesis(anamnese.id)}>
                Deletar
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text mt={4}>Nenhuma anamnese encontrada.</Text>
      )}

      <Button colorScheme="blue" mt={4} onClick={exportDataViaEmail}>
        Exportar Dados por Email
      </Button>

      <Modal isOpen={isDataModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dados da Anamnese</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAnamnesis && (
              <>
                <Text fontWeight="bold">Histórico Médico:</Text>
                <Text>{selectedAnamnesis.historico_medico}</Text>
                <Text fontWeight="bold">Alergias:</Text>
                <Text>{selectedAnamnesis.alergias}</Text>
                <Text fontWeight="bold">Medicamentos:</Text>
                <Text>{selectedAnamnesis.medicamentos}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeModal}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
