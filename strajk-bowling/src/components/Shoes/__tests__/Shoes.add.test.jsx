import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderShoes } from "./Shoes.test.helpers";

/*
Acceptanskriterier som testas:

User Story 2 - Skostorlekar:
1. Användaren ska kunna ange skostorlek för varje spelare
3. Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen
*/

// Helper för att sätta upp user
const setupUser = () => userEvent.setup();

describe("Shoes - Lägga till och ange skostorlekar", () => {
  // Acceptanskriterium 1: Användaren ska kunna ange skostorlek för varje spelare
  it("ska kunna lägga till ett skofält för en spelare", async () => {
    const user = setupUser();
    const mockAddShoe = vi.fn();
    renderShoes({ addShoe: mockAddShoe });

    await user.click(screen.getByText("+"));
    expect(mockAddShoe).toHaveBeenCalled();
  });

  // Acceptanskriterium 1: Användaren ska kunna ange skostorlek för varje spelare
  it("ska kunna ange skostorlek för en spelare", async () => {
    const user = setupUser();
    const mockUpdateSize = vi.fn();
    renderShoes({ updateSize: mockUpdateSize, shoes: [{ id: "1", size: "" }] });

    await user.type(screen.getByLabelText("Shoe size / person 1"), "42");
    expect(mockUpdateSize).toHaveBeenCalled();
  });

  // Acceptanskriterium 3: Det ska vara möjligt att välja skostorlek för alla spelare
  it("ska kunna lägga till och ange skostorlekar för flera spelare", async () => {
    const user = setupUser();
    const mockAddShoe = vi.fn();
    const mockUpdateSize = vi.fn();
    const shoes = [
      { id: "1", size: "" },
      { id: "2", size: "" },
      { id: "3", size: "" },
    ];
    renderShoes({ addShoe: mockAddShoe, updateSize: mockUpdateSize, shoes });

    // Verifiera att alla skofält visas
    expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 3")).toBeInTheDocument();

    // Verifiera att man kan ange olika storlekar
    await user.type(screen.getByLabelText("Shoe size / person 1"), "38");
    await user.type(screen.getByLabelText("Shoe size / person 2"), "42");
    await user.type(screen.getByLabelText("Shoe size / person 3"), "45");

    expect(mockUpdateSize).toHaveBeenCalled();

    // Verifiera att man kan lägga till fler
    const addButton = screen.getByText("+");
    await user.click(addButton);
    expect(mockAddShoe).toHaveBeenCalled();
  });
});
