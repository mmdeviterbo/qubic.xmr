import {
  memo,
  type Dispatch,
  type SetStateAction,
  type FC,
  type ReactNode,
} from "react";

interface ModalProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ children, show, setShow }) => {
  const handleOutsideClick = (event) => {
    const modalContent = document.getElementById("modal-content");
    if (!modalContent.contains(event.target)) {
      setShow(false);
    }
  };

  return (
    <div
      id="modal"
      onClick={handleOutsideClick}
      className={`fixed inset-0 bg-black/60 flex items-center justify-center z-200 transition-all transition-discrete opacity-0 ${show ? "opacity-100" : "opacity-0 hidden"}`}
    >
      <div id="modal-content" className="px-4 md:px-1">
        {children}
      </div>
    </div>
  );
};

export default memo(Modal);
