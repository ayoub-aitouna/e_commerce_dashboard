// Chakra imports
import { Box, Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import { MdBarChart, MdOutlineCalendarToday } from 'react-icons/md';
// Assets
import { lineChartOptionsTotalSpent } from 'variables/charts';
import { StatisticsStore } from "states/statistics";
import { useEffect } from "react";

export default function TotalSpent(props: { [x: string]: any }) {
	const { ...rest } = props;

	// Chakra Color Mode

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const iconColor = useColorModeValue('brand.500', 'white');
	const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const bgHover = useColorModeValue({ bg: 'secondaryGray.400' }, { bg: 'whiteAlpha.50' });
	const bgFocus = useColorModeValue({ bg: 'secondaryGray.300' }, { bg: 'whiteAlpha.100' });

	const { YearState, getYearSatate } = StatisticsStore((state) => ({
		YearState: state.YearState,
		getYearSatate: state.getYearSatate,
	}));

	useEffect(() => {
		getYearSatate();
		console.log("YearlyRevenue.tsx", YearState);
	}, [null]);

	useEffect(() => {
		console.log("YearlyRevenue.tsx", YearState);
	}, [YearState]);

	return (
		<Card justifyContent='center' alignItems='center' flexDirection='column' w='100%' mb='0px' {...rest}>
			<Flex align='center' justify='space-between' w='100%' pe='20px' pt='5px'>
				<Button bg={boxBg} fontSize='sm' fontWeight='500' color={textColorSecondary} borderRadius='7px'>
					<Icon as={MdOutlineCalendarToday} color={textColorSecondary} me='4px' />
					This month
				</Button>
				<Button
					ms='auto'
					alignItems='center'
					justifyContent='center'
					bg={bgButton}
					_hover={bgHover}
					_focus={bgFocus}
					_active={bgFocus}
					w='37px'
					h='37px'
					lineHeight='100%'
					borderRadius='10px'
					{...rest}>
					<Icon as={MdBarChart} color={iconColor} w='24px' h='24px' />
				</Button>
			</Flex>
			<Flex w='100%' flexDirection={{ base: 'column', lg: 'row' }}>
				<Flex flexDirection='column' me='20px' mt='28px'>
					<Text color={textColor} fontSize='34px' textAlign='start' fontWeight='700' lineHeight='100%'>
						{YearState.currentMonthSells}
					</Text>
					<Flex align='center' mb='20px'>
						<Text color='secondaryGray.600' fontSize='sm' fontWeight='500' mt='4px' me='12px'>
							{new Date().toLocaleString('default', { month: 'long' })} Sells
						</Text>
					</Flex>
				</Flex>
				<Box minH='260px' minW='75%' mt='auto'>
					{YearState.monthsOfYear.length !== 0 ?
						<LineChart chartData={[
							{
								name: 'Total Selles',
								data: YearState.monthsOfYear,
							},
						]}
							chartOptions={lineChartOptionsTotalSpent} />
						: null
					}
				</Box>
			</Flex>
		</Card>
	);
}
