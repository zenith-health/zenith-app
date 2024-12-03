import { Box, Heading, Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useToast, VStack, HStack, Avatar, Divider, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProfileComponent = () => {
    const [user, setUser] = useState<any>(null); // No longer need to be strongly typed
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    // Função para buscar os detalhes do usuário
    const fetchUserDetails = async () => {
        try {
            // Retrieve user information from localStorage
            const userData = localStorage.getItem('user');
            if (!userData) {
                throw new Error("Usuário não encontrado. Faça login.");
            }

            const parsedUserData = JSON.parse(userData);
            setUser(parsedUserData); // Set the user data in state
        } catch (error) {
            toast({
                title: "Erro ao buscar detalhes do usuário.",
                description: (error as Error).message || "Erro interno",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Função para excluir o perfil do usuário
    const handleDeleteProfile = async () => {
        try {
            // Assume user is stored in localStorage and has an id or email
            const userData = localStorage.getItem('user');
            if (!userData) {
                throw new Error("Usuário não encontrado. Faça login.");
            }

            const parsedUserData = JSON.parse(userData);
            
            // Assuming the user data contains an `id` or `email` for deleting the profile
            const response = await fetch('http://localhost:5000/users/user/delete', { // Ajuste para a rota correta de exclusão
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: parsedUserData.id // or `email`, depending on the API
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Falha ao excluir perfil: ${errorData.message || response.statusText}`);
            }

            // Remove user-related data and redirect
            localStorage.removeItem('user');
            localStorage.removeItem('role');

            toast({
                title: "Perfil excluído com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            navigate('/'); // Redirecionar para a página inicial ou página de login
        } catch (error) {
            toast({
                title: "Erro ao excluir o perfil.",
                description: (error as Error).message || "Erro interno",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // useEffect para buscar detalhes do usuário ao montar o componente
    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <Box maxW="500px" mx="auto" mt={8} p={6} boxShadow="lg" borderRadius="md" bg="white">
            <VStack spacing={6} align="center">
                <Heading fontSize="2xl" textAlign="center" color="green.800">Perfil do Usuário</Heading>
                {user ? (
                    <>
                        <Avatar size="xl" name={user.name} src={user.profilePicture} />
                        <VStack spacing={2} align="center">
                            <Text fontSize="lg" fontWeight="bold">Nome: {user.name}</Text>
                            <Text fontSize="md" color="gray.500">Email: {user.email}</Text>
                        </VStack>
                        <Divider borderColor="gray.300" />
                        <Button colorScheme="red" variant="solid" onClick={onOpen}>Excluir Perfil</Button>
                    </>
                ) : (
                    <Spinner size="lg" color="teal.500" />
                )}
            </VStack>

            {/* Modal de confirmação de exclusão */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Excluir Perfil</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Tem certeza de que deseja excluir seu perfil? Essa ação não pode ser desfeita.</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={handleDeleteProfile}>
                            Sim, excluir
                        </Button>
                        <Button ml={3} onClick={onClose}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};
