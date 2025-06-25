"use client";
import { memo, useCallback, useEffect, useState, type FC } from "react";
import { XEmbed } from "react-social-media-embed";
import useBreakpoints from "@/hooks/useBreakpoints";
import Modal from "../../Modal";

const isCfbPostShownId = "is-cfb-deposit-post-shown-key";

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
          url="https://x.com/c_f_b_token/status/1937746120660099305"
          width={isLg ? 480 : 320}
          style={{
            backgroundColor: "white",
            zIndex: 100,
            // height: isLg ? "80vh" : "70vh",
          }}
        />
      )}
      <div className="flex flex-col items-center gap-4">
        <button
          className="w-24 h-10 mt-4 text-sm cursor-pointer bg-white text-black border border-gray-300 hover:bg-gray-100 font-medium rounded-full"
          onClick={onCloseModal}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default memo(CfbPost);
