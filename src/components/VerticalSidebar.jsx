import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function VerticalSidebar() {
  const location = useLocation()
  const [isDocked, setIsDocked] = useState(true)

  useEffect(() => {
    // Initialize Helpers and Menu when component mounts
    if (window.Helpers && window.Menu) {
      // Initialize Helpers
      window.Helpers.init();
      
      // Get the layout menu element
      const layoutMenu = document.getElementById('layout-menu');
      
      // Initialize the Menu with proper configuration
      if (layoutMenu) {
        // Create a new Menu instance with appropriate options
        const menu = new window.Menu(layoutMenu, {
          orientation: 'vertical',
          closeChildren: true,
          showDropdownOnHover: true
        });
        
        // Store the menu instance for global access
        window.Helpers.mainMenu = menu;
        
        // Scroll to active menu item
        window.Helpers.scrollToActive();
        
        // Enable auto updates for responsive behavior
        window.Helpers.setAutoUpdate(true);
        
        // Check if there's a saved state in localStorage
        if (window.config && window.config.enableMenuLocalStorage) {
          try {
            const storedCollapsed = localStorage.getItem(`templateCustomizer-${window.templateName}--LayoutCollapsed`);
            // Update the docked state based on stored preference
            if (storedCollapsed !== null) {
              setIsDocked(storedCollapsed !== "true");
              // Apply the stored state
              window.Helpers.setCollapsed(storedCollapsed === "true", false);
            } else {
              // Set initial collapsed state for desktop (not collapsed by default)
              if (!window.Helpers.isSmallScreen()) {
                window.Helpers.setCollapsed(false, false);
              }
            }
          } catch (error) {
            console.error('Error reading from localStorage:', error);
          }
        } else {
          // Set initial collapsed state for desktop if no localStorage
          if (!window.Helpers.isSmallScreen()) {
            window.Helpers.setCollapsed(false, false);
          }
        }
        
        // Toggle menu button functionality
        document.querySelectorAll('.layout-menu-toggle').forEach(el => {
          el.addEventListener('click', e => {
            e.preventDefault();
            window.Helpers.toggleCollapsed();
            setIsDocked(!window.Helpers.isCollapsed());
          });
        });
      }
    }

    return () => {
      // Cleanup when component unmounts
      if (window.Helpers) {
        window.Helpers.setAutoUpdate(false);
      }
      
      // Destroy menu instance if exists
      const layoutMenu = document.getElementById('layout-menu');
      if (layoutMenu && layoutMenu.menuInstance) {
        layoutMenu.menuInstance.destroy();
      }
    };
  }, []);

  // Toggle sidebar docked/undocked state
  const handleDockToggle = (e) => {
    const isChecked = e.target.checked;
    setIsDocked(isChecked);
    
    if (window.Helpers) {
      window.Helpers.setCollapsed(!isChecked, true);
      
      // Save state to localStorage if enabled
      if (window.config && window.config.enableMenuLocalStorage) {
        try {
          localStorage.setItem(`templateCustomizer-${window.templateName}--LayoutCollapsed`, String(!isChecked));
          // Update data-menu-open attribute
          document.documentElement.setAttribute('data-menu-open', String(isChecked));
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      }
      
      // Trigger custom event for other components to listen
      window.dispatchEvent(new Event('layout:toggle'));
    }
  };

  // Function to handle pin icon click
  const handlePinClick = () => {
    setIsDocked(true);
    
    if (window.Helpers) {
      window.Helpers.setCollapsed(false, true);
      
      // Save state to localStorage if enabled
      if (window.config && window.config.enableMenuLocalStorage) {
        try {
          localStorage.setItem(`templateCustomizer-${window.templateName}--LayoutCollapsed`, "false");
          // Update data-menu-open attribute
          document.documentElement.setAttribute('data-menu-open', "true");
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      }
      
      // Trigger custom event for other components to listen
      window.dispatchEvent(new Event('layout:toggle'));
    }
  };

  // Function to check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo py-3 px-4">
        <Link to="/" className="app-brand-link gap-2">
          <span className="app-brand-logo demo">
            <span style={{ color: "var(--bs-primary)" }}>
              <svg width="30" height="24" viewBox="0 0 250 196" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.3002 1.25469L56.655 28.6432C59.0349 30.1128 60.4839 32.711 60.4839 35.5089V160.63C60.4839 163.468 58.9941 166.097 56.5603 167.553L12.2055 194.107C8.3836 196.395 3.43136 195.15 1.14435 191.327C0.395485 190.075 0 188.643 0 187.184V8.12039C0 3.66447 3.61061 0.0522461 8.06452 0.0522461C9.56056 0.0522461 11.0271 0.468577 12.3002 1.25469Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M237.721 1.18923L125 70.3075V136.87L250 65.2465V8.06814C250 3.61223 246.389 0 241.935 0C240.448 0 238.99 0.411583 237.721 1.18923Z" fill="currentColor" />
              </svg>
            </span>
          </span>
          <span className="app-brand-text demo menu-text fw-bold ms-2">MenuMitra</span>
        </Link>

        {/* Menu Pin Toggle (Radio style) */}
        <div className="menu-pin-toggle ms-auto me-1">
          <input 
            className="form-check-input" 
            type="checkbox" 
            id="dockMenu" 
            checked={isDocked} 
            onChange={handleDockToggle} 
            title="Pin/Unpin Menu"
          />
        </div>

        {/* Pin Icon - Only shows when hovering over collapsed menu */}
        <i 
          className="ri-pushpin-line menu-pin-icon" 
          onClick={handlePinClick}
          title="Pin Menu"
        ></i>

        <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-1" onClick={(e) => {
          e.preventDefault();
          if (window.Helpers) {
            const newState = !window.Helpers.isCollapsed();
            window.Helpers.toggleCollapsed();
            setIsDocked(!newState);
            
            // Save state to localStorage if enabled
            if (window.config && window.config.enableMenuLocalStorage) {
              try {
                localStorage.setItem(`templateCustomizer-${window.templateName}--LayoutCollapsed`, String(newState));
                // Update data-menu-open attribute
                document.documentElement.setAttribute('data-menu-open', String(!newState));
              } catch (error) {
                console.error('Error writing to localStorage:', error);
              }
            }
            
            // Trigger custom event for other components to listen
            window.dispatchEvent(new Event('layout:toggle'));
          }
        }}>
          <i className="ri-menu-fold-line align-middle"></i>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {/* Dashboard */}
        <li className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <Link to="/dashboard" className="menu-link">
            <i className="menu-icon tf-icons ri-dashboard-line"></i>
            <div data-i18n="Dashboard">Dashboard</div>
            <div className="badge bg-label-primary rounded-pill ms-auto">New</div>
          </Link>
        </li>

        {/* Analytics Header */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Analytics</span>
        </li>

        {/* Sales Analytics */}
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-line-chart-line"></i>
            <div>Sales Analytics</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/analytics/revenue" className="menu-link">
                <i className="menu-icon tf-icons ri-money-dollar-circle-line"></i>
                <div>Revenue</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/analytics/orders" className="menu-link">
                <i className="menu-icon tf-icons ri-shopping-bag-3-line"></i>
                <div>Orders</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/analytics/items" className="menu-link">
                <i className="menu-icon tf-icons ri-restaurant-2-line"></i>
                <div>Top Items</div>
              </Link>
            </li>
          </ul>
        </li>

        {/* Restaurant Management */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Restaurant</span>
        </li>

        {/* Menu Management */}
        <li className="menu-item">
          <Link to="/menu" className="menu-link">
            <i className="menu-icon tf-icons ri-book-2-line"></i>
            <div>Menu Management</div>
          </Link>
        </li>

        {/* Orders */}
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-shopping-cart-2-line"></i>
            <div>Orders</div>
            <div className="badge bg-label-danger rounded-pill ms-auto">Hot</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/orders/active" className="menu-link">
                <i className="menu-icon tf-icons ri-timer-line"></i>
                <div>Active Orders</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/orders/history" className="menu-link">
                <i className="menu-icon tf-icons ri-history-line"></i>
                <div>Order History</div>
              </Link>
            </li>
          </ul>
        </li>

        {/* Tables */}
        <li className="menu-item">
          <Link to="/tables" className="menu-link">
            <i className="menu-icon tf-icons ri-layout-grid-line"></i>
            <div>Table Management</div>
          </Link>
        </li>

        {/* Kitchen */}
        <li className="menu-item">
          <Link to="/kitchen" className="menu-link">
            <i className="menu-icon tf-icons ri-restaurant-line"></i>
            <div>Kitchen Display</div>
          </Link>
        </li>

        {/* Settings & Configuration */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Settings</span>
        </li>

        {/* Restaurant Settings */}
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons ri-settings-4-line"></i>
            <div>Settings</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <Link to="/settings/profile" className="menu-link">
                <i className="menu-icon tf-icons ri-store-2-line"></i>
                <div>Restaurant Profile</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/settings/staff" className="menu-link">
                <i className="menu-icon tf-icons ri-team-line"></i>
                <div>Staff Management</div>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/settings/payment" className="menu-link">
                <i className="menu-icon tf-icons ri-bank-card-line"></i>
                <div>Payment Methods</div>
              </Link>
            </li>
          </ul>
        </li>

        {/* Support */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Support</span>
        </li>

        {/* Help & Documentation */}
        <li className="menu-item">
          <Link to="/help" className="menu-link">
            <i className="menu-icon tf-icons ri-question-line"></i>
            <div>Help Center</div>
          </Link>
        </li>

        <li className="menu-item">
          <Link to="/support" className="menu-link">
            <i className="menu-icon tf-icons ri-customer-service-2-line"></i>
            <div>Contact Support</div>
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default VerticalSidebar 