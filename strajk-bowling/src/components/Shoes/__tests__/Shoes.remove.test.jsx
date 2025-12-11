import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderShoes } from "./Shoes.test.helpers";

/*
Acceptanskriterier som testas:

User Story 3 - Ta bort skostorlek:
1. Användaren ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på en "-"-knapp vid varje spelare
2. När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen så att inga skor längre är bokade för den spelaren
3. Om användaren tar bort skostorleken ska systemet inte inkludera den spelaren i skorantalet och priset för skor i den totala bokningssumman
*/

// Helper för att sätta upp user
const setupUser = () => userEvent.setup();

describe("Shoes - Ta bort skostorlek", () => {
  // Acceptanskriterium 1 & 2: Ta bort fält med "-"-knapp och uppdatera bokningen
  it("ska kunna ta bort skostorlek med '-'-knapp och anropa removeShoe korrekt", async () => {
    const user = setupUser();
    const mockRemoveShoe = vi.fn();
    const shoes = [
      { id: "abc-1", size: "38" },
      { id: "abc-2", size: "40" },
      { id: "abc-3", size: "42" },
    ];
    renderShoes({ removeShoe: mockRemoveShoe, shoes });

    // Verifiera att '-'-knappar finns
    const removeButtons = screen.getAllByText("-");
    expect(removeButtons).toHaveLength(3);

    // Ta bort andra spelaren
    await user.click(removeButtons[1]);
    expect(mockRemoveShoe).toHaveBeenCalledWith("abc-2");

    // Ta bort första spelaren
    mockRemoveShoe.mockClear();
    await user.click(removeButtons[0]);
    expect(mockRemoveShoe).toHaveBeenCalledWith("abc-1");
  });
});
