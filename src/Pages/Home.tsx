import './Additional-Style.css'
import { useState, useEffect } from 'react';
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

} from '@chakra-ui/react';
import { LinkIcon, EditIcon, StarIcon, } from '@chakra-ui/icons';
import NavBar from './NavBar';

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

    const toast = useToast();

    useEffect(() => {
        const storedProducts: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
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

    return (
        <>
            <NavBar />
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



        </>
    );
}

export default App;

