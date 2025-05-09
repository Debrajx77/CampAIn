import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full bg-neutral-900 text-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={handleToggle}
              className="text-white focus:outline-none lg:hidden"
            >
              {isOpen ? <Close /> : <Menu />}
            </button>
          </div>

          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-semibold text-purple-400">CampAIgn</h1>
          </div>

          <div className="hidden lg:flex space-x-6 items-center">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 hover:text-purple-400"
            >
              <Home fontSize="small" /> Dashboard
            </Link>
            <Link
              to="/analytics"
              className="flex items-center gap-2 hover:text-purple-400"
            >
              <BarChart fontSize="small" /> Analytics
            </Link>
            <Link
              to="/email-campaign"
              className="flex items-center gap-2 hover:text-purple-400"
            >
              <Email fontSize="small" /> Email
            </Link>
            <Link
              to="/calendar"
              className="flex items-center gap-2 hover:text-purple-400"
            >
              <CalendarToday fontSize="small" /> Calendar
            </Link>
            <Link
              to="/budget-management"
              className="flex items-center gap-2 hover:text-purple-400"
            >
              <AccountBalanceWallet fontSize="small" /> Budget
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-neutral-800 px-4 pb-4">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                to="/dashboard"
                onClick={handleToggle}
                className="flex items-center gap-2 hover:text-purple-400"
              >
                <Home fontSize="small" /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                onClick={handleToggle}
                className="flex items-center gap-2 hover:text-purple-400"
              >
                <BarChart fontSize="small" /> Analytics
              </Link>
            </li>
            <li>
              <Link
                to="/email-campaign"
                onClick={handleToggle}
                className="flex items-center gap-2 hover:text-purple-400"
              >
                <Email fontSize="small" /> Email
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                onClick={handleToggle}
                className="flex items-center gap-2 hover:text-purple-400"
              >
                <CalendarToday fontSize="small" /> Calendar
              </Link>
            </li>
            <li>
              <Link
                to="/budget-management"
                onClick={handleToggle}
                className="flex items-center gap-2 hover:text-purple-400"
              >
                <AccountBalanceWallet fontSize="small" /> Budget
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
