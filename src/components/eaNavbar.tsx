"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Container, Nav, Navbar } from "react-bootstrap"
import './navlink.css'

export default function EaNavbar() {
  
  const pathname = usePathname();  

  return (
    <Navbar bg="primary" variant="dark" sticky="top" expand="sm" collapseOnSelect>
      <Container fluid>
        <Navbar.Brand as={Link} href="/">
          BT DB
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="justify-content-center" style={{ flex: 1}}>
            <Nav.Link as={Link} href='/hello' active={pathname === '/hello'}>Hello</Nav.Link>
            <Nav.Link as={Link} href='/results' active={pathname === '/results'}>Results</Nav.Link>
            <Nav.Link as={Link} href='/upcoming' active={pathname === '/upcoming'}>Upcoming</Nav.Link>
            <Nav.Link as={Link} href='/contact' active={pathname === '/contact'}>Contact</Nav.Link>
            <Nav.Link as={Link} href='/signin' active={pathname === '/signin'}>Log In</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}