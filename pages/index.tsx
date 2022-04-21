import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Score Visualizer</title>
        <meta
          name="description"
          content="Visualizer for basketball match scores"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-center">Welcome to Score Visualizer</h1>
      </main>
    </div>
  );
};

export default Home;
