import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { IAlbum } from "../../@types/contentful";
import { fetchEntity } from "../../api";

type AlbumsProps = {
  albums: Array<IAlbum>;
};

const Albums: NextPage<AlbumsProps> = ({ albums }) => {
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
        <span>Albums</span>
      </h3>
      {albums.length === 0 && <p>There are no albums found</p>}
      {albums.map((album) => (
        <div key={album.fields.slug}>
          <Link href={`/albums/${encodeURIComponent(album.fields.slug)}`}>
            <a>{album.fields.title}</a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps<AlbumsProps> = async () => {
  try {
    const albums = await fetchEntity("album").all();
    return { props: { albums } };
  } catch (error) {
    console.error(error);
    return { props: { albums: [] } };
  }
};

export default Albums;
