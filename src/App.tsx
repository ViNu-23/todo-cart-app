import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Center,
  Box,
  Card as ChakraCard,
  CardBody,
  Input,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Button,
  Text,
  useToast,
  Image,
  Heading,
  Divider,
  CardFooter,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { LinkIcon, EditIcon, StarIcon, DeleteIcon } from '@chakra-ui/icons';

function App() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productLink, setProductLink] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Load existing products from local storage on component mount
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts);
  }, []);

  function addTocart() {
    // Check if any field is empty before adding the product
    if (!productName || !productBrand || !productPrice || !productLink) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields before adding the product.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: productName,
      brand: productBrand,
      price: parseFloat(productPrice),
      link: productLink,
    };

    const updatedProducts = [...products, newProduct];

    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Clear input values
    setProductName('');
    setProductBrand('');
    setProductPrice('');
    setProductLink('');

    toast({
      title: 'Product Added',
      description: 'Product has been added successfully.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    // Update the state with the new product
    setProducts(updatedProducts);
  }

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const openEditModal = (productId) => {
    const productToEdit = products.find(product => product.id === productId);
    setEditingProduct(productToEdit);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setIsEditModalOpen(false);
  };

  const saveEdit = () => {
    // Find the index of the product to be edited
    const productIndex = products.findIndex(product => product.id === editingProduct.id);

    // Create a copy of the products array to avoid directly mutating state
    const updatedProducts = [...products];

    // Update the product in the copied array
    updatedProducts[productIndex] = {
      ...editingProduct,
      name: productName || editingProduct.name,
      brand: productBrand || editingProduct.brand,
      price: parseFloat(productPrice) || editingProduct.price,
      link: productLink || editingProduct.link,
    };

    // Update the state and local storage
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Close the modal
    closeEditModal();
  };

  return (
    <>
      <Center>
        <Box>
          <ChakraCard m={4} minW={300}>
            <CardBody>
              <Text fontSize='3xl'>Add new Products to the Store</Text>

              <Stack spacing={3} mt={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents='none'>
                    <EditIcon color='gray.300' />
                  </InputLeftElement>
                  <Input
                    type='text'
                    placeholder='Product Name'
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </InputGroup>

                <InputGroup>
                  <InputLeftElement pointerEvents='none'>
                    <StarIcon color='gray.300' />
                  </InputLeftElement>
                  <Input
                    type='text'
                    placeholder='Product Brand'
                    value={productBrand}
                    onChange={(e) => setProductBrand(e.target.value)}
                  />
                </InputGroup>

                <InputGroup>
                  <InputLeftElement pointerEvents='none'>
                    <LinkIcon color='gray.300' />
                  </InputLeftElement>
                  <Input
                    type='text'
                    placeholder='Enter Product Link'
                    value={productLink}
                    onChange={(e) => setProductLink(e.target.value)}
                  />
                </InputGroup>

                <InputGroup>
                  <NumberInput min={1} w={'100%'} value={productPrice} onChange={(valueString) => setProductPrice(valueString)}>
                    <NumberInputField
                      placeholder='Product Price'
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>

                <Button colorScheme='blue' mt={2} onClick={addTocart}>
                  Add Product
                </Button>
              </Stack>
            </CardBody>
          </ChakraCard>
        </Box>
      </Center>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '10px',
        margin: '10px',
      }}>
        {products.map((product) => (
          <ChakraCard key={product.id} maxW={320}>
            <CardBody>
              <Image
                src={product.link} 
                alt={product.name}
                borderRadius='lg'
                objectFit='cover' 
        objectPosition='center' 
        boxSize='100%' 
              />
              <Stack mt='6' spacing='3'>
                <Heading size='md'>{product.name}</Heading>
                <Text>{product.brand}</Text>
                <Text color='blue.600' fontSize='2xl'>
                  ${product.price}
                </Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
              <ButtonGroup spacing='2'>
                <Button variant='solid' colorScheme='blue'>
                  Add To Cart
                </Button>
                <Button variant='ghost' colorScheme='gray' onClick={() => openEditModal(product.id)}>
                  Edit
                </Button>
                <Button variant='ghost' colorScheme='red' onClick={() => deleteProduct(product.id)}>
                  <DeleteIcon />
                </Button>
              </ButtonGroup>
            </CardFooter>
          </ChakraCard>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input
                type='text'
                placeholder='Product Name'
                value={productName || editingProduct?.name}
                onChange={(e) => setProductName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Product Brand</FormLabel>
              <Input
                type='text'
                placeholder='Product Brand'
                value={productBrand || editingProduct?.brand}
                onChange={(e) => setProductBrand(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Product Link</FormLabel>
              <Input
                type='text'
                placeholder='Enter Product Link'
                value={productLink || editingProduct?.link}
                onChange={(e) => setProductLink(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Product Price</FormLabel>
              <NumberInput min={1} w={'100%'} value={productPrice || editingProduct?.price} onChange={(valueString) => setProductPrice(valueString)}>
                <NumberInputField
                  placeholder='Product Price'
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={saveEdit}>
              Save
            </Button>
            <Button variant='ghost' onClick={closeEditModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default App;
