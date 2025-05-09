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
    <nav className="fixed top-0 w-full z-50 bg-neutral-900 text-white shadow-md px-4 py-3">
      <div className="flex justify-between items-center">
        <button className="md:hidden text-white" onClick={handleToggle}>
          {isOpen ? <Close /> : <Menu />}
        </button>
        <ul
          className={`${
            isOpen ? "flex" : "hidden"
          } flex-col md:flex md:flex-row gap-6 items-center md:gap-8 md:items-center w-full md:w-auto md:static absolute top-full left-0 bg-neutral-900 md:bg-transparent px-4 py-2 md:p-0`}
        >
          <li>
            <Link
              to="/dashboard"
              className="flex items-center gap-1 hover:text-blue-400"
            >
              <Home /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/analytics"
              className="flex items-center gap-1 hover:text-blue-400"
            >
              <BarChart /> Analytics
            </Link>
          </li>
          <li>
            <Link
              to="/email-campaign"
              className="flex items-center gap-1 hover:text-blue-400"
            >
              <Email /> Email
            </Link>
          </li>
          <li>
            <Link
              to="/calendar"
              className="flex items-center gap-1 hover:text-blue-400"
            >
              <CalendarToday /> Calendar
            </Link>
          </li>
          <li>
            <Link
              to="/budget-management"
              className="flex items-center gap-1 hover:text-blue-400"
            >
              <AccountBalanceWallet /> Budget
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
