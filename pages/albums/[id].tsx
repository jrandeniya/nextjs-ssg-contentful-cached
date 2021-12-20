import type { NextPage } from "next";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { IAlbum } from "../../@types/contentful";
import { fetchEntity } from "../../api";

interface AlbumProps {
  album: IAlbum;
}

const Album: NextPage<AlbumProps> = ({ album }) => {
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
        <Link href={"/albums"}>
          <a>Albums</a>
        </Link>
        <span style={{ margin: "0 16px" }}>→</span>
        <span>{album.fields.title}</span>
      </h3>

      <div>
        <strong>Songs:</strong>
        <ul>
          {!album.fields.songs?.length && <li>No songs found</li>}
          {album.fields.songs?.map((song) => (
            <li key={song.fields.slug}>
              <Link href={`/songs/${song.fields.slug}`}>
                <a>{song.fields.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Artist: </strong>
        <Link href={`/artists/${album.fields.artist?.fields.slug}`}>
          <a>{album.fields.artist?.fields.name}</a>
        </Link>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const albums = await fetchEntity("album").all();

  const paths = albums.map((album) => ({
    params: {
      id: album.fields.slug,
    },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<AlbumProps> = async ({
  params,
}) => {
  const slug = params?.id;

  if (typeof slug !== "string") throw new Error("Album slug not provided");

  const album = await fetchEntity("album").findOne(
    (album) => album.fields.slug === slug
  );

  if (!album) throw new Error(`Album ${slug} not found`);

  return { props: { album } };
};

export default Album;
