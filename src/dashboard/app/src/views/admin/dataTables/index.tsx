
// Chakra imports
import { Box, SimpleGrid } from '@chakra-ui/react';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import tableDataColumns from 'views/admin/dataTables/variables/tableDataColumns';


export default function Settings() {
	// Chakra Color Mode
	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<ColumnsTable tableData={tableDataColumns} />
			{/* <SimpleGrid mb='20px' columns={{ sm: 1, md: 2 }} spacing={{ base: '20px', xl: '20px' }}>
				<DevelopmentTable   tableData={tableDataDevelopment} />
				<CheckTable tableData={tableDataCheck} />
				<ComplexTable tableData={tableDataComplex} />
			</SimpleGrid> */}
		</Box>
	);
}











