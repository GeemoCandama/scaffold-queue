import { useEffect, useState } from "react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

function getPlaybackTime(videoStartTime: number | null): number {
  if (!videoStartTime) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const playbackTime = currentTime - videoStartTime;

  return playbackTime;
}

export const VideoPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [previousPlayerState, setPreviousPlayerState] = useState<number | null>(null);
  const { data: currentVideo, isLoading: isCurrentVideoLoading } = useScaffoldContractRead({
    contractName: "VideoQueue",
    functionName: "getCurrentVideo",
  });
  const { data: currentVideoStartTime } = useScaffoldContractRead({
    contractName: "VideoQueue",
    functionName: "getCurrentVideoStartTime",
  });

  const onPlayerReady = (event: any) => {
    setIsPlayerReady(true);
    const playbackTime = getPlaybackTime(currentVideoStartTime);
    event.target.seekTo(playbackTime, true);
  };

  const handleStateChange = (event: any) => {
    const newState = event.data;

    if (
      previousPlayerState === -1 ||
      previousPlayerState === 0 ||
      previousPlayerState === 2 ||
      previousPlayerState === 5 ||
      previousPlayerState === 1
    ) {
      if (newState === 1) {
        const playbackTime = getPlaybackTime(currentVideoStartTime);
        event.target.seekTo(playbackTime, true);
      }
    }
    setPreviousPlayerState(newState);
  };

  useEffect(() => {
    // load the YouTube iFrame API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // initialize the player when the API script is loaded
    window.onYouTubeIframeAPIReady = () => {
      setPlayer(
        new YT.Player("player", {
          height: "360",
          width: "640",
          playerVars: {
            controls: 0,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: handleStateChange,
          },
        }),
      );
    };
    console.log(currentVideo);
  }, [currentVideoStartTime]);

  useEffect(() => {
    if (currentVideo) {
      setCurrentVideoId(currentVideo[0]);
    }
  }, [isCurrentVideoLoading, currentVideo]);

  useEffect(() => {
    if (player && isPlayerReady) {
      player.loadVideoById({ videoId: currentVideoId, startSeconds: getPlaybackTime(currentVideoStartTime) });
    }
  }, [player, currentVideoId, isPlayerReady]);

  const handlePress = () => {
    player.playVideo();
  };

  return (
    <div className="flex flex-col justify-center items-center py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
      <div className="relative">
        <div id="player"></div>
        <div className="absolute inset-0" onClick={e => e.preventDefault()}></div>
      </div>
      <button className="bg-white mt-2 p-2 rounded-lg hover:bg-gray-200" onClick={() => handlePress()}>
        Start the VideoPlayer
      </button>
    </div>
  );
};
