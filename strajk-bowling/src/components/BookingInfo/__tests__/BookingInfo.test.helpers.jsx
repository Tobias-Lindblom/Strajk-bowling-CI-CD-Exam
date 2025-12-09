import { render } from "@testing-library/react";
import { vi } from "vitest";
import BookingInfo from "../BookingInfo";

/**
 * Helper function för att rendera BookingInfo-komponenten
 */
export const renderBookingInfo = (updateBookingDetails = vi.fn()) => {
  return render(<BookingInfo updateBookingDetails={updateBookingDetails} />);
};
