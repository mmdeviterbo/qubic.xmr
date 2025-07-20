"use client";
import { memo, useCallback, useEffect, useState, type FC } from "react";
import { XEmbed } from "react-social-media-embed";
import useBreakpoints from "@/hooks/useBreakpoints";
import Modal from "../../Modal";

const url = "https://x.com/c_f_b_token/status/1946852162010812632";

const CfbPost: FC = () => {
  const { isLg } = useBreakpoints();

  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const isShownLocally = localStorage.getItem(url);
  const setCfbPostShown = (value: boolean) =>
    localStorage.setItem(url, value.toString());

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
          url={url}
          width={isLg ? 500 : 320}
          style={{
            backgroundColor: "white",
            zIndex: 100,
            height: isLg ? "85vh" : "70vh",
          }}
          twitterTweetEmbedProps={{
            tweetId: url.split("/").at(-1),
            onLoad: () => setLoaded(true),
          }}
        />
      )}
      {loaded && (
        <div className="flex flex-col items-center gap-4">
          <button
            className="w-15 h-10 mt-4 text-sm cursor-pointer bg-transparent hover:bg-gray-900 text-white border border-white rounded-full"
            onClick={onCloseModal}
          >
            X
          </button>
        </div>
      )}
    </Modal>
  );
};

export default memo(CfbPost);
