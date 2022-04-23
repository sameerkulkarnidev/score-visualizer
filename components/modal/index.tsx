import React from "react";

type Props = {
  /**
   * Header for the modal component
   */
  title: string;

  /**
   * Optional Footer content for the modal
   */
  footer?: React.ReactNode;

  /**
   * Modal content that goes in modal body
   */
  children: React.ReactNode;

  /**
   * A function that will be invoked when user dismisses the modal
   */
  onDismiss: () => void;
};

const Modal = (props: Props) => {
  const { title, footer, children, onDismiss } = props;

  return (
    <>
      <div
        className="fixed w-screen h-screen bg-black/80"
        onClick={onDismiss}
      ></div>
      <section className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-3xl">
        <header className="p-5 border-b border-gray-300">
          <h2 className="font-medium">{title}</h2>
        </header>
        <div className="p-5 max-h-96 overflow-y-auto">{children}</div>
        {footer ? (
          <footer className="p-5 border-t border-gray-300">{footer}</footer>
        ) : null}
      </section>
    </>
  );
};

export default Modal;
