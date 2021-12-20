import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { IArtist } from "../../@types/contentful";
import { fetchEntity } from "../../api";

type ArtistsProps = {
  artists: Array<IArtist>;
};

const Artists: NextPage<ArtistsProps> = ({ artists }) => {
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
        <span>Artists</span>
      </h3>
      {artists.length === 0 && <p>There are no artists found</p>}
      {artists.map((artist) => (
        <div key={artist.fields.slug}>
          <Link href={`/artists/${encodeURIComponent(artist.fields.slug)}`}>
            <a>{artist.fields.name}</a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps<ArtistsProps> = async () => {
  try {
    const artists = await fetchEntity("artist").all();
    return { props: { artists } };
  } catch (error) {
    console.error(error);
    return { props: { artists: [] } };
  }
};

export default Artists;
