import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Shoes from "../Shoes";
import { renderShoes } from "./Shoes.test.helpers";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 2 - Skostorlekar:
1. Användaren ska kunna ange skostorlek för varje spelare
3. Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen
*/

describe("Shoes - Lägga till och ange skostorlekar", () => {
  // Acceptanskriterium 1: Användaren ska kunna ange skostorlek för varje spelare
  it("ska kunna lägga till ett skofält för en spelare", async () => {
    const user = userEvent.setup();
    const mockAddShoe = vi.fn();
    renderShoes({ addShoe: mockAddShoe });

    await user.click(screen.getByText("+"));
    expect(mockAddShoe).toHaveBeenCalled();
  });

  // Acceptanskriterium 1: Användaren ska kunna ange skostorlek för varje spelare
  it("ska kunna ange skostorlek för en spelare", async () => {
    const user = userEvent.setup();
    const mockUpdateSize = vi.fn();
    renderShoes({ updateSize: mockUpdateSize, shoes: [{ id: "1", size: "" }] });

    await user.type(screen.getByLabelText("Shoe size / person 1"), "42");
    expect(mockUpdateSize).toHaveBeenCalled();
  });

  // Acceptanskriterium 3: Det ska vara möjligt att välja skostorlek för alla spelare
  it("ska kunna lägga till skofält för flera spelare", async () => {
    const user = userEvent.setup();
    const mockAddShoe = vi.fn();
    renderShoes({ addShoe: mockAddShoe });

    const addButton = screen.getByText("+");
    for (let i = 0; i < 4; i++) {
      await user.click(addButton);
    }

    expect(mockAddShoe).toHaveBeenCalledTimes(4);
  });

  // Acceptanskriterium 3: Det ska vara möjligt att välja skostorlek för alla spelare
  it("ska visa skofält för alla spelare i bokningen", () => {
    const shoes = [
      { id: "1", size: "38" },
      { id: "2", size: "40" },
      { id: "3", size: "42" },
      { id: "4", size: "44" },
    ];
    renderShoes({ shoes });

    expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 4")).toBeInTheDocument();
  });

  // Acceptanskriterium 3: Det ska vara möjligt att välja skostorlek för alla spelare
  it("ska kunna ange olika skostorlekar för olika spelare", async () => {
    const user = userEvent.setup();
    const mockUpdateSize = vi.fn();
    const shoes = [
      { id: "1", size: "" },
      { id: "2", size: "" },
      { id: "3", size: "" },
    ];
    renderShoes({ updateSize: mockUpdateSize, shoes });

    await user.type(screen.getByLabelText("Shoe size / person 1"), "38");
    await user.type(screen.getByLabelText("Shoe size / person 2"), "42");
    await user.type(screen.getByLabelText("Shoe size / person 3"), "45");

    expect(mockUpdateSize).toHaveBeenCalled();
  });

  // Acceptanskriterium 3: Det ska vara möjligt att välja skostorlek för alla spelare
  it("ska visa rätt antal skofält baserat på antal skor i bokningen", () => {
    const shoes = [
      { id: "1", size: "" },
      { id: "2", size: "" },
    ];
    const { rerender } = renderShoes({ shoes });

    expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();

    const moreShoes = [
      { id: "1", size: "" },
      { id: "2", size: "" },
      { id: "3", size: "" },
    ];
    rerender(
      <Shoes
        updateSize={vi.fn()}
        addShoe={vi.fn()}
        removeShoe={vi.fn()}
        shoes={moreShoes}
      />
    );

    expect(screen.getByLabelText("Shoe size / person 3")).toBeInTheDocument();
  });
});
