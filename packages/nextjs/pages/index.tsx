import Head from "next/head";
import type { NextPage } from "next";
import { ChangeVideoDetails } from "~~/components/example-ui/ChangeVideoDetails";
import { ContractData } from "~~/components/example-ui/ContractData";
import { ContractInteraction } from "~~/components/example-ui/ContractInteraction";
import { Dequeue } from "~~/components/example-ui/Dequeue";
import { ListQueueSpot } from "~~/components/example-ui/ListQueueSpot";
import { VideoPlayer } from "~~/components/example-ui/VideoPlayer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Scaffold-ETH 2 Example Ui</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
        <div className="flex flex-col justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
          <VideoPlayer />
          <ContractData />
        </div>
        <div>
          <ContractInteraction />
          <Dequeue />
          <ChangeVideoDetails />
          <ListQueueSpot />
        </div>
      </div>
    </>
  );
};

export default Home;
