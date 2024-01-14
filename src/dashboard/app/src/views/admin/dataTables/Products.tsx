import { Box, SimpleGrid, Select, Button, HStack, Flex, Text, IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

import { ProductAttributes, IpTvType } from 'states/products';

import ProductsTable from 'views/admin/dataTables/components/ProductsTable';



import { productStore, Filters } from 'states/products';

export default function Products() {
    const [Filter, setFilter] = useState<Filters>({ page: 1, sold: false, type: null } as Filters);


    const handleSoldFilterChange = (value: string) => {
        const Selected: boolean = value === "true" ? true : (value === "false" ? false : null);
        setFilter((v) => ({ ...v, sold: Selected } as Filters));
    };

    const handleTypeFilterChange = (value: string) => {
        const Selected: IpTvType = Object.values(IpTvType).find(v => v === value);
        setFilter((v) => ({ ...v, type: Selected } as Filters));
    };

    const { products, getProducts, error } = productStore((state) => ({
        products: state.products,
        getProducts: state.getProducts,
        error: state.error,
    }));
    useEffect(() => { getProducts(Filter) }, [Filter]);

    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <Flex justifyContent="space-between" mb={4} mx={10} mt={10} >
                <HStack spacing={4} w={'50%'}>
                    <Select
                        placeholder="Sold Filter"
                        value={Filter.sold ? "true" : (Filter.sold === false ? "false" : null)}
                        onChange={(e) => handleSoldFilterChange(e.target.value)}
                    >
                        <option value="true">Sold</option>
                        <option value="false">Available</option>
                    </Select>
                    <Select
                        placeholder="Type Filter"
                        value={Filter.type as string}
                        onChange={(e) => handleTypeFilterChange(e.target.value)}
                    >
                        <option value={IpTvType.Basic as string}>Basic</option>
                        <option value={IpTvType.Premium as string}>Premium</option>
                    </Select>
                </HStack>

            </Flex>


            <ProductsTable tableData={products} />

            <HStack justifyContent="flex-end" mt={5}>

                <Flex align="center">
                    <IconButton
                        aria-label="Edit"
                        icon={<ArrowBackIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        size="lg"
                        onClick={(e) => { setFilter((v) => ({ ...v, page: v.page > 1 ? v.page - 1 : v.page } as Filters)) }}
                    />
                </Flex>
                <Flex w={'40px'} h={'40px'} borderRadius={'50%'}
                    justifyContent="center" alignItems="center" backgroundColor={'blue.600'}>
                    <Text color={'white'}  >{Filter.page}</Text>
                </Flex>
                <Flex align="center">
                    <IconButton
                        aria-label="Edit"
                        icon={<ArrowForwardIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        size="lg"
                        onClick={(e) => { setFilter((v) => ({ ...v, page: v.page + 1 } as Filters)) }}
                    />
                </Flex>
            </HStack>
        </Box >
    );
}
