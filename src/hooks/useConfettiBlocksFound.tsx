import { useEffect } from "react";

import gsap from "gsap";
import confetti from "canvas-confetti";

import { isValidValue } from "@/utils/numbers";
import useIsViewing from "./useIsViewing";
import { cfbTokenStorageId } from "@/utils/constants";

export const flipCFBImage = () => {
  setTimeout(() => {
    gsap.to("#cfb-token-container", { bottom: 300, duration: 1.25, ease: "bounce.out" });
    localStorage.setItem(cfbTokenStorageId, "true");
    setTimeout(() => {
      gsap.fromTo("#super-monero-container", { opacity: 0 }, { opacity: 1, bottom: 0, duration: 1.5, ease: "bounce.out" });
    }, 500)
  }, 1000)
}

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
    const cfbTokenItem = localStorage.getItem(cfbTokenStorageId);
    if(pool_blocks_found > 100 && cfbTokenItem !== "true") {
      localStorage.setItem(cfbTokenStorageId, "true");
    }
  }, [pool_blocks_found]);

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
        flipCFBImage();
        clearInterval(confettiInterval);
      }, 9000);
    } catch (e) {}
  }, [pool_blocks_found, isViewing]);
};
