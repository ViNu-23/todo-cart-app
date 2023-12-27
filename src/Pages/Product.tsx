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
    const [quantityMap, setQuantityMap] = useState({}); // Map to store quantity for each product
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
      const quantity = quantityMap[productId] || 1; // Get quantity from the map or default to 1
  
      if (quantity <= 0) {
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
  
      const existingCartItem = cartItems.find((item) => item.id === productId);
  
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        const boughtItem = {
          id: productToBuy.id,
          name: productToBuy.name,
          price: productToBuy.price,
          quantity: quantity,
        };
        cartItems.push(boughtItem);
      }
  
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
      toast({
        title: 'Product Added',
        description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to the cart.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
  
      // Reset the quantity for the current product to 1
      setQuantityMap((prevQuantityMap) => ({
        ...prevQuantityMap,
        [productId]: '',
      }));
    };
  
    const handleEditClick = (product) => {
      setEditingProduct(product);
      setEditModalOpen(true);
    };
  
    const handleEditSubmit = () => {
      const index = products.findIndex((product) => product.id === editingProduct.id);
  
      if (index !== -1) {
        const updatedProducts = [...products];
        updatedProducts[index] = editingProduct;
  
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
  
        setEditModalOpen(false);
        setEditingProduct(null);
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
            <ChakraCard
              key={product.id}
              W={300}
              m={2}
              boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
              className='img-over'
            >
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
                    value={quantityMap[product.id] || ''}
                    placeholder='Qty'
                    style={{ width: '40px', borderRadius: '8px', backgroundColor: 'RGBA(0, 0, 0, 0.10)' }}
                    onChange={(e) => {
                      const newQuantityMap = {
                        ...quantityMap,
                        [product.id]: parseInt(e.target.value, 10),
                      };
                      setQuantityMap(newQuantityMap);
                    }}
                  />
                  <Button
                    variant='solid'
                    colorScheme='blue'
                    onClick={() => buyProduct(product.id)}
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
  