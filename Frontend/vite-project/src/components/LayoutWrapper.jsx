import React from "react";

const LayoutWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white pt-[4rem] px-4">
      {children}
    </div>
  );
};

export default LayoutWrapper;
