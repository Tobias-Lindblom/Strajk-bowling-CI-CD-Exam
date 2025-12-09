import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Booking from "../Booking";

// Render helper
export const renderBooking = () => {
  return render(
    <BrowserRouter>
      <Booking />
    </BrowserRouter>
  );
};

// Hjälpfunktion för att fylla i bokningsformulär
export const fillBookingForm = async (
  user,
  { date, time, people, lanes, shoes = 0, fillShoes = false }
) => {
  if (date) await user.type(screen.getByLabelText("Date"), date);
  if (time) await user.type(screen.getByLabelText("Time"), time);
  if (people)
    await user.type(
      screen.getByLabelText("Number of awesome bowlers"),
      people.toString()
    );
  if (lanes)
    await user.type(screen.getByLabelText("Number of lanes"), lanes.toString());

  if (shoes > 0) {
    const addShoeButton = screen.getByText("+");
    for (let i = 0; i < shoes; i++) {
      await user.click(addShoeButton);
    }

    if (fillShoes) {
      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      for (const input of shoeInputs) {
        await user.type(input, "42");
      }
    }
  }
};

// Hjälpfunktion för att sätta upp test med ifyllt formulär
export const setup = async (formData) => {
  const user = userEvent.setup();
  renderBooking();
  await fillBookingForm(user, formData);
  return user;
};

// Hjälpfunktion för att slutföra en bokning
export const completeBooking = async (formData, mockResponse) => {
  const user = userEvent.setup();

  if (mockResponse) {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ bookingDetails: mockResponse }),
    });
  }

  renderBooking();
  await fillBookingForm(user, formData);
  await user.click(screen.getByText("strIIIIIike!"));
};
