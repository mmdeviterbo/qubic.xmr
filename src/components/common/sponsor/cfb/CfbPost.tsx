"use client";
import { memo, useCallback, useEffect, useState, type FC } from "react";
import { XEmbed } from "react-social-media-embed";
import useBreakpoints from "@/hooks/useBreakpoints";
import Modal from "../../Modal";

const isCfbPostShownId = "1940823284985340272";

const CfbPost: FC = () => {
  const { isLg } = useBreakpoints();

  const [open, setOpen] = useState(false);

  const isShownLocally = localStorage.getItem(isCfbPostShownId);
  const setCfbPostShown = (value: boolean) =>
    localStorage.setItem(isCfbPostShownId, value.toString());

  const onOpenModal = useCallback(() => setOpen(true), []);
  const onCloseModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (isShownLocally !== "true") {
      setTimeout(() => {
        onOpenModal();
        setCfbPostShown(true);
      }, 750);
    }
  }, [isShownLocally]);

  return (
    <Modal show={open} setShow={setOpen}>
      {open && (
        <XEmbed
          url="https://x.com/_Qubic_/status/1940823284985340272"
          width={isLg ? 500 : 320}
          style={{
            backgroundColor: "white",
            zIndex: 100,
            // height: isLg ? "80vh" : "70vh",
          }}
        />
      )}
      <div className="flex flex-col items-center gap-4">
        <button
          className="w-15 h-10 md:w-18 md:h-12 mt-4 text-sm cursor-pointer bg-transparent hover:bg-gray-900 text-white border border-white rounded-full"
          onClick={onCloseModal}
        >
          X
        </button>
      </div>
    </Modal>
  );
};

export default memo(CfbPost);
