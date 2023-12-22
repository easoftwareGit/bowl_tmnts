"use client"

import Nav from "react-bootstrap/Nav";
import { usePathname } from "next/navigation"
import './navpills.css'

export default function EaNavbarPills() {

  const pathname = usePathname();

  return (
    <Nav className="justify-content-center" variant='pills' defaultActiveKey='/'>
      <Nav.Item>
        <Nav.Link href="/" active={pathname === '/'}>Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/hello" active={pathname === '/hello'}>Hello</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/results" active={pathname === '/results'}>Results</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/upcoming" active={pathname === '/upcoming'}>Upcoming</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/contact" active={pathname === '/contact'}>Contact</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/signin" active={pathname === '/signin'}>Sign In</Nav.Link>
      </Nav.Item>
    </Nav>
  )
}