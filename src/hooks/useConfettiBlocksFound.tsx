import { useEffect } from "react";
import { isValidValue } from "@/utils/numbers";
import confetti from "canvas-confetti";
import useIsViewing from "./useIsViewing";

export const useConfettiBlocksFound = (pool_blocks_found?: number) => {
  const isViewing = useIsViewing();

  const isPoolBlockFoundValid = (pool_blocks_found?: number) => {
    if (!isValidValue(pool_blocks_found, false)) {
      return false;
    }

    if (pool_blocks_found >= 1000) {
      return pool_blocks_found % 1000 == 0;
    }
    return pool_blocks_found % 100 == 0;
  };

  const showConfetti = () => {
    const canvas = document?.querySelector("canvas.confetti");
    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });
    myConfetti({
      scalar: 2.25,
      particleCount: 75,
      spread: 300,
    });
  };

  useEffect(() => {
    if (!isViewing) {
      return;
    }

    const isValid = isPoolBlockFoundValid(pool_blocks_found);
    if (!isValid) {
      return;
    }

    const localStorageId = `confetti-blocks-found-${pool_blocks_found}`;

    const isConfettiAlreadyShown = localStorage.getItem(localStorageId);

    if (isConfettiAlreadyShown === "true") {
      return;
    }

    try {
      showConfetti();
      localStorage.setItem(localStorageId, "true");
      const confettiInterval = setInterval(showConfetti, 1000);
      setTimeout(() => {
        clearInterval(confettiInterval);
      }, 9000);
    } catch (e) {}
  }, [pool_blocks_found, isViewing]);
};
