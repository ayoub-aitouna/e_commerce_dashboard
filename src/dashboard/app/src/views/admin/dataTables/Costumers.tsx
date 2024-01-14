
// Chakra imports
import { Box, SimpleGrid } from '@chakra-ui/react';
import tableDataColumns from 'views/admin/dataTables/variables/tableDataColumns';
import CostumersTable, { CostumersAttrebues } from 'views/admin/dataTables/components/CostumersTable';


const DummyData = [
    {
        Email: 'example1@example.com',
        bought: true,
        bought_at: new Date(),
        pending: false,
        pendding_at: new Date(),
        created_at: new Date(),
    },
    {
        Email: 'example2@example.com',
        bought: false,
        bought_at: new Date(),
        pending: true,
        pendding_at: new Date(),
        created_at: new Date(),
    },
    {
        Email: 'example3@example.com',
        bought: true,
        bought_at: new Date(),
        pending: false,
        pendding_at: new Date(),
        created_at: new Date(),
    },
    {
        Email: 'example4@example.com',
        bought: false,
        bought_at: new Date(),
        pending: true,
        pendding_at: new Date(),
        created_at: new Date(),
    },
    {
        Email: 'example5@example.com',
        bought: true,
        bought_at: new Date(),
        pending: false,
        pendding_at: new Date(),
        created_at: new Date(),
    },
    {
        Email: 'example6@example.com',
        bought: false,
        bought_at: new Date(),
        pending: true,
        pendding_at: new Date(),
        created_at: new Date(),
    },
    {
        Email: 'example7@example.com',
        bought: true,
        bought_at: new Date(),
        pending: false,
        pendding_at: new Date(),
        created_at: new Date(),
    },
    {
        Email: 'example8@example.com',
        bought: false,
        bought_at: new Date(),
        pending: true,
        pendding_at: new Date(),
        created_at: new Date(),
    },
];




export default function Costumers() {
    // Chakra Color Mode
    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <CostumersTable tableData={DummyData} />
        </Box>
    );
}
