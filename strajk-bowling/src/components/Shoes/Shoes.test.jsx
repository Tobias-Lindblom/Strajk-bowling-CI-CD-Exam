import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Shoes from "./Shoes";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 2 - Skostorlekar:
1. Användaren ska kunna ange skostorlek för varje spelare
2. Användaren ska kunna ändra skostorlek för varje spelare
3. Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen
6. Systemet ska visa en översikt där användaren kan kontrollera de valda skostorlekarna

User Story 3 - Ta bort skostorlek:
1. Användaren ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på en "-"-knapp vid varje spelare
2. När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen så att inga skor längre är bokade för den spelaren
3. Om användaren tar bort skostorleken ska systemet inte inkludera den spelaren i skorantalet och priset för skor i den totala bokningssumman
*/

// Helper function för att rendera Shoes-komponenten
const renderShoes = (props = {}) => {
  const defaultProps = {
    updateSize: vi.fn(),
    addShoe: vi.fn(),
    removeShoe: vi.fn(),
    shoes: [],
  };
  return render(<Shoes {...defaultProps} {...props} />);
};

describe("Shoes - User Story 2: Välj skostorlek för varje spelare", () => {
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

  // Acceptanskriterium 2: Användaren ska kunna ändra skostorlek för varje spelare
  it("ska kunna ändra skostorlek för en spelare", async () => {
    const user = userEvent.setup();
    const mockUpdateSize = vi.fn();
    renderShoes({ updateSize: mockUpdateSize, shoes: [{ id: "1", size: "" }] });

    const input = screen.getByLabelText("Shoe size / person 1");
    await user.type(input, "40");
    expect(mockUpdateSize).toHaveBeenCalled();

    await user.clear(input);
    await user.type(input, "42");
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

describe("Shoes - User Story 3: Ta bort skostorlek", () => {
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
