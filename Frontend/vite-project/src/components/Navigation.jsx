import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import "./styles.css"; // Import your CSS file for custom styles
import {
  Home,
  BarChart,
  Email,
  CalendarToday,
  AccountBalanceWallet,
  Menu,
  Close,
} from "@mui/icons-material";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home />, path: "/dashboard" },
    { name: "Analytics", icon: <BarChart />, path: "/analytics" },
    { name: "Email Campaign", icon: <Email />, path: "/email-campaign" },
    { name: "Calendar", icon: <CalendarToday />, path: "/calendar" },
    {
      name: "Budget",
      icon: <AccountBalanceWallet />,
      path: "/budget-management",
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          <Link to="/" className="hover:text-gray-300 transition duration-300">
            CampAIn
          </Link>
        </div>

        {/* Hamburger Icon (Mobile Only) */}
        <div className="md:hidden">
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isOpen ? <Close fontSize="large" /> : <Menu fontSize="large" />}
          </IconButton>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          {menuItems.map(({ name, icon, path }) => (
            <li key={name} className="group">
              <Link
                to={path}
                className="flex items-center space-x-2 hover:text-gray-300 transition duration-300"
              >
                {React.cloneElement(icon, {
                  className:
                    "text-lg group-hover:scale-110 transition-transform duration-300",
                })}
                <span>{name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden px-4 pb-4 bg-black bg-opacity-90">
            <ul className="flex flex-col space-y-4">
              {menuItems.map(({ name, icon, path }) => (
                <li key={name}>
                  <Link
                    to={path}
                    className="flex items-center space-x-2 hover:text-gray-300 transition duration-300"
                  >
                    {React.cloneElement(icon, {
                      className:
                        "text-lg group-hover:scale-110 transition-transform duration-300",
                    })}
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
