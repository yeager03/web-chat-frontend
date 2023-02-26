import { FC, ReactElement } from "react";
import { Outlet } from "react-router-dom";

const Layout: FC = (): ReactElement => {
	return (
		<div className="wrapper">
			<Outlet />
		</div>
	);
};

export default Layout;
