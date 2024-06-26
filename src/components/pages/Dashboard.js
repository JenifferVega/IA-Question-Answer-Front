import React, { useEffect, useRef } from 'react';
import '../../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTachometerAlt, faAddressBook, faClone, faCalendarAlt, faChartBar, faCopy } from '@fortawesome/free-solid-svg-icons';


const Dashboard = () => {
  const navbarRef = useRef(null);
  const horiSelectorRef = useRef(null);

  useEffect(() => {
    const test = () => {
      const tabsNewAnim = navbarRef.current;
      const activeItemNewAnim = tabsNewAnim.querySelector('.active');
      const activeWidthNewAnimHeight = activeItemNewAnim?.offsetHeight;
      const activeWidthNewAnimWidth = activeItemNewAnim?.offsetWidth;
      const itemPosNewAnimTop = activeItemNewAnim?.offsetTop;
      const itemPosNewAnimLeft = activeItemNewAnim?.offsetLeft;
      horiSelectorRef.current.style.top = itemPosNewAnimTop + "px";
      horiSelectorRef.current.style.left = itemPosNewAnimLeft + "px";
      horiSelectorRef.current.style.height = activeWidthNewAnimHeight + "px";
      horiSelectorRef.current.style.width = activeWidthNewAnimWidth + "px";
    };

    const handleResize = () => {
      setTimeout(test, 500);
    };

    const handleNavItemClick = (e) => {
      const navItems = navbarRef.current.querySelectorAll('li');
      navItems.forEach(item => item.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const activeWidthNewAnimHeight = e.currentTarget.offsetHeight;
      const activeWidthNewAnimWidth = e.currentTarget.offsetWidth;
      const itemPosNewAnimTop = e.currentTarget.offsetTop;
      const itemPosNewAnimLeft = e.currentTarget.offsetLeft;
      horiSelectorRef.current.style.top = itemPosNewAnimTop + "px";
      horiSelectorRef.current.style.left = itemPosNewAnimLeft + "px";
      horiSelectorRef.current.style.height = activeWidthNewAnimHeight + "px";
      horiSelectorRef.current.style.width = activeWidthNewAnimWidth + "px";
    };

    const navItems = navbarRef.current.querySelectorAll('li');
    navItems.forEach(item => item.addEventListener('click', handleNavItemClick));

    test();
    window.addEventListener('resize', handleResize);
    document.querySelector('.navbar-toggler').addEventListener('click', () => {
      document.querySelector('.navbar-collapse').classList.toggle('show');
      setTimeout(test, 300);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      navItems.forEach(item => item.removeEventListener('click', handleNavItemClick));
    };
  }, []);

  useEffect(() => {
    const path = window.location.pathname.split("/").pop() || 'index.html';
    const target = navbarRef.current.querySelector(`ul li a[href="${path}"]`);
    if (target) {
      target.parentElement.classList.add('active');
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-custom navbar-mainbg">
      <a className="navbar-brand navbar-logo" href="#">Navbar</a>
      <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <FontAwesomeIcon icon={faBars} className="text-white" />
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent" ref={navbarRef}>
        <ul className="navbar-nav ml-auto">
          <div className="hori-selector" ref={horiSelectorRef}><div className="left"></div><div className="right"></div></div>
          <li className="nav-item">
            <a className="nav-link" href="#"><FontAwesomeIcon icon={faTachometerAlt} />Dashboard</a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="#"><FontAwesomeIcon icon={faAddressBook} />Address Book</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"><FontAwesomeIcon icon={faClone} />Components</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"><FontAwesomeIcon icon={faCalendarAlt} />Calendar</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"><FontAwesomeIcon icon={faChartBar} />Charts</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#"><FontAwesomeIcon icon={faCopy} />Documents</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Dashboard;
