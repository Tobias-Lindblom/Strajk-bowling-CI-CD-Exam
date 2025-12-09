import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderBookingInfo } from "./BookingInfo.test.helpers";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 1 - Bokningsfunktionalitet:
1. Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem
2. Användaren ska kunna ange antal spelare (minst 1 spelare)
3. Användaren ska kunna reservera ett eller flera banor beroende på antal spelare
*/

describe("BookingInfo - Formulärfält", () => {
  // Acceptanskriterium 1: Användaren ska kunna välja ett datum och en tid
  it("ska rendera datumväljare", () => {
    renderBookingInfo();

    const dateInput = screen.getByLabelText("Date");
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute("type", "date");
  });

  // Acceptanskriterium 1: Användaren ska kunna välja ett datum och en tid
  it("ska rendera tidväljare", () => {
    renderBookingInfo();

    const timeInput = screen.getByLabelText("Time");
    expect(timeInput).toBeInTheDocument();
    expect(timeInput).toHaveAttribute("type", "time");
  });

  // Acceptanskriterium 2: Användaren ska kunna ange antal spelare
  it("ska rendera fält för antal spelare", () => {
    renderBookingInfo();

    const peopleInput = screen.getByLabelText("Number of awesome bowlers");
    expect(peopleInput).toBeInTheDocument();
    expect(peopleInput).toHaveAttribute("type", "number");
  });

  // Acceptanskriterium 3: Användaren ska kunna reservera ett eller flera banor
  it("ska rendera fält för antal banor", () => {
    renderBookingInfo();

    const lanesInput = screen.getByLabelText("Number of lanes");
    expect(lanesInput).toBeInTheDocument();
    expect(lanesInput).toHaveAttribute("type", "number");
  });
});
