import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderShoes } from "./Shoes.test.helpers";

/*
Acceptanskriterier som testas:

User Story 2 - Skostorlekar:
2. Användaren ska kunna ändra skostorlek för varje spelare
6. Systemet ska visa en översikt där användaren kan kontrollera de valda skostorlekarna
*/

// Helper för att sätta upp user
const setupUser = () => userEvent.setup();

describe("Shoes - Ändra och visa skostorlekar", () => {
  // Acceptanskriterium 2: Användaren ska kunna ändra skostorlek för varje spelare
  it("ska kunna ändra skostorlek för en spelare", async () => {
    const user = setupUser();
    const mockUpdateSize = vi.fn();
    renderShoes({ updateSize: mockUpdateSize, shoes: [{ id: "1", size: "" }] });

    const input = screen.getByLabelText("Shoe size / person 1");
    await user.type(input, "40");
    expect(mockUpdateSize).toHaveBeenCalled();

    await user.clear(input);
    await user.type(input, "42");
    expect(mockUpdateSize).toHaveBeenCalled();
  });

  // Acceptanskriterium 6: Systemet ska visa en översikt av de valda skostorlekarna
  it("ska visa en översikt över alla skor och storlekar", () => {
    const shoes = [
      { id: "1", size: "" },
      { id: "2", size: "" },
      { id: "3", size: "" },
    ];
    renderShoes({ shoes });

    expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 3")).toBeInTheDocument();
  });
});
