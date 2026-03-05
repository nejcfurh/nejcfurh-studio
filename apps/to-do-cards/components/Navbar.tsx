import { logoutAction } from '@/lib/actions/auth';
import { Home, Info, LogOut, Megaphone, UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>
        <Link className="logo-link" href="/todos">
          <Image
            src="/photos/LogoDark.png"
            alt="ToDoCards Logo"
            width={230}
            height={95}
            style={{ maxHeight: '95px', width: 'auto' }}
            priority
          />
        </Link>
      </h1>
      <div className="navbar-links">
        <Link href="/todos" className="navbar-link">
          <Home className="header-icon" />
          <div className="navbar-link-title">Home</div>
        </Link>
        <Link href="/account" className="navbar-link">
          <UserCircle className="header-icon" />
          <div className="navbar-link-title">Account</div>
        </Link>
        <Link href="/about" className="navbar-link">
          <Info className="header-icon" />
          <div className="navbar-link-title">About</div>
        </Link>
        <Link href="/contact" className="navbar-link">
          <Megaphone className="header-icon" />
          <div className="navbar-link-title">Contact</div>
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="navbar-link">
            <LogOut className="header-icon" />
            <div className="navbar-link-title">Logout</div>
          </button>
        </form>
      </div>
    </nav>
  );
}
