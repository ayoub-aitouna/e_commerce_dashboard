
// Chakra imports
import { Box, Icon, SimpleGrid, useColorModeValue } from '@chakra-ui/react';


import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdAttachMoney, MdBarChart, MdFileCopy } from 'react-icons/md';
import { BiSolidShoppingBags, BiSolidTv } from 'react-icons/bi';

import PurchaseTable from 'views/admin/dataTables/components/PurchaseTable';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import tableDataCheck from 'views/admin/default/variables/tableDataCheck';
import { useEffect } from "react";
import { StatisticsStore } from "states/statistics";
import { MonthView } from 'react-calendar';

export default function UserReports() {
	// Chakra Color Mode
	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');


	const { Statics, latestPurchases, getlatestPurchases, getStats } = StatisticsStore((state) => ({
		latestPurchases: state.latestPurchases,
		Statics: state.Statics,
		getlatestPurchases: state.getlatestPurchases,
		getStats: state.getStats,
	}));

	useEffect(() => {
		getStats();
		getlatestPurchases();
		console.log("getlatestPurchases.tsx", latestPurchases, "Statics", Statics);
	}, [null]);

	useEffect(() => {
		console.log("getlatestPurchases.tsx", latestPurchases, "Statics", Statics);
	}, [latestPurchases]);

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }} gap='20px' mb='20px'>
				{/* <Spacer /> */}

				{/* Earning =  sales - spent */}
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />}
						/>
					}
					name='Tetal revenue today'
					value={Statics.todaysTotalRevenue}
				/>
				{/* how much you spent for the product */}
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />}
						/>
					}
					name='Total revenue this month'
					value={Statics.thisMonthTotalRevenue}
				/>

				{/* how much mony came from sels */}
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />}
						/>
					}
					name='Average order revenue today' value={Statics.AverageOrderRevenueToday} />

				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={BiSolidTv} color={brandColor} />}
						/>
					}

					name='Available IpTv-Prodducts'
					value={Statics.TotalAvailableProducts}
				/>


			</SimpleGrid>

			<SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
				<TotalSpent />
				<WeeklyRevenue />
			</SimpleGrid>
			<PurchaseTable tableData={latestPurchases} Title={"Resent Purchases"} />
		</Box>
	);
}
