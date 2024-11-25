import { render, screen, fireEvent, within } from "@testing-library/react";
import { SortableItem } from "../Excercises/DND/SortableItems";

describe("SortableItem Component", () => {
    const mockOnDelete = jest.fn();

    it("renders children and delete button", () => {
        render(
            <SortableItem id="test-item" onDelete={mockOnDelete}>
                Test Item
            </SortableItem>
        );
        expect(screen.getByText("Test Item")).toBeInTheDocument();
        const sortableItem = screen.getByText("Test Item").closest("div");
        expect(sortableItem).toBeInTheDocument();

        const deleteButton = within(sortableItem!).getByRole("button", { name: /Eliminar/i });
        expect(deleteButton).toBeInTheDocument();
    });

    it("calls onDelete when delete button is clicked", () => {
        render(
            <SortableItem id="test-item" onDelete={mockOnDelete}>
                Test Item
            </SortableItem>
        );
        const sortableItem = screen.getByText("Test Item").closest("div");
        const deleteButton = within(sortableItem!).getByRole("button", { name: /Eliminar/i });

        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledWith("test-item");
    });
});