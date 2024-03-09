import { Nav, NavItem, Navbar, NavbarBrand } from "react-bootstrap";
import logo from "../assets/logo.png";
import user from "../assets/icons/user.gif";
import { Link, NavLink } from "react-router-dom";

export default function Navigation() {
    return(
        <Navbar className="h-24 fixed top-0 bg-blue-100 w-screen">
            <NavbarBrand>
                <img src={logo} alt="" className="h-24 w-72"/>
            </NavbarBrand>
            <Nav className="flex flex-wrap justify-between font-medium text-2xl items-center w-full mx-8">
                <NavItem>
                    <a href="#aboutus">About Us</a>
                </NavItem>
                <NavItem>
                    <a href="#ourapproach">Our Approach</a>
                </NavItem>
                <NavItem>
                    <a href="#whyus">Why Us</a>
                </NavItem>
                <NavItem>
                <a href="#ourmethod">Our Method</a>
                </NavItem>
                <NavLink to="/login">
                    <img src={user} alt="" className="h-16 border-1 p-1 border-black rounded-full" />
                </NavLink>
            </Nav>
        </Navbar>
    );
}