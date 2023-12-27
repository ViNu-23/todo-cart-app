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
  
  interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    link: string;
    quantity?: number; 
  }
  
  export default function Product() {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [quantityMap, setQuantityMap] = useState<{ [productId: string]: number }>({});
    const toast = useToast();
  
    useEffect(() => {
      const storedProducts: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts(storedProducts);
    }, []);
  
    const deleteProduct = (productId: string) => {
      const updatedProducts = products.filter((product) => product.id !== productId);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    };
  
    const buyProduct = (productId: string) => {
        const quantity = quantityMap[productId] || 1;
      
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
      
        if (!productToBuy) {
          // Handle the case when productToBuy is undefined
          toast({
            title: 'Product Not Found',
            description: 'The selected product does not exist.',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
          return;
        }
      
        const cartItems: Product[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
        const existingCartItemIndex = cartItems.findIndex((item) => item.id === productId);
      
        if (existingCartItemIndex !== -1) {
          // If the item exists, update the quantity
          const existingCartItem = cartItems[existingCartItemIndex];
          existingCartItem.quantity = (existingCartItem.quantity || 0) + quantity;
        } else {
          // If the item doesn't exist, add a new item with quantity
          const boughtItem: Product = {
            id: productToBuy.id,
            name: productToBuy.name,
            brand: productToBuy.brand,
            price: productToBuy.price,
            link: productToBuy.link,
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
      
        setQuantityMap((prevQuantityMap) => ({
          ...prevQuantityMap,
          [productId]: 1, // Reset the quantity for the current product to 1
        }));
        
      };
      const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setEditModalOpen(true);
      };
    
      const handleEditSubmit = () => {
        if (editingProduct) {
          const index = products.findIndex((product) => product.id === editingProduct.id);
    
          if (index !== -1) {
            const updatedProducts = [...products];
            updatedProducts[index] = editingProduct;
    
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            setProducts(updatedProducts);
    
            setEditModalOpen(false);
            setEditingProduct(null);
          }
        }
    }
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
              w={300}
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
                  onChange={(e) =>
                    setEditingProduct((prevProduct) => ({
                      ...(prevProduct as Product), 
                      name: e.target.value,
                    }))
                  }
                />
              </FormControl>


              <FormControl mt={4}>
  <FormLabel>Brand</FormLabel>
  <Input
    type="text"
    value={editingProduct ? editingProduct.brand : ''}
    onChange={(e) =>
      setEditingProduct((prevEditingProduct) => ({
        ...prevEditingProduct!,
        brand: e.target.value,
      }))
    }
  />
</FormControl>
<FormControl mt={4}>
  <FormLabel>Price</FormLabel>
  <Input
    type="number"
    value={editingProduct ? editingProduct.price.toString() : ''}
    onChange={(e) =>
      setEditingProduct((prevEditingProduct) => ({
        ...prevEditingProduct!,
        price: parseFloat(e.target.value) || 0,
      }))
    }
  />
</FormControl>
<FormControl mt={4}>
  <FormLabel>Link</FormLabel>
  <Input
    type="text"
    value={editingProduct ? editingProduct.link : ''}
    onChange={(e) =>
      setEditingProduct((prevEditingProduct) => ({
        ...prevEditingProduct!,
        link: e.target.value,
      }))
    }
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
