import {
  Button,
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

export function AnamnesisFormComponent() {
  const [historicoMedico, setHistoricoMedico] = useState('');
  const [alergias, setAlergias] = useState('');
  const [medicamentos, setMedicamentos] = useState('');
  const toast = useToast();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Log data for debugging
    console.log(historicoMedico, alergias, medicamentos);

    // Check if required fields are provided
    if (!historicoMedico || !alergias || !medicamentos) {
      toast({
        title: 'Erro',
        description: 'Todos os campos são obrigatórios.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Retrieve user data from localStorage and parse it
    const userData = localStorage.getItem('user');
    if (!userData) {
      console.error('Usuário não encontrado. Faça login.');
      return;
    }

    const { email, id } = JSON.parse(userData);

    // Check if the email is available
    if (!email || !id) {
      console.error('Dados do usuário incompletos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/anamnesis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${id}`, // Using user ID as the authorization token
        },
        credentials: 'include', // Include credentials if needed
        body: JSON.stringify({
          historico_medico: historicoMedico,
          alergias: alergias,
          medicamentos: medicamentos,
          created_at: new Date().toISOString(), // Ensure date is in ISO format
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Anamnese criada com sucesso:', result);
        setHistoricoMedico('');
        setAlergias('');
        setMedicamentos('');
        toast({
          title: 'Anamnese concluída',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Erro ao criar anamnese', response.statusText);
        const errorData = await response.json();
        toast({
          title: 'Erro',
          description: errorData.error || 'Erro ao criar anamnese.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Erro ao criar anamnese', error.message);
      toast({
        title: 'Erro',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6}>
      <Heading mb={5}>Insira seus dados para Anamnese:</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="historico-medico" isRequired>
            <FormLabel>Histórico Médico</FormLabel>
            <Textarea
              placeholder="Descreva seu histórico médico..."
              value={historicoMedico}
              onChange={(e) => setHistoricoMedico(e.target.value)}
            />
          </FormControl>
          <FormControl id="alergias">
            <FormLabel>Alergias</FormLabel>
            <Input
              placeholder="Informe suas alergias"
              value={alergias}
              onChange={(e) => setAlergias(e.target.value)}
            />
          </FormControl>
          <FormControl id="medicamentos">
            <FormLabel>Medicamentos em Uso</FormLabel>
            <Input
              placeholder="Informe os medicamentos em uso"
              value={medicamentos}
              onChange={(e) => setMedicamentos(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="green">Salvar Dados</Button>
        </VStack>
      </form>
    </Box>
  );
}
