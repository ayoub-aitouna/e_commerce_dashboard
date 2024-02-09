
// Chakra imports
import { Box, Icon, SimpleGrid, useColorModeValue, Select, Spinner, Flex } from '@chakra-ui/react';


import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdAttachMoney } from 'react-icons/md';
import { BiSolidTv } from 'react-icons/bi';

import PurchaseTable from 'views/admin/dataTables/components/PurchaseTable';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import { useEffect } from "react";
import { StatisticsStore, Filters } from "states/statistics";
import { IreferenceSite, referenceStore } from 'states/reference';
import { useState } from "react";
import { setOriginalNode } from 'typescript';

export default function UserReports() {
	// Chakra Color Mode
	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const [filters, setFilters] = useState<Filters>({ referenceId: undefined });
	const [leading, setleading] = useState<Boolean>(true);

	const { referencesSites, getReferenceSite } = referenceStore((state: any) => ({
		referencesSites: state.referencesSites,
		getReferenceSite: state.getReferenceSite,
	}));

	const { Statics, latestPurchases, getlatestPurchases, getStats } = StatisticsStore((state) => ({
		latestPurchases: state.latestPurchases,
		Statics: state.Statics,
		getlatestPurchases: state.getlatestPurchases,
		getStats: state.getStats,
	}));

	const LoadTableData = async () => {
		try {
			await getStats(filters);
			await getlatestPurchases(filters);
			await getReferenceSite();
			setleading(false);
			console.log("getlatestPurchases.tsx", latestPurchases, "Statics", Statics);
		} catch (error: any) {
			console.error(error);
		}
	};

	useEffect(() => {
		LoadTableData();
	}, [filters]);

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<Select
				placeholder="Reference Site"
				mb={4}
				bg={'white'}
				value={filters.referenceId}
				onChange={(e) => {
					setleading(true);
					let id = parseInt(e.target.value);
					setFilters((v) => ({ ...v, referenceId: id ? id : undefined } as Filters));
				}}
			>
				{
					referencesSites.map((ref: IreferenceSite) => {
						return <option value={ref.id}>{new URL(ref.site).hostname}</option>
					})
				}
			</Select>
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
				<TotalSpent filter={filters} />
				<WeeklyRevenue filter={filters} />
			</SimpleGrid>
			<PurchaseTable tableData={latestPurchases} Title={"Resent Purchases"} />
		</Box >
	);
}
