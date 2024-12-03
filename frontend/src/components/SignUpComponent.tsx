
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
  useToast
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface Term {
  id: string;
  terms: string;
  isRequired: boolean;
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
  const [terms, setTerms] = useState<Term[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/terms');
        if (!response.ok) throw new Error('Erro ao buscar termos.');
        const data: Term[] = await response.json();
        setTerms(data);
      } catch (error) {
        toast({
          title: "Erro ao buscar termos.",
          description: (error as Error).message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchTerms();
  }, [toast]);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  const handleSignUp = async () => {
    if (!isChecked) {
      setError("Você deve aceitar os termos.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          acceptedTerms: isChecked
        }),      });

      if (!response.ok) throw new Error('Erro ao registrar usuário.');

      toast({
        title: "Cadastro bem-sucedido",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setName('');
      setEmail('');
      setPassword('');
      setShowSignUp(false);
    } catch (error) {
      setError('Erro ao registrar usuário.');
    }
  };

const handleAccept = () => {
  if (!isChecked) {
    setError("Você precisa aceitar os Termos e Condições.");
    return;
  }

  setError("");
  onClose();
};

const handleDecline = () => {
  setIsChecked(false);
  setError("");
  onClose();
};


  return (
    <Box
      w="100%"
      maxW="400px"
      p={6}
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      display="flex"
      flexDir="column"
      gap={2}
      border="2px"
      borderColor="green.700"
    >
      <Heading size="lg" color="green.900" textAlign="center">
        Sign Up
      </Heading>
      <FormControl>
        <FormLabel color="green.700">Name</FormLabel>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel color="green.700">Email</FormLabel>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel color="green.700">Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      {error && <Text color="red.500">{error}</Text>}
      <Checkbox
        isChecked={isChecked}
        onChange={handleCheckboxChange}
        colorScheme="green"
      >
        Eu aceito os 
        <Text
          as="span"
          color="green.900"
          textDecoration="underline"
          cursor="pointer"
          onClick={onOpen}
        >
          Termos e Condições
        </Text>
      </Checkbox>
      <Button
        bg="green.900"
        color="white"
        _hover={{ bg: "green.800" }}
        isDisabled={!isChecked}
        onClick={handleSignUp}
      >
        Sign Up
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Termos e Condições</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto" maxHeight="400px">
            {terms.length > 0 ? (
              <Text color="gray.700" whiteSpace="pre-line">
                {terms.map((term) => term.terms).join('; ')} {/* Concatena os termos com ";" */}
              </Text>
            ) : (
              <Text>Nenhum termo disponível.</Text>
            )}
          </ModalBody>
          <ModalFooter gap={2} flexDirection="column" alignItems="start">
            {/* Checkbox único para aceitar os termos */}
            <Checkbox
              id="acceptTermsCheckbox"
              isChecked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              colorScheme="green"
            >
              Eu aceito os Termos e Condições
            </Checkbox>
            <Box display="flex" gap={2} w="100%">
              <Button colorScheme="green" w="50%" onClick={handleAccept}>
                Confirmar
              </Button>
              <Button variant="ghost" w="50%" onClick={handleDecline}>
                Cancelar
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}

export default SignUpComponent;