import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import Marquee from "react-fast-marquee";
import {
  useAnimationConfig,
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

const MARQUEE_PERIOD_IN_SEC = 10;

export const ContractData = () => {
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [marqueeSpeed, setMarqueeSpeed] = useState(0);
  const [tenVideos, setTenVideos] = useState([]);
  const { data: videoQueue } = useScaffoldContract({ contractName: "VideoQueue" });
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [value, setValue] = useState(null);

  const { data: currentTokenId } = useScaffoldContractRead({
    contractName: "VideoQueue",
    functionName: "_currnetVideotokenId",
  });

  const { data: totalTokens } = useScaffoldContractRead({
    contractName: "VideoQueue",
    functionName: "_tokenIds",
  });

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "VideoQueue",
    functionName: "buyListedQueueSpot",
    args: [selectedTokenId],
    value: value,
  });

  const buyQueueSpot = async (tokenId, price) => {
    console.log(tokenId, price);
    setSelectedTokenId(tokenId);
    setValue(price.toString());
    await writeAsync();
  };

  const getListings = async tokenId => {
    const response = await videoQueue.listings(tokenId);
    return response;
  };

  useEffect(() => {
    const getVideoDetails = async tokenId => {
      const response = await videoQueue.videoDetails(tokenId);
      return response;
    };

    const setInitialTenVideos = async (currentTokenId, totalTokenIds) => {
      let videosToAdd = Number(totalTokenIds) + 1 - Number(currentTokenId);
      if (videosToAdd === -1) {
        videosToAdd = 0;
      } else if (videosToAdd > 10) {
        videosToAdd = 10;
      }

      const videoPromises = [];
      const listingPromises = [];
      for (let i = 0; i < videosToAdd; i++) {
        videoPromises.push(getVideoDetails(Number(currentTokenId) + i));
        listingPromises.push(getListings(Number(currentTokenId) + i));
      }

      const responses = await Promise.all(videoPromises);
      const listingResponses = await Promise.all(listingPromises);
      const amalgumArr = [];
      for (let i = 0; i < responses.length; i++) {
        const response = [...responses[i]];
        amalgumArr.push([response[0], response[1], response[2], listingResponses[i]]);
      }
      setTenVideos(amalgumArr);
    };

    setInitialTenVideos(currentTokenId, totalTokens);
  }, [currentTokenId, totalTokens]);

  const containerRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);

  const { data: currentVideo, isLoading: isCurrentVideoLoading } = useScaffoldContractRead({
    contractName: "VideoQueue",
    functionName: "getCurrentVideo",
  });

  useScaffoldEventSubscriber({
    contractName: "VideoQueue",
    eventName: "VideoDetailsUpdated",
    listener: async (video, tokenId) => {
      const newTenVideos = [...tenVideos];
      const pos = Number(tokenId) - Number(currentTokenId);
      if (newTenVideos[pos]) {
        const amalgum = [video[0], video[1], video[2], listing];
        newTenVideos[pos] = amalgum;
        setTenVideos(newTenVideos);
      }
    },
  });

  useScaffoldEventSubscriber({
    contractName: "VideoQueue",
    eventName: "newListing",
    listener: async tokenId => {
      const newTenVideos = [...tenVideos];
      const pos = Number(tokenId) - Number(currentTokenId);
      if (newTenVideos[pos]) {
        const video = newTenVideos[pos];
        const listing = await getListings(Number(tokenId));
        const amalgum = [video[0], video[1], video[2], listing];
        newTenVideos[pos] = amalgum;
        setTenVideos(newTenVideos);
      }
    },
  });

  const { showAnimation } = useAnimationConfig(currentTokenId);
  const showTransition = transitionEnabled && !!currentVideo && !isCurrentVideoLoading;

  useEffect(() => {
    if (transitionEnabled && containerRef.current && greetingRef.current) {
      setMarqueeSpeed(MARQUEE_PERIOD_IN_SEC * 5);
    }
  }, [transitionEnabled, containerRef, greetingRef]);

  return (
    <div className="flex flex-col justify-center items-center py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
      <div
        className={`flex flex-col max-w-md bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 w-full ${
          showAnimation ? "animate-zoom" : ""
        }`}
      >
        <div className="flex justify-between w-full">
          <button
            className="btn btn-circle btn-ghost relative bg-center bg-[url('/assets/switch-button-on.png')] bg-no-repeat"
            onClick={() => {
              setTransitionEnabled(!transitionEnabled);
            }}
          >
            <div
              className={`absolute inset-0 bg-center bg-no-repeat bg-[url('/assets/switch-button-off.png')] transition-opacity ${
                transitionEnabled ? "opacity-0" : "opacity-100"
              }`}
            />
          </button>
          <div className="bg-secondary border border-primary rounded-xl flex">
            <div className="p-2 py-1 border-r border-primary flex items-end">Total count</div>
            <div className="text-4xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
              {currentTokenId?.toString() || "0"}
            </div>
          </div>
        </div>

        <div className="mt-3 border border-primary bg-neutral rounded-3xl text-secondary overflow-hidden text-[50px] whitespace-nowrap w-full">
          <div className="relative overflow-x-hidden" ref={containerRef}>
            <div className="absolute -left-[9999rem]" ref={greetingRef}>
              <div className="px-4">{currentVideo ? currentVideo[0] : ""}</div>
            </div>
            <Marquee
              direction="left"
              gradient={false}
              play={showTransition}
              speed={marqueeSpeed}
              pauseOnHover={true}
              className={`flex flex-row text-black border-solid`}
            >
              <div className="text-upright text-sm writing-vertical -rotate-90 border-t-8 border-red-800 w-[125px] mx-auto flex justify-center">
                Now Playing
              </div>
              {new Array(tenVideos.length).fill("").map((_, i) => {
                return (
                  <div key={i} className="pr-2 h-full text-sm">
                    <div className="my-2 px-3 rounded-xl py-2 border-black border-2 w-[190px] h-[125px]">
                      {tenVideos[i] ? (
                        <>
                          <div
                            className="w-full"
                            style={{
                              borderBottom: "1px solid black",
                            }}
                          >
                            TokenID: {Number(currentTokenId) + i}
                          </div>
                          <div className="text-sm">ID: {tenVideos[i][0]}</div>
                          <div className="text-sm">MINTIME: {Number(tenVideos[i][1])}</div>
                          <div className="text-sm">
                            {tenVideos[i][3][0] === true && i !== 0 ? (
                              <button
                                className="bg-gray-200 px-2 mt-3 rounded-lg shadow-lg hover:bg-gray-400 mx-auto flex"
                                style={{
                                  border: "1px solid black",
                                }}
                                onClick={() =>
                                  buyQueueSpot(Number(currentTokenId) + 1, ethers.utils.formatEther(tenVideos[i][3][1]))
                                }
                              >
                                Buy for: ${ethers.utils.formatEther(tenVideos[i][3][1])} Ether
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="">
                          <div className="mx-auto">{i + 1}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};
