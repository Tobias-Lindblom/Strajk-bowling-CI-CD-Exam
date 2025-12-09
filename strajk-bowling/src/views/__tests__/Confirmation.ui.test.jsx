import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderConfirmation } from "./Confirmation.test.helpers";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 4 - Slutföra bokning och få bekräftelse:
4. Den totala summan ska visas tydligt på bekräftelsesidan och inkludera en uppdelning mellan spelare och banor
*/

describe("Confirmation - UI och layout", () => {
  // Acceptanskriterium 4: Totalsumman ska visas tydligt
  it("ska visa 'Total:' label tydligt på bekräftelsesidan", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 3,
      lanes: 1,
      bookingId: "STR2222",
      price: 460,
    };

    renderConfirmation(confirmationDetails);

    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("460 sek")).toBeInTheDocument();
  });

  // Acceptanskriterium 2 & 4: Visa all bokningsinformation
  it("ska visa alla bokningsdetaljer (datum, tid, personer, banor, bokningsnummer)", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 5,
      lanes: 2,
      bookingId: "STR3333",
      price: 800,
    };

    renderConfirmation(confirmationDetails);

    expect(screen.getByDisplayValue("2023-12-25 18:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("STR3333")).toBeInTheDocument();
    expect(screen.getByText("800 sek")).toBeInTheDocument();
  });

  it("ska visa datum och tid korrekt formaterat", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 4,
      lanes: 1,
      bookingId: "STR1234",
      price: 580,
    };

    renderConfirmation(confirmationDetails);

    expect(screen.getByDisplayValue("2023-12-25 18:00")).toBeInTheDocument();
    expect(screen.getByText("When")).toBeInTheDocument();
  });

  it("ska visa antal personer och banor", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 4,
      lanes: 1,
      bookingId: "STR1234",
      price: 580,
    };

    renderConfirmation(confirmationDetails);

    expect(screen.getByDisplayValue("4")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByText("Who")).toBeInTheDocument();
    expect(screen.getByText("Lanes")).toBeInTheDocument();
  });
});
