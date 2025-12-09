import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Shoes from "../Shoes";
import { renderShoes } from "./Shoes.test.helpers";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 3 - Ta bort skostorlek:
1. Användaren ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på en "-"-knapp vid varje spelare
2. När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen så att inga skor längre är bokade för den spelaren
3. Om användaren tar bort skostorleken ska systemet inte inkludera den spelaren i skorantalet och priset för skor i den totala bokningssumman
*/

describe("Shoes - Ta bort skostorlek", () => {
  // Acceptanskriterium 1: Användaren ska kunna ta bort fält genom att klicka på "-"-knapp
  it("ska visa en '-'-knapp för varje spelare", () => {
    const shoes = [
      { id: "1", size: "40" },
      { id: "2", size: "42" },
      { id: "3", size: "44" },
    ];
    renderShoes({ shoes });

    expect(screen.getAllByText("-")).toHaveLength(3);
  });

  // Acceptanskriterium 1: Användaren ska kunna ta bort fält genom att klicka på "-"-knapp
  it("ska anropa removeShoe när användaren klickar på '-'-knappen", async () => {
    const user = userEvent.setup();
    const mockRemoveShoe = vi.fn();
    const shoes = [
      { id: "1", size: "40" },
      { id: "2", size: "42" },
    ];
    renderShoes({ removeShoe: mockRemoveShoe, shoes });

    await user.click(screen.getAllByText("-")[1]);
    expect(mockRemoveShoe).toHaveBeenCalledWith("2");
  });

  // Acceptanskriterium 2: Systemet ska uppdatera bokningen när skostorlek tas bort
  it("ska ta bort rätt spelare när användaren klickar på specifik '-'-knapp", async () => {
    const user = userEvent.setup();
    const mockRemoveShoe = vi.fn();
    const shoes = [
      { id: "abc-1", size: "38" },
      { id: "abc-2", size: "40" },
      { id: "abc-3", size: "42" },
    ];
    renderShoes({ removeShoe: mockRemoveShoe, shoes });

    const removeButtons = screen.getAllByText("-");
    await user.click(removeButtons[1]);
    expect(mockRemoveShoe).toHaveBeenCalledWith("abc-2");

    mockRemoveShoe.mockClear();
    await user.click(removeButtons[0]);
    expect(mockRemoveShoe).toHaveBeenCalledWith("abc-1");
  });

  // Acceptanskriterium 2: Systemet ska uppdatera bokningen
  it("ska minska antalet skofält när en spelare tas bort", () => {
    const shoes = [
      { id: "1", size: "40" },
      { id: "2", size: "42" },
      { id: "3", size: "44" },
    ];
    const { rerender } = renderShoes({ shoes });

    expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 3")).toBeInTheDocument();

    const updatedShoes = [
      { id: "1", size: "40" },
      { id: "3", size: "44" },
    ];
    rerender(
      <Shoes
        updateSize={vi.fn()}
        addShoe={vi.fn()}
        removeShoe={vi.fn()}
        shoes={updatedShoes}
      />
    );

    expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Shoe size / person 3")
    ).not.toBeInTheDocument();
  });
});
