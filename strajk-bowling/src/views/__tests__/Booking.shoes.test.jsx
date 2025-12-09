import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderBooking, setup, completeBooking } from "./Booking.test.helpers";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 2 - Skostorlekar:
4. Om användaren försöker slutföra bokningen utan att ange skostorlek för en spelare
   som har valt att boka skor, ska systemet visa ett felmeddelande
5. Om antalet personer och skor inte matchas ska ett felmeddelande visas

User Story 3 - Ta bort skostorlek:
2. När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen
   så att inga skor längre är bokade för den spelaren
3. Om användaren tar bort skostorleken ska systemet inte inkludera den spelaren i skorantalet
   och priset för skor i den totala bokningssumman
*/

// Mock fetch
global.fetch = vi.fn();

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Booking - Skostorlekar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  // User story 2 - Acceptanskriterium 4:
  // Om användaren försöker slutföra bokningen utan att ange skostorlek för en spelare, ska systemet visa ett felmeddelande
  describe("User Story 2 - Acceptanskriterium 4: Felmeddelande om skostorlek saknas", () => {
    it("ska visa felmeddelande om skostorlek saknas för en spelare", async () => {
      const user = await setup({
        date: "2023-12-25",
        time: "18:00",
        people: 2,
        lanes: 1,
        shoes: 2,
        fillShoes: false,
      });

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      await user.type(shoeInputs[0], "42");

      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText("Alla skor måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om alla skostorlekar saknas", async () => {
      const user = await setup({
        date: "2023-12-25",
        time: "18:00",
        people: 3,
        lanes: 1,
        shoes: 3,
        fillShoes: false,
      });
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText("Alla skor måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska INTE visa felmeddelande om alla skostorlekar är ifyllda", async () => {
      const mockResponse = {
        when: "2023-12-25T18:00",
        lanes: 1,
        people: 2,
        shoes: ["40", "42"],
        bookingId: "STR1234",
        price: 340,
      };

      await completeBooking(
        {
          date: "2023-12-25",
          time: "18:00",
          people: 2,
          lanes: 1,
          shoes: 2,
          fillShoes: true,
        },
        mockResponse
      );

      await waitFor(() => {
        expect(
          screen.queryByText("Alla skor måste vara ifyllda")
        ).not.toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });
  });

  // User Story 2 - Acceptanskriterium 5:
  // Om antalet personer och skor inte matchas ska ett felmeddelande visas
  describe("User Story 2 - Acceptanskriterium 5: Antal skor måste matcha antal personer", () => {
    const shoeMismatchCases = [
      { name: "färre skor än personer", people: 4, shoes: 2 },
      { name: "fler skor än personer", people: 2, shoes: 4 },
    ];

    it.each(shoeMismatchCases)(
      "ska visa felmeddelande om $name",
      async ({ people, shoes }) => {
        const user = await setup({
          date: "2023-12-25",
          time: "18:00",
          people,
          lanes: 1,
          shoes,
          fillShoes: true,
        });
        await user.click(screen.getByText("strIIIIIike!"));

        await waitFor(() => {
          expect(
            screen.getByText(
              "Antalet skor måste stämma överens med antal spelare"
            )
          ).toBeInTheDocument();
        });
      }
    );

    it("ska INTE visa felmeddelande om antalet skor matchar antalet personer", async () => {
      await completeBooking(
        {
          date: "2023-12-25",
          time: "18:00",
          people: 3,
          lanes: 1,
          shoes: 3,
          fillShoes: true,
        },
        {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 3,
          shoes: ["38", "40", "42"],
          bookingId: "STR5678",
          price: 460,
        }
      );

      await waitFor(() => {
        expect(
          screen.queryByText(
            "Antalet skor måste stämma överens med antal spelare"
          )
        ).not.toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });
  });

  // User Story 3 - Acceptanskriterium 2 & 3:
  // När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen
  // så att inga skor längre är bokade för den spelaren.
  // Borttagna skor ska inte inkluderas i skorantalet och priset.
  describe("User Story 3 - Acceptanskriterium 2 & 3: Ta bort skor och uppdatera bokning", () => {
    it("ska kunna ta bort skor efter att ha lagt till dem", async () => {
      // Testar att användaren kan ta bort skor som de tidigare lagt till
      // Acceptanskriterium 2: Systemet ska uppdatera bokningen när skor tas bort
      const user = userEvent.setup();
      renderBooking();

      // Lägg till 4 skor
      const addShoeButton = screen.getByText("+");
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);

      // Verifiera att 4 skor finns
      let shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      expect(shoeInputs).toHaveLength(4);

      // Ta bort en sko
      const removeButtons = screen.getAllByText("-");
      await user.click(removeButtons[3]); // Ta bort den sista

      // Verifiera att bara 3 skor finns kvar (systemet har uppdaterat bokningen)
      shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      expect(shoeInputs).toHaveLength(3);
    });

    it("ska kunna korrigera antal skor genom att ta bort för många tillagda skor", async () => {
      // Testar att användaren kan korrigera om de råkat lägga till för många skor
      // Acceptanskriterium 3: Borttagna skor ska inte inkluderas i skorantalet
      const user = userEvent.setup();
      const mockResponse = {
        bookingDetails: {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 2,
          shoes: ["42", "44"],
          bookingId: "STR9999",
          price: 360,
        },
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      renderBooking();

      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "2");
      await user.type(lanesInput, "1");

      // Råka lägga till 4 skor istället för 2
      const addShoeButton = screen.getByText("+");
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);

      let shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      expect(shoeInputs).toHaveLength(4);

      // Ta bort 2 skor för att matcha antal personer (2)
      let removeButtons = screen.getAllByText("-");
      await user.click(removeButtons[3]);
      await user.click(removeButtons[2]);

      // Fyll i de 2 kvarvarande skorna
      shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      expect(shoeInputs).toHaveLength(2);
      await user.type(shoeInputs[0], "42");
      await user.type(shoeInputs[1], "44");

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      // Bokningen ska gå igenom nu när antal skor = antal personer
      await waitFor(() => {
        expect(
          screen.queryByText(
            "Antalet skor måste stämma överens med antal spelare"
          )
        ).not.toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });

    it("ska inte inkludera borttagna skor i slutlig bokning", async () => {
      // Testar att borttagna skor inte räknas med i priset eller skorantalet
      // Acceptanskriterium 3: Borttagna skor ska inte vara inkluderade
      const user = userEvent.setup();

      const mockResponse = {
        bookingDetails: {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 3,
          shoes: ["38", "40", "42"],
          bookingId: "STR1111",
          price: 460,
        },
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      renderBooking();

      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "3");
      await user.type(lanesInput, "1");

      // Lägg till 5 skor först
      const addShoeButton = screen.getByText("+");
      for (let i = 0; i < 5; i++) {
        await user.click(addShoeButton);
      }

      let shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      expect(shoeInputs).toHaveLength(5);

      // Ta bort 2 skor så att bara 3 kvarstår (lika med antal personer)
      let removeButtons = screen.getAllByText("-");
      await user.click(removeButtons[4]);
      await user.click(removeButtons[3]);

      // Fyll i de 3 kvarvarande skorna
      shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      await user.type(shoeInputs[0], "38");
      await user.type(shoeInputs[1], "40");
      await user.type(shoeInputs[2], "42");

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      // Verifiera att bokningen går igenom med bara 3 skor (de 2 borttagna räknas inte)
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });
  });
});
