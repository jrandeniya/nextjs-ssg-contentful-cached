import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { ISong } from "../../@types/contentful";
import { fetchEntity } from "../../api";

type SongsProps = {
  songs: Array<ISong>;
};

const Songs: NextPage<SongsProps> = ({ songs }) => {
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
      <h3>
        <Link href={"/"}>
          <a>Home</a>
        </Link>
        <span style={{ margin: "0 16px" }}>→</span>
        <span>Songs</span>
      </h3>
      {songs.length === 0 && <p>There are no songs found</p>}
      {songs.map((song) => (
        <div key={song.fields.slug}>
          <Link href={`/songs/${encodeURIComponent(song.fields.slug)}`}>
            <a>{song.fields.title}</a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps<SongsProps> = async () => {
  try {
    const songs = await fetchEntity("song").all();
    return { props: { songs } };
  } catch (error) {
    console.error(error);
    return { props: { songs: [] } };
  }
};

export default Songs;
