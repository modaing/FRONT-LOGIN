import Header from "../components/Header";
import {Outlet} from 'react-router-dom';
import Sidebar from "../components/Sidebar";

function Layout() {

    return (
        <>
            <Header />
            <Sidebar />
            <Outlet />
        </>
    )
}

export default Layout;