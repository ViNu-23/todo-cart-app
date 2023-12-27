import  { useState, useEffect } from 'react';
import {
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

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  link: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [productBrand, setProductBrand] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string | null>(null);
  const [productLink, setProductLink] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts);
  }, []);

  function addTocart() {
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

    const newProduct: Product = {
      id: Date.now(),
      name: productName,
      brand: productBrand,
      price: parseFloat(productPrice || '0'),
      link: productLink,
    };

    const updatedProducts: Product[] = [...products, newProduct];

    localStorage.setItem('products', JSON.stringify(updatedProducts));

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

    setProducts(updatedProducts);
  }

  const deleteProduct = (productId: number) => {
    const updatedProducts: Product[] = products.filter(product => product.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
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
                  <NumberInput w={'100%'} value={productPrice || ''} onChange={(valueString) => setProductPrice(valueString)}>
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
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '10px',
        margin: '10px',
      }}>
        {products.map((product) => (
          <ChakraCard key={product.id} maxW={300} m={2}>
            <CardBody>
              <Image
                src={product.link}
                alt={product.name}
                borderRadius='lg'
                objectFit='cover'
                objectPosition='center'
                boxSize='100%'
                h={180}
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

      
    </>
  );
}

export default App;
