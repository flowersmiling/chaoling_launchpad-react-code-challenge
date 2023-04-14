import React from 'react';
import {
Nav,
NavLink,
Bars,
NavMenu,
} from './Elements';

const Navbar = () => {
return (
	<>
	<Nav>
		<Bars />

		<NavMenu>
		<NavLink to='/home' activestyle="true">
			Home
		</NavLink>
		<NavLink to='/universities' activestyle="true">
			Universities
		</NavLink>
		<NavLink to='/postal' activestyle="true">
			Postal Lookup
		</NavLink>
		<NavLink to='/blogs' activestyle="true">
			Blogs
		</NavLink>
		<NavLink to='/sign-up' activestyle="true">
			Sign Up
		</NavLink>
		</NavMenu>
	</Nav>
	</>
);
};

export default Navbar;
