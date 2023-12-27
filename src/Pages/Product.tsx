import {
    Card as ChakraCard,
    CardBody,
    Stack,
    Button,
    Text,
    Image,
    Heading,
    Divider,
    CardFooter,
    ButtonGroup,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    FormControl,
    FormLabel,
  } from '@chakra-ui/react';
  import { DeleteIcon } from '@chakra-ui/icons';
  import NavBar from './NavBar';
  import { useState, useEffect } from 'react';
  
  export default function Product() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const toast = useToast();
  
    useEffect(() => {
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts(storedProducts);
    }, []);
  
    const deleteProduct = (productId) => {
      const updatedProducts = products.filter((product) => product.id !== productId);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    };
  
    const buyProduct = (productId) => {
        const quantityInput = document.getElementById("quantity");
        const parsedQuantity = parseInt(quantityInput.value, 10);
      
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
          toast({
            title: 'Quantity Error',
            description: 'Please select a quantity greater than 0.',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
          return;
        }
      
        const productToBuy = products.find((product) => product.id === productId);
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
        // Check if the product is already in the cart
        const existingCartItem = cartItems.find((item) => item.id === productId);
      
        if (existingCartItem) {
          // Update the quantity of the existing item
          existingCartItem.quantity += parsedQuantity;
        } else {
          // Add a new item to the cart
          const boughtItem = {
            id: productToBuy.id,
            name: productToBuy.name,
            price: productToBuy.price,
            quantity: parsedQuantity,
          };
          cartItems.push(boughtItem);
        }
      
        // Update the cartItems in localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
        toast({
          title: 'Product Added',
          description: `${parsedQuantity} ${parsedQuantity > 1 ? 'items' : 'item'} added to the cart.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      
        // Clear the quantity input field after buying
        quantityInput.value = '';
      };
      
      
      
      
    const handleEditClick = (product) => {
      setEditingProduct(product);
      setEditModalOpen(true);
    };
  
    const handleEditSubmit = () => {
        // Find the index of the editing product in the products array
        const index = products.findIndex((product) => product.id === editingProduct.id);
      
        // If the product is found, update it in the state and localStorage
        if (index !== -1) {
          const updatedProducts = [...products];
          updatedProducts[index] = editingProduct;
      
          localStorage.setItem('products', JSON.stringify(updatedProducts));
          setProducts(updatedProducts);
      
          setEditModalOpen(false); // Close the modal
          setEditingProduct(null); // Reset the editingProduct state
        }
      };
  
    return (
      <>
        <NavBar />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '10px',
            margin: '10px',
          }}
        >
          {products.map((product) => (
            <ChakraCard key={product.id} W={300} m={2} boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px" className='img-over'>
              <CardBody>
                <Image
                  className='img-prod'
                  src={product.link}
                  alt={product.name}
                  borderRadius='lg'
                  objectFit='cover'
                  objectPosition='center'
                  boxSize='100%'
                  h={180}
                  transition="transform 0.3s ease-in-out"
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
                  <input
                    type='number'
                    id="quantity"
                    name="quantity"
                    min="1"
                    placeholder='Qty'
                    style={{ width: '40px', borderRadius: '8px', backgroundColor:'RGBA(0, 0, 0, 0.10)' }}
                  />
                  <Button
                    variant='solid'
                    colorScheme='blue'
                    onClick={() => buyProduct(product.id, parseInt(document.getElementById("quantity").value, 10))}
                  >
                    Buy
                  </Button>
                  <Button variant='ghost' colorScheme='gray' onClick={() => handleEditClick(product)}>
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
        <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={editingProduct ? editingProduct.name : ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Brand</FormLabel>
                <Input
                  type="text"
                  value={editingProduct ? editingProduct.brand : ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  value={editingProduct ? editingProduct.price : ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Link</FormLabel>
                <Input
                  type="text"
                  value={editingProduct ? editingProduct.link : ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, link: e.target.value })}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleEditSubmit}>
                Save
              </Button>
              <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  