import { useState } from "react";
import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const ChangeVideoDetails = () => {
  const [videoId, setVideoId] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [playbackStartTime, setPlaybackStartTime] = useState("");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "VideoQueue",
    functionName: "changeQueueSpotVideoDetails",
    args: [videoId, playbackStartTime, tokenId],
  });

  return (
    <div className="flex bg-base-300 relative pb-10">
      <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <span className="text-4xl sm:text-6xl text-black">Change Queue Spot Video</span>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="VIDEO ID HERE"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white"
                onChange={e => setVideoId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Token Id here"
                className="mt-2 input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
                onChange={e => setTokenId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Playback Start Time 0 = start"
                className="mt-2 input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-white uppercase"
                onChange={e => setPlaybackStartTime(e.target.value)}
              />
            </div>
            <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
              <div className="flex rounded-full border-2 border-primary p-1">
                <button
                  className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                    isLoading ? "loading" : ""
                  }`}
                  onClick={writeAsync}
                >
                  {!isLoading && (
                    <>
                      Send <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 items-start">
            <span className="text-sm leading-tight">Price:</span>
            <div className="badge badge-warning">Gas</div>
          </div>
        </div>
      </div>
    </div>
  );
};
