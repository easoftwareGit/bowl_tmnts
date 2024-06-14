"use client";
import { Accordion, AccordionItem } from "react-bootstrap";
import { DbUsers } from "./dbUsers";
import { DbAuth } from "./bdAuth";
import { DbBowls } from "./dbBowls";
import { DbTmnts } from "./dbTmnt";
import { DbEvents } from "./dbEvents";

import "./form.css";
import { DbDivs } from "./dbDiv";

// need to also test all functions in path src/db/*.*

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
      <Accordion>
        <AccordionItem eventKey="bowls">
          <Accordion.Header>Bowls</Accordion.Header>
          <Accordion.Body >
            <DbBowls />
          </Accordion.Body>
        </AccordionItem>
      </Accordion>
      <Accordion>
        <AccordionItem eventKey="tmnts">
          <Accordion.Header>Tmnts</Accordion.Header>
          <Accordion.Body >
            <DbTmnts />
          </Accordion.Body>
        </AccordionItem>
      </Accordion>
      <Accordion>
        <AccordionItem eventKey="events">
          <Accordion.Header>Events</Accordion.Header>
          <Accordion.Body >
            <DbEvents />
          </Accordion.Body>
        </AccordionItem>
      </Accordion>
      <Accordion>
        <AccordionItem eventKey="divs">
          <Accordion.Header>Divs</Accordion.Header>
          <Accordion.Body >
            <DbDivs />
          </Accordion.Body>
        </AccordionItem>
      </Accordion>
    </form>
  );
};
