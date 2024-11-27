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
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/anamnesis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // Inclua credenciais se necessário
        body: JSON.stringify({
          historico_medico: historicoMedico,
          alergias: alergias,
          medicamentos: medicamentos,
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
      }
    } catch (error) {
      console.error('Erro ao criar anamnese', error.message);
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
