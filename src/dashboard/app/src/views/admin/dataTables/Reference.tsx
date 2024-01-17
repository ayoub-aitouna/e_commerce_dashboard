import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ReferenceTable from 'views/admin/dataTables/components/ReferenceTable';
import { referenceStore, ReferenceAttributes } from 'states/reference';

export default function Products() {



    const { references, getReferences } = referenceStore((state) => ({
        references: state.references,
        getReferences: state.getReference,
    }));
    useEffect(() => { getReferences() }, [null]);

    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>

            <ReferenceTable tableData={references} />

        </Box >
    );
}
