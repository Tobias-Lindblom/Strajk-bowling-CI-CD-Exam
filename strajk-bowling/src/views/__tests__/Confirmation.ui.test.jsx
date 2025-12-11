import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderConfirmation } from "./Confirmation.test.helpers";

/*
Acceptanskriterier som testas:

User Story 4 - Slutföra bokning och få bekräftelse:
2. Systemet ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd
4. Den totala summan ska visas tydligt på bekräftelsesidan och inkludera en uppdelning mellan spelare och banor
*/

describe("Confirmation - UI och bokningsdetaljer", () => {
  // Acceptanskriterium 2 & 4: Visa all bokningsinformation inkl. bokningsnummer och totalsumma
  it("ska visa alla bokningsdetaljer (datum, tid, personer, banor, bokningsnummer, totalsumma)", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 5,
      lanes: 2,
      bookingId: "STR3333",
      price: 800,
    };

    renderConfirmation(confirmationDetails);

    // Datum och tid
    expect(screen.getByDisplayValue("2023-12-25 18:00")).toBeInTheDocument();
    expect(screen.getByText("When")).toBeInTheDocument();

    // Personer och banor
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    expect(screen.getByText("Who")).toBeInTheDocument();
    expect(screen.getByText("Lanes")).toBeInTheDocument();

    // Bokningsnummer
    expect(screen.getByDisplayValue("STR3333")).toBeInTheDocument();
    expect(screen.getByText("Booking number")).toBeInTheDocument();

    // Totalsumma
    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("800 sek")).toBeInTheDocument();
  });
});
