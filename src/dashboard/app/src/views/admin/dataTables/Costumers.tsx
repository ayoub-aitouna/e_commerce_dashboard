
// Chakra imports
import { Box } from '@chakra-ui/react';
import CostumersTable from 'views/admin/dataTables/components/CostumersTable';
import { useEffect, useState } from 'react';
import { CostumersAttrebues,Filters, costumerStore } from 'states/costumers';


export default function Costumers() {
    const [Filter, setFilter] = useState<Filters>({ page: 1, bought: false, pending: null } as Filters);

    
    const { costumers, getCostumers, downloadCostumers } = costumerStore((state : any) => ({
        costumers: state.costumers,
        getCostumers: state.getCostumers,
        downloadCostumers: state.downloadCostumers
    }));

    useEffect(() => { getCostumers(Filter) }, [Filter]);


    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <CostumersTable tableData={costumers} />
        </Box>
    );
}
