import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdConnectedTv, MdHome, MdLock, MdGroups } from 'react-icons/md';
import { VscReferences } from "react-icons/vsc";

// unused Pages
/*
 import NFTMarketplace from 'views/admin/marketplace';
 import Profile from 'views/admin/profile';
 import RTL from 'views/admin/rtl';
 import SignInCentered from 'views/auth/signIn';
*/

// Admin Imports
import MainDashboard from 'views/admin/default';

import Products from 'views/admin/dataTables/Products';
import Costumers from 'views/admin/dataTables/Costumers';
import Reference from 'views/admin/dataTables/Reference';

// Auth Imports

const routes = [
	{
		name: 'Main Dashboard',
		layout: '/admin',
		path: '/default',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		component: MainDashboard
	},
	{
		name: 'IPTV Products',
		layout: '/admin',
		icon: <Icon as={MdConnectedTv} width='20px' height='20px' color='inherit' />,
		path: '/data-iptv',
		component: Products
	},
	{
		name: 'Costumers',
		layout: '/admin',
		icon: <Icon as={MdGroups} width='20px' height='20px' color='inherit' />,
		path: '/data-costumers',
		component: Costumers
	}
	,
	{
		name: 'Reference',
		layout: '/admin',
		icon: <Icon as={VscReferences} width='20px' height='20px' color='inherit' />,
		path: '/data-reference',
		component: Reference
	}
];

export default routes;


/*,
	{
		name: 'Sign In',
		layout: '/auth',
		path: '/sign-in',
		icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
		component: SignInCentered
	}
	 */