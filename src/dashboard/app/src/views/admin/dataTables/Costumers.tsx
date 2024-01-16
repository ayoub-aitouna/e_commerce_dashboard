
// Chakra imports
import { Box, SimpleGrid, Select, Button, HStack, Flex, Text, IconButton, Spinner } from '@chakra-ui/react';
import CostumersTable from 'views/admin/dataTables/components/CostumersTable';
import { useEffect, useState } from 'react';
import { CostumersAttrebues, Filters, costumerStore } from 'states/costumers';
import { ArrowBackIcon, ArrowForwardIcon, DownloadIcon } from "@chakra-ui/icons";
import { IconContext } from 'react-icons';
import { BaseUrl } from 'variables/Api';

export default function Costumers() {
    const [Filter, setFilter] = useState<Filters>({ page: 1, bought: null, pending: null } as Filters);

    const [loading, setloading] = useState<boolean>(false);
    const handleBoughtFilterChange = (value: string) => {
        const Selected: boolean = value === "true" ? true : (value === "false" ? false : null);
        setFilter((v) => ({ ...v, bought: Selected } as Filters));
    };

    const handlePendingFilterChange = (value: string) => {
        setFilter((v) => ({ ...v, pending: false } as Filters));
    };

    const handleDownload = async (e: any) => {
        setloading(true);
        await downloadCostumers(Filter);
        setloading(false);
    }

    const { costumers, getCostumers, downloadCostumers } = costumerStore((state: any) => ({
        costumers: state.costumers,
        getCostumers: state.getCostumers,
        downloadCostumers: state.downloadCostumers
    }));

    useEffect(() => { getCostumers(Filter) }, [Filter]);


    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <Flex justifyContent="space-between" mb={4} mx={10} mt={10} >
                <HStack spacing={4} w={'50%'}>
                    <Select
                        placeholder="Bought Filter"
                        value={Filter.bought ? "true" : (Filter.bought === false ? "false" : null)}
                        onChange={(e) => handleBoughtFilterChange(e.target.value)}
                    >
                        <option value="true">Sold</option>
                        <option value="false">Available</option>
                    </Select>
                    <Select
                        placeholder="Pending Filter"
                        value={Filter.pending ? "true" : (Filter.pending === false ? "false" : null)}
                        onChange={(e) => handlePendingFilterChange(e.target.value)}
                    >
                        <option value="true">Sold</option>
                        <option value="false">Available</option>
                    </Select>
                </HStack>
                <Flex align="center" gap={5}>
                        <Button
                            colorScheme="blue"
                            _hover={{ backgroundColor: "gray.900" }}
                            backgroundColor="blue.500"
                            rightIcon={loading ? <Spinner size='sm' /> : <DownloadIcon />}
                            variant='ghost'
                            aria-label="Update"
                            color={"white"}
                            size="md"
                            onClick={(e) => handleDownload(e)}>
                            Download As csv
                        </Button>


                </Flex>
            </Flex>


            <CostumersTable tableData={costumers} />

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
