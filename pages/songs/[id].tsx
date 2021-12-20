import type { NextPage } from "next";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ISong } from "../../@types/contentful";
import { fetchEntity } from "../../api";

interface SongProps {
  song: ISong;
}

const Song: NextPage<SongProps> = ({ song }) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <h3>
        <Link href={"/"}>
          <a>Home</a>
        </Link>
        <span style={{ margin: "0 16px" }}>→</span>
        <Link href={"/songs"}>
          <a>Songs</a>
        </Link>
        <span style={{ margin: "0 16px" }}>→</span>
        <span>{song.fields.title}</span>
      </h3>

      <p>
        <strong>Album: </strong>

        <Link href={`/albums/${song.fields.album?.fields.slug}`}>
          <a>{song.fields.album?.fields.title}</a>
        </Link>
      </p>
      <p>
        <strong>Artist: </strong>
        <Link href={`/artists/${song.fields.artist?.fields.slug}`}>
          <a>{song.fields.artist?.fields.name}</a>
        </Link>
      </p>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const songs = await fetchEntity("song").all();

  const paths = songs.map((song) => ({
    params: {
      id: song.fields.slug,
    },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<SongProps> = async ({ params }) => {
  const slug = params?.id;

  if (typeof slug !== "string") throw new Error("Song slug not provided");

  const song = await fetchEntity("song").findOne(
    (song) => song.fields.slug === slug
  );

  if (!song) throw new Error(`Song ${slug} not found`);

  return { props: { song } };
};

export default Song;
