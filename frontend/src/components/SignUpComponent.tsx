import { 
  Heading, 
  Text, 
  Box, 
  Button, 
  Input, 
  FormControl, 
  FormLabel, 
  Checkbox, 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton, 
  ModalFooter,
  useToast,
  VStack
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface Term {
  id: string;
  terms: string; // Conteúdo do termo
  isRequired: boolean; // Se o termo é obrigatório
  accepted_on?: string;
}

interface SignUpComponentProps {
  setShowSignUp: (show: boolean) => void;
}

function SignUpComponent({ setShowSignUp }: SignUpComponentProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState('');
  const [terms, setTerms] = useState<Term[]>([]); // Estado que guarda os termos
  const [acceptedTerms, setAcceptedTerms] = useState<string[]>([]);
  const toast = useToast();

  // Buscar termos do backend ao carregar o componente
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/terms', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro ao buscar termos: ${errorData.error || response.statusText}`);
        }

        const data: Term[] = await response.json(); // Recebendo dados como array de termos
        setTerms(data); // Atualizando estado com os termos recebidos
      } catch (error) {
        console.error("Erro ao buscar termos", error);
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
  }, [toast]);

  const handleCheckboxChange = () => {
    if (isChecked) {
      setIsChecked(false);
    } else {
      onOpen(); 
    }
  };

  const handleAccept = () => {
    const requiredTerms = terms.filter(term => term.isRequired);
    const requiredAccepted = requiredTerms.every(term => acceptedTerms.includes(term.id));

    if (!requiredAccepted) {
      setError("Você deve aceitar os termos obrigatórios.");
      return;
    }

    setIsChecked(true);
    onClose(); 
  };

  const handleTermCheck = (terms: string) => {
    if (acceptedTerms.includes(terms)) {
      setAcceptedTerms(acceptedTerms.filter(id => id !== terms));
    } else {
      setAcceptedTerms([...acceptedTerms, terms]);
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          acceptedTerms,
        }),
      });

      console.log(response)

      if (!response.ok) {
        throw new Error('Erro ao registrar usuário');
      }

      toast({
        title: "Cadastro bem-sucedido",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setName('');
      setEmail('');
      setPassword('');
      setAcceptedTerms([]);
      
      setShowSignUp(false);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      setError('Erro ao registrar usuário.');
    }
  };

  const handleDecline = () => {
    setIsChecked(false);
    setAcceptedTerms([]);
    onClose();
  };

  return (
    <Box 
      w='100%' 
      maxW='400px'
      p={6}
      bg='white'
      borderRadius='md'
      boxShadow='lg'
      display='flex' 
      flexDir='column' 
      gap={2}
      border='2px'
      borderColor='green.700'
    >
      <Heading size='lg' color='green.900' fontFamily='Arial, sans-serif' textAlign='center'>
        Sign Up
      </Heading>
      <FormControl>
        <FormLabel htmlFor="name" color='green.700' fontWeight='bold'>Name</FormLabel>
        <Input 
          id="name"
          name="name"
          type='text' 
          placeholder='Enter your name'
          focusBorderColor='green.700'
          bg='gray.50'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="email" color='green.700' fontWeight='bold'>Email</FormLabel>
        <Input 
          id="email"
          name="email"
          type='email' 
          placeholder='Enter your email'
          focusBorderColor='green.700'
          bg='gray.50'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="password" color='green.700' fontWeight='bold'>Password</FormLabel>
        <Input 
          id="password"
          name="password"
          type='password' 
          placeholder='Enter your password'
          focusBorderColor='green.700'
          bg='gray.50'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      {error && <Text color='red.500' textAlign='center'>{error}</Text>}
      
      <Checkbox 
        id="termsCheckbox"
        isChecked={isChecked} 
        onChange={handleCheckboxChange} 
        colorScheme='green'
      >
        Eu aceito os <Text as="span" color="green.900" textDecoration="underline" cursor="pointer" onClick={onOpen}>Termos e Condições</Text>
      </Checkbox>

      <Button 
        bg='green.900' 
        color='white' 
        _hover={{ bg: 'green.800' }} 
        w='100%'
        fontFamily='Arial, sans-serif'
        fontWeight='bold'
        isDisabled={!isChecked} 
        onClick={handleSignUp}
      >
        Sign Up
      </Button>
      
      <Text textAlign='center' color='green.700'>
        Já tem uma conta? <Text as='span' cursor='pointer' color='green.700' fontWeight='bold' onClick={() => setShowSignUp(false)}>Login</Text>
      </Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Termos e Condições</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto" maxHeight="400px">
            <VStack align="start">
              {terms.length > 0 ? (
                terms.map((term) => (
                  <Box key={term.id}>
                    <Checkbox
                      id={`term_${term.id}`}
                      isChecked={acceptedTerms.includes(term.id)}
                      onChange={() => handleTermCheck(term.id)}
                      isDisabled={term.isRequired && acceptedTerms.includes(term.id)}
                      colorScheme="green"
                    >
                      {term.isRequired && <Text as="span" color="red.500">(Obrigatório)</Text>}
                    </Checkbox>
                    <Text mt={1} color="gray.700">{term.terms}</Text> {/* Exibindo o conteúdo dos termos */}
                  </Box>
                ))
              ) : (
                <Text>Nenhum termo disponível.</Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button colorScheme="green" onClick={handleAccept}>
              Aceitar
            </Button>
            <Button variant="ghost" onClick={handleDecline}>
              Recusar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SignUpComponent;
