import { Dispatch, memo, SetStateAction, type FC, type ReactNode } from "react";

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
    <>
      <div
        id="modal"
        onClick={handleOutsideClick}
        className={`fixed inset-0 bg-black/60 flex items-center justify-center z-200 transition-all transition-discrete oapcity-0 ${show ? "opacity-100" : "opacity-0 hidden"}`}
      >
        <div id="modal-content" className="px-4 md:px-1">
          {children}

          <div className="flex flex-col items-center gap-4">
            {
              <button
                className="w-32 h-10 mt-[-5] cursor-pointer bg-white text-black border border-gray-300 hover:bg-gray-100 font-medium py-2 px-4 rounded-full"
                onClick={() => setShow(false)}
              >
                Close
              </button>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Modal);
