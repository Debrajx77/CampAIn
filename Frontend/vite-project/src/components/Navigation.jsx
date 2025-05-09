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
    <nav className="fixed top-0 w-full z-50 bg-neutral-900 shadow-md">
      <button className="hamburger-icon" onClick={handleToggle}>
        {isOpen ? <Close /> : <Menu />}
      </button>
      <ul className={isOpen ? "open" : ""}>
        <li>
          <Link to="/dashboard">
            <Home />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/analytics">
            <BarChart />
            Analytics
          </Link>
        </li>
        <li>
          <Link to="/email-campaign">
            <Email />
            Email
          </Link>
        </li>
        <li>
          <Link to="/calendar">
            <CalendarToday />
            Calendar
          </Link>
        </li>
        <li>
          <Link to="/budget-management">
            <AccountBalanceWallet />
            Budget
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
