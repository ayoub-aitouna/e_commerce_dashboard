// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
	//   Chakra color mode
	let logoColor = useColorModeValue('navy.700', 'white');

	return (
		<Flex alignItems='center' flexDirection='column'>
			<Flex alignItems='center' flexDirection='row' gap={'10px'} >
				<Text fontSize='2xl' fontWeight='bold' mb={'20px'}>
					IpTv
				</Text>

				<Text fontSize='2xl' fontWeight='regular' mb={'20px'}>
					Dashboard
				</Text>

			</Flex>

			{/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
			<HSeparator mb='20px' />
		</Flex>
	);
}

export default SidebarBrand;
