"use client";
import { Accordion, AccordionItem } from "react-bootstrap";
import { DbUsers } from "./dbUsers";
import { DbAuth } from "./bdAuth";
import { DbBowls } from "./dbBowls";
import { DbTmnts } from "./dbTmnt";
import { DbEvents } from "./dbEvents";
import { DbDivs } from "./dbDivs";
import { DbSquads } from "./dbSquads";
import { DbLanes } from "./dbLanes";
import { DbPots } from "./dbPots";

import "./form.css";

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
      <Accordion>
        <AccordionItem eventKey="squads">
          <Accordion.Header>Squads</Accordion.Header>
          <Accordion.Body >
            <DbSquads />
          </Accordion.Body>
        </AccordionItem>
      </Accordion>
      <Accordion>
        <AccordionItem eventKey="lanes">
          <Accordion.Header>Lanes</Accordion.Header>
          <Accordion.Body >
            <DbLanes />
          </Accordion.Body>
        </AccordionItem>
      </Accordion>
      <Accordion>
        <AccordionItem eventKey="pots">
          <Accordion.Header>Pots</Accordion.Header>
          <Accordion.Body >
            <DbPots />
          </Accordion.Body>
        </AccordionItem>
      </Accordion>
    </form>
  );
};
