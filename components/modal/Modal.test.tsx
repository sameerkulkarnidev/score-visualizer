import { render, screen } from "@testing-library/react";
import Modal from "./index";

test("should render modal correctly", () => {
  const onDismiss = jest.fn();

  render(
    <Modal title="Modal" onDismiss={onDismiss}>
      content
    </Modal>
  );

  expect(screen.getByText("Modal")).toBeDefined();
  expect(screen.getByText("content")).toBeDefined();
});

test("should render modal footer correctly", () => {
  const onDismiss = jest.fn();

  render(
    <Modal title="Modal" onDismiss={onDismiss} footer="footer">
      content
    </Modal>
  );

  expect(screen.getByText("Modal")).toBeDefined();
  expect(screen.getByText("content")).toBeDefined();
  expect(screen.getByText("footer")).toBeDefined();
});

test("should invoke onDismiss correctly", () => {
  const onDismiss = jest.fn();

  render(
    <Modal title="Modal" onDismiss={onDismiss}>
      content
    </Modal>
  );

  const backDrop = screen.getByTestId("back-drop");
  backDrop.click();

  expect(onDismiss).toHaveBeenCalled();
});
