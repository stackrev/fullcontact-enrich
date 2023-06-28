import Link from 'next/link';

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link href="/">
              <a className="nav-link">Monitor</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/clients">
              <a className="nav-link">Clients</a>
            </Link>
          </li>
        </ul>
      </nav>

      <style jsx>{`
        header {
          background-color: #f2f2f2;
          padding: 10px;
        }

        .navbar {
          display: flex;
          justify-content: center;
        }

        .nav-list {
          list-style-type: none;
          display: flex;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          margin: 0 10px;
        }

        .nav-link {
          color: #333;
          text-decoration: none;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
