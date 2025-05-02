import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BarChart,
  Email,
  CalendarToday,
  AccountBalanceWallet,
} from "@mui/icons-material";

const Navigation = () => {
  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          <Link to="/" className="hover:text-gray-300 transition duration-300">
            CampAIgn
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6 items-center">
          <li className="group">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 hover:text-gray-300 transition duration-300"
            >
              <Home className="text-lg group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
          </li>
          <li className="group">
            <Link
              to="/analytics"
              className="flex items-center space-x-2 hover:text-gray-300 transition duration-300"
            >
              <BarChart className="text-lg group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden md:inline">Analytics</span>
            </Link>
          </li>
          <li className="group">
            <Link
              to="/email-campaign"
              className="flex items-center space-x-2 hover:text-gray-300 transition duration-300"
            >
              <Email className="text-lg group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden md:inline">Email Campaign</span>
            </Link>
          </li>
          <li className="group">
            <Link
              to="/calendar"
              className="flex items-center space-x-2 hover:text-gray-300 transition duration-300"
            >
              <CalendarToday className="text-lg group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden md:inline">Calendar</span>
            </Link>
          </li>
          <li className="group">
            <Link
              to="/budget-management"
              className="flex items-center space-x-2 hover:text-gray-300 transition duration-300"
            >
              <AccountBalanceWallet className="text-lg group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden md:inline">Budget</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
