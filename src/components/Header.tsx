import React from 'react';

interface HeaderProps {
  // Keeping the interface for compatibility, but removing the props we don't need
}

export const Header: React.FC<HeaderProps> = () => {
  // No mobile menu or state needed in this simplified version

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10 h-16">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-bold text-blue-600">Historical Data</h1>
        </div>

        {/* <div className="hidden md:flex items-center space-x-6">
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a 
                  href="#" 
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors"
                >
                  Transactions
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors"
                >
                  Accounts
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors"
                >
                  Explorer
                </a>
              </li>
            </ul>
          </nav>
        </div> */}

        {/* Dark mode toggle removed as it doesn't work accurately */}
      </div>
    </header>
  );
};