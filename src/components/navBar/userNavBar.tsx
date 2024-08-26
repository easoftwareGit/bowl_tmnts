"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Nav, Navbar } from "react-bootstrap";
import NavDropdown from 'react-bootstrap/NavDropdown';

import { useState } from "react";

import "./navlink.css";

export default function UserNavBar() { 

  const pathname = usePathname();

  return (
    <Navbar bg="primary" variant="dark" sticky="top" expand="sm" collapseOnSelect>
      <Container fluid>
        <Navbar.Toggle aria-controls="user-navbar" />
        <Navbar.Collapse id="user-navbar">
          <Nav className="justify-content-center" style={{ flex: 1 }}>
            <Nav.Link
              as={Link}
              href="/dataEntry/tmnt"
              active={pathname === "/dataEntry/tmnt"}
            >
              New Tmnt
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/dataEntry/editTmnt"
              active={pathname === "/dataEntry/editTmnt"}
            >
              Edit Tmnt
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/dataEntry/entries"
              active={pathname === "/dataEntry/entries"}
            >
              Enter Players
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/dataEntry/prizeFund"
              active={pathname === "/dataEntry/prizefund"}
            >
              Prize Fund
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/reports/"
              active={pathname === "/reports/"}
            >
              Reports
            </Nav.Link>


            

            {/* <NavDropdown title="Tournaments" id="user-dropdown">
              <NavDropdown.Item
                as={Link}
                href="/dataEntry/tmnt"
                active={pathname === "/dataEntry/tmnt"}
              >
                New Tournament
              </NavDropdown.Item>
            </NavDropdown>   */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}