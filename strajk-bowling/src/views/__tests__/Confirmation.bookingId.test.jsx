import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderConfirmation } from "./Confirmation.test.helpers";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 4 - Slutföra bokning och få bekräftelse:
2. Systemet ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd
*/

describe("Confirmation - Bokningsnummer", () => {
  // Acceptanskriterium 2: Systemet ska generera och visa bokningsnummer
  it("ska visa bokningsnummer efter slutförd bokning", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 4,
      lanes: 1,
      bookingId: "STR1234ABCD",
      price: 580,
    };

    renderConfirmation(confirmationDetails);

    expect(screen.getByDisplayValue("STR1234ABCD")).toBeInTheDocument();
    expect(screen.getByText("Booking number")).toBeInTheDocument();
  });

  it("ska visa olika bokningsnummer för olika bokningar", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 5,
      lanes: 2,
      bookingId: "STR3333",
      price: 800,
    };

    renderConfirmation(confirmationDetails);

    expect(screen.getByDisplayValue("STR3333")).toBeInTheDocument();
  });
});
