import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: "1rem",
      }}
    >
      <Link href="/artists" passHref>
        <h3>
          <a>Artists</a>
        </h3>
      </Link>

      <Link href="/albums" passHref>
        <h3>
          <a>Albums</a>
        </h3>
      </Link>

      <Link href="/songs" passHref>
        <h3>
          <a>Songs</a>
        </h3>
      </Link>
    </div>
  );
};

export default Home;
