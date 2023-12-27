import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import NavBar from './NavBar';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems);
  }, []);

  const deleteCartItem = (itemId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  return (
    <>
      <NavBar />
      <Box p={4}>
        <Heading mb={4}>Cart</Heading>
        {cartItems.length === 0 ? (
          <Text>Your cart is empty.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Product Name</Th>
                <Th>Quantity</Th>
                <Th>Price</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cartItems.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.name}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>${item.price * item.quantity}</Td>
                  <Td>
                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => deleteCartItem(item.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        <Link to="/product">
          <Button mt={4} colorScheme="blue">
            Continue Shopping
          </Button>
        </Link>
      </Box>
    </>
  );
}
