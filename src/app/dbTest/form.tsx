"use client";
import { Accordion, AccordionItem } from "react-bootstrap";
import { DbUsers } from "./dbUsers";
import { DbAuth } from "./bdAuth";
import "./form.css";

export const DbTestForm: React.FC = () => {
  return (
    <form>
      <Accordion>
        <AccordionItem eventKey="users">
          <Accordion.Header>Users</Accordion.Header>
          <Accordion.Body >
            <DbUsers />
          </Accordion.Body>
        </AccordionItem>
      </Accordion>
      <Accordion>
        <AccordionItem eventKey="auth">
          <Accordion.Header>Auth</Accordion.Header>
          <Accordion.Body >
            <DbAuth />
          </Accordion.Body>
        </AccordionItem>
      </Accordion>
    </form>
  );
};
