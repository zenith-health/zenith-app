import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  IconButton,
  Tooltip,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Term {
  id: string;
  terms: string;
  accepted_on?: string;
}

export const AdminComponent = () => {
  const navigate = useNavigate();
  const [newTerm, setNewTerm] = useState(''); // Initialized with an empty string
  const [termsList, setTermsList] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  // Função de logout
  const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Função para adicionar um termo
  const handleAddTerm = async () => {
    if (newTerm.trim() === '') return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/terms', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ terms: newTerm }), // Certifique-se de que o campo corresponde ao backend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add term: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      setTermsList([...termsList, { id: data.id, terms: newTerm, accepted_on: "" }]);
      setNewTerm(''); // Reset the input after adding
      toast({
        title: "Termo adicionado com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar o termo.",
        description: (error as Error).message || "Erro interno",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Função para buscar todos os termos
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        const response = await fetch('http://localhost:5000/api/terms', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclua credenciais se necessário
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch terms: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        setTermsList(data);
      } catch (error) {
        console.error("Erro ao buscar termos:", error);
        toast({
          title: "Erro ao buscar termos.",
          description: (error as Error).message || "Erro interno",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchTerms();
  }, []);

  // Função para deletar um termo
  const handleDeleteTerm = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/terms/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete term: ${errorData.error || response.statusText}`);
      }

      setTermsList(termsList.filter(term => term.id !== id));
      toast({
        title: "Termo deletado com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao deletar o termo.",
        description: (error as Error).message || "Erro interno",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Função para visualizar e editar um termo
  const handleViewOrEditTerm = (term: Term, edit: boolean = false) => {
    setSelectedTerm(term);
    setIsEditing(edit);
    onOpen();
  };

  const handleEditTerm = async () => {
    if (selectedTerm && selectedTerm.terms.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/terms/${selectedTerm.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ terms: selectedTerm.terms }), // Certifique-se de que o campo corresponde ao backend
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to update term: ${errorData.error || response.statusText}`);
        }

        const updatedTerm = await response.json();
        setTermsList(termsList.map(term => (term.id === updatedTerm.id ? updatedTerm : term)));
        onClose();
        toast({
          title: "Termo atualizado com sucesso.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Erro ao atualizar o termo.",
          description: (error as Error).message || "Erro interno",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box p={6}>
      <Heading>Bem-vindo Administrador</Heading>
      <Text>Bem-vindo ao painel de controle da Zenith! Onde você pode alterar os termos e condições do usuário:</Text>

      <Box mt={6}>
        <Text mb={2}>Digite os novos termos e condições:</Text>
        <Input
          value={newTerm}
          onChange={(e) => setNewTerm(e.target.value)}
          placeholder="Digite aqui os novos termos..."
          my={4}
        />
        <Button colorScheme="green" onClick={handleAddTerm}>Adicionar Termo</Button>

        {/* Tabela de termos */}
        <TableContainer mt={10}>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Termos</Th>
                <Th display="flex" justifyContent="flex-end">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {termsList.map((term) => (
                <Tr key={term.id}>
                  <Td>
                    <Text
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      maxWidth="300px" // Ajuste o valor conforme necessário
                    >
                      {term.terms}
                    </Text>
                  </Td>
                  <Td                     
                    display="flex"
                    justifyContent="flex-end">
                    <Button onClick={() => handleViewOrEditTerm(term)} bgColor={"lightgray"} mr={2}>
                      Visualizar
                    </Button>
                    <Button onClick={() => handleViewOrEditTerm(term, true)} colorScheme="green" mr={2}>
                      Editar
                    </Button>
                    <Button onClick={() => handleDeleteTerm(term.id)} colorScheme="red">
                      Deletar
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Box mt={10}>
        <Tooltip label="Logout" fontSize="md">
          <IconButton
            icon={<FaSignOutAlt size="28px" />}
            aria-label="Logout"
            color='white'
            bgColor='green.600'
            _hover={{ bg: 'green.500' }}
            onClick={Logout}
          />
        </Tooltip>
      </Box>

      {/* Modal de Visualização/Edição */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Editar Termo' : 'Visualizar Termo'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isEditing ? (
              <Input
                value={selectedTerm?.terms || ''}
                onChange={(e) => setSelectedTerm({ ...selectedTerm!, terms: e.target.value })}
                placeholder="Digite os termos atualizados aqui..."
              />
            ) : (
              <Text>{selectedTerm?.terms}</Text>
            )}
          </ModalBody>
          <ModalFooter>
            {isEditing ? (
              <Button colorScheme="green" onClick={handleEditTerm}>
                Salvar
              </Button>
            ) : (
              <Button colorScheme="gray" onClick={onClose}>
                Fechar
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
