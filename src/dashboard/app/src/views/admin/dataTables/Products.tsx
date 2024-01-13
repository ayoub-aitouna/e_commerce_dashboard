
// Chakra imports
import { Box, SimpleGrid } from '@chakra-ui/react';
import ProductsTable from 'views/admin/dataTables/components/ProductsTable';
import tableDataColumns from 'views/admin/dataTables/variables/tableDataColumns';

export default function Products() {
    // Chakra Color Mode
    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            {/* <ProductsTable tableData={tableDataColumns} /> */}
        </Box>
    );
}
