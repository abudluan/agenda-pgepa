import React, { useState } from 'react';
import { Modal, FormControl, Input, Button, Toast, Spinner, Box } from 'native-base';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const LoginModal = ({ showModal, setShowModal, setIsUserLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    if (!email || !password) {
      Toast.show({
        title: 'Campos vazios',
        description: 'Por favor, preencha todos os campos.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuário logado:', userCredential.user);
        setIsUserLoggedIn(true);
        setShowModal(false);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Erro de autenticação:', error.message);
        Toast.show({
          title: 'Erro de autenticação',
          description: 'Credenciais inválidas. Por favor, verifique suas informações de login.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      });
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Login</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </FormControl>
          <FormControl mt="3">
            <FormControl.Label>Senha</FormControl.Label>
            <Input
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              onPress={handleLogin}
              colorScheme="success"
              isLoading={loading}
              disabled={loading}
            >
              {loading ? <Spinner color="white" /> : 'Entrar'}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default LoginModal;
