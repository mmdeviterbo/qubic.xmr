"use client";
import { memo, useEffect, useState, type FC } from "react";
import { Tweet } from "react-tweet";

import Modal from "../../Modal";

const isCfbPostShownId = "is-cfb-post-shown-key";

const CfbPost: FC = () => {
  const isShownLocally = localStorage.getItem(isCfbPostShownId);

  const setCfbPostShown = (value: boolean) =>
    localStorage.setItem(isCfbPostShownId, value.toString());

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isShownLocally !== "true") {
      setTimeout(() => {
        setShow(true);
        setCfbPostShown(true);
      }, 750);
    }
  }, [isShownLocally]);

  return (
    <Modal setShow={setShow} show={show}>
      <Tweet id="1937417135313072364" />
    </Modal>
  );
};

export default memo(CfbPost);
