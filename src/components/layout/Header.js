import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path) => {
    return router.pathname === path ? 'text-accent-dark font-semibold' : '';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container-wide py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-accent-dark hover:text-accent no-underline">
            H3 with Laura
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-accent focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" isActive={isActive} />
            <NavLink href="/recipes" label="Recipes" isActive={isActive} />
            <NavLink href="/topics" label="Topics" isActive={isActive} />
            <NavLink href="/recommended-items" label="Recommended" isActive={isActive} />
            <NavLink href="/about" label="About" isActive={isActive} />
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 pt-4 border-t border-gray-200 md:hidden">
            <ul className="space-y-4">
              <MobileNavLink href="/" label="Home" onClick={toggleMenu} />
              <MobileNavLink href="/recipes" label="Recipes" onClick={toggleMenu} />
              <MobileNavLink href="/topics" label="Topics" onClick={toggleMenu} />
              <MobileNavLink href="/recommended-items" label="Recommended" onClick={toggleMenu} />
              <MobileNavLink href="/about" label="About" onClick={toggleMenu} />
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, label, isActive }) {
  return (
    <Link href={href} className={`text-lg hover:text-accent-dark transition-colors ${isActive(href)}`}>
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, onClick }) {
  return (
    <li>
      <Link href={href} className="block py-2 text-lg" onClick={onClick}>
        {label}
      </Link>
    </li>
  );
} 