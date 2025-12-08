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

describe("Shoes - User Story 2: Välj skostorlek för varje spelare", () => {
  // Acceptanskriterium 1: Användaren ska kunna ange skostorlek för varje spelare
  it("ska kunna lägga till ett skofält för en spelare", async () => {
    // Testar att användaren kan lägga till ett fält för att ange skostorlek
    const mockAddShoe = vi.fn();
    const user = userEvent.setup();

    render(
      <Shoes
        updateSize={() => {}}
        addShoe={mockAddShoe}
        removeShoe={() => {}}
        shoes={[]}
      />
    );

    const addButton = screen.getByText("+");
    await user.click(addButton);

    expect(mockAddShoe).toHaveBeenCalled();
  });

  // Acceptanskriterium 1: Användaren ska kunna ange skostorlek för varje spelare
  it("ska kunna ange skostorlek för en spelare", async () => {
    // Testar att användaren faktiskt kan skriva in en skostorlek
    const mockUpdateSize = vi.fn();
    const user = userEvent.setup();
    const shoes = [{ id: "1", size: "" }];

    render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={() => {}}
        removeShoe={() => {}}
        shoes={shoes}
      />
    );

    const input = screen.getByLabelText("Shoe size / person 1");
    await user.type(input, "42");

    expect(mockUpdateSize).toHaveBeenCalled();
  });

  // Acceptanskriterium 2: Användaren ska kunna ändra skostorlek för varje spelare
  it("ska kunna ändra skostorlek för en spelare", async () => {
    // Testar att användaren kan ändra en redan angiven skostorlek
    const mockUpdateSize = vi.fn();
    const user = userEvent.setup();
    const shoes = [{ id: "1", size: "" }];

    const { rerender } = render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={() => {}}
        removeShoe={() => {}}
        shoes={shoes}
      />
    );

    const input = screen.getByLabelText("Shoe size / person 1");

    // Ange initial storlek
    await user.type(input, "40");
    expect(mockUpdateSize).toHaveBeenCalled();

    // Ändra storleken (simulera att state uppdateras)
    await user.clear(input);
    await user.type(input, "42");

    expect(mockUpdateSize).toHaveBeenCalled();
  });

  // Acceptanskriterium 3: Det ska vara möjligt att välja skostorlek för alla spelare
  it("ska kunna lägga till skofält för flera spelare", async () => {
    // Testar att systemet kan hantera flera spelare
    const mockAddShoe = vi.fn();
    const user = userEvent.setup();

    render(
      <Shoes
        updateSize={() => {}}
        addShoe={mockAddShoe}
        removeShoe={() => {}}
        shoes={[]}
      />
    );

    const addButton = screen.getByText("+");

    // Lägg till 4 spelare
    await user.click(addButton);
    await user.click(addButton);
    await user.click(addButton);
    await user.click(addButton);

    expect(mockAddShoe).toHaveBeenCalledTimes(4);
  });

  // Acceptanskriterium 3: Det ska vara möjligt att välja skostorlek för alla spelare
  it("ska visa skofält för alla spelare i bokningen", () => {
    // Testar att alla spelare som ska ha skor får ett eget fält
    const shoes = [
      { id: "1", size: "38" },
      { id: "2", size: "40" },
      { id: "3", size: "42" },
      { id: "4", size: "44" },
    ];

    render(
      <Shoes
        updateSize={() => {}}
        addShoe={() => {}}
        removeShoe={() => {}}
        shoes={shoes}
      />
    );

    expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 4")).toBeInTheDocument();
  });

  // Acceptanskriterium 3: Det ska vara möjligt att välja skostorlek för alla spelare
  it("ska kunna ange olika skostorlekar för olika spelare", async () => {
    // Testar att varje spelare kan få sin egen unika skostorlek
    const mockUpdateSize = vi.fn();
    const user = userEvent.setup();
    const shoes = [
      { id: "1", size: "" },
      { id: "2", size: "" },
      { id: "3", size: "" },
    ];

    render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={() => {}}
        removeShoe={() => {}}
        shoes={shoes}
      />
    );

    const input1 = screen.getByLabelText("Shoe size / person 1");
    const input2 = screen.getByLabelText("Shoe size / person 2");
    const input3 = screen.getByLabelText("Shoe size / person 3");

    await user.type(input1, "38");
    await user.type(input2, "42");
    await user.type(input3, "45");

    expect(mockUpdateSize).toHaveBeenCalled();
  });

  // Acceptanskriterium 6: Systemet ska visa en översikt av de valda skostorlekarna
  it("ska visa en översikt över alla skor och storlekar", () => {
    // Testar att användaren kan se alla skofält före bokning
    // (Översikten består av att alla skofält visas)
    const shoes = [
      { id: "1", size: "" },
      { id: "2", size: "" },
      { id: "3", size: "" },
    ];

    render(
      <Shoes
        updateSize={() => {}}
        addShoe={() => {}}
        removeShoe={() => {}}
        shoes={shoes}
      />
    );

    // Verifiera att alla skofält visas
    const input1 = screen.getByLabelText("Shoe size / person 1");
    const input2 = screen.getByLabelText("Shoe size / person 2");
    const input3 = screen.getByLabelText("Shoe size / person 3");

    expect(input1).toBeInTheDocument();
    expect(input2).toBeInTheDocument();
    expect(input3).toBeInTheDocument();
  });

  // Acceptanskriterium 3: Det ska vara möjligt att välja skostorlek för alla spelare
  it("ska visa rätt antal skofält baserat på antal skor i bokningen", () => {
    // Testar att antalet skofält matchar antal spelare
    const shoes = [
      { id: "1", size: "" },
      { id: "2", size: "" },
    ];

    const { rerender } = render(
      <Shoes
        updateSize={() => {}}
        addShoe={() => {}}
        removeShoe={() => {}}
        shoes={shoes}
      />
    );

    expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();

    // Lägg till fler skor
    const moreShoes = [
      { id: "1", size: "" },
      { id: "2", size: "" },
      { id: "3", size: "" },
    ];

    rerender(
      <Shoes
        updateSize={() => {}}
        addShoe={() => {}}
        removeShoe={() => {}}
        shoes={moreShoes}
      />
    );

    expect(screen.getByLabelText("Shoe size / person 3")).toBeInTheDocument();
  });
});

describe("Shoes - User Story 3: Ta bort skostorlek", () => {
  // Acceptanskriterium 1: Användaren ska kunna ta bort fält genom att klicka på "-"-knapp
  it("ska visa en '-'-knapp för varje spelare", () => {
    // Testar att varje skofält har en knapp för att ta bort det
    const shoes = [
      { id: "1", size: "40" },
      { id: "2", size: "42" },
      { id: "3", size: "44" },
    ];

    render(
      <Shoes
        updateSize={() => {}}
        addShoe={() => {}}
        removeShoe={() => {}}
        shoes={shoes}
      />
    );

    const removeButtons = screen.getAllByText("-");
    expect(removeButtons).toHaveLength(3);
  });

  // Acceptanskriterium 1: Användaren ska kunna ta bort fält genom att klicka på "-"-knapp
  it("ska anropa removeShoe när användaren klickar på '-'-knappen", async () => {
    // Testar att klick på "-"-knappen faktiskt tar bort skofältet
    const mockRemoveShoe = vi.fn();
    const user = userEvent.setup();
    const shoes = [
      { id: "1", size: "40" },
      { id: "2", size: "42" },
    ];

    render(
      <Shoes
        updateSize={() => {}}
        addShoe={() => {}}
        removeShoe={mockRemoveShoe}
        shoes={shoes}
      />
    );

    const removeButtons = screen.getAllByText("-");
    await user.click(removeButtons[1]);

    expect(mockRemoveShoe).toHaveBeenCalledWith("2");
  });

  // Acceptanskriterium 2: Systemet ska uppdatera bokningen när skostorlek tas bort
  it("ska ta bort rätt spelare när användaren klickar på specifik '-'-knapp", async () => {
    // Testar att rätt spelare tas bort baserat på vilken knapp som klickas
    const mockRemoveShoe = vi.fn();
    const user = userEvent.setup();
    const shoes = [
      { id: "abc-1", size: "38" },
      { id: "abc-2", size: "40" },
      { id: "abc-3", size: "42" },
    ];

    render(
      <Shoes
        updateSize={() => {}}
        addShoe={() => {}}
        removeShoe={mockRemoveShoe}
        shoes={shoes}
      />
    );

    const removeButtons = screen.getAllByText("-");

    // Ta bort den andra spelaren
    await user.click(removeButtons[1]);
    expect(mockRemoveShoe).toHaveBeenCalledWith("abc-2");

    mockRemoveShoe.mockClear();

    // Ta bort den första spelaren
    await user.click(removeButtons[0]);
    expect(mockRemoveShoe).toHaveBeenCalledWith("abc-1");
  });

  // Acceptanskriterium 2: Systemet ska uppdatera bokningen
  it("ska minska antalet skofält när en spelare tas bort", () => {
    // Testar att antalet synliga skofält minskar när skor tas bort
    const shoes = [
      { id: "1", size: "40" },
      { id: "2", size: "42" },
      { id: "3", size: "44" },
    ];

    const { rerender } = render(
      <Shoes
        updateSize={() => {}}
        addShoe={() => {}}
        removeShoe={() => {}}
        shoes={shoes}
      />
    );

    expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 3")).toBeInTheDocument();

    // Simulera att en spelare togs bort
    const updatedShoes = [
      { id: "1", size: "40" },
      { id: "3", size: "44" },
    ];

    rerender(
      <Shoes
        updateSize={() => {}}
        addShoe={() => {}}
        removeShoe={() => {}}
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
