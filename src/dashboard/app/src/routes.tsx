import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdPerson, MdHome, MdLock, MdOutlineShoppingCart } from 'react-icons/md';

// unused Pages
/*
 import NFTMarketplace from 'views/admin/marketplace';
 import Profile from 'views/admin/profile';
 import RTL from 'views/admin/rtl';
 import SignInCentered from 'views/auth/signIn';
*/

// Admin Imports
import MainDashboard from 'views/admin/default';

import DataTables from 'views/admin/dataTables';
import Products from 'views/admin/dataTables/Products';
import Costumers from 'views/admin/dataTables/Costumers';

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
		icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
		path: '/data-iptv',
		component: Products
	},
	{
		name: 'Petential Costumers',
		layout: '/admin',
		icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
		path: '/data-costumers',
		component: Costumers
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