import type { NextPage } from "next";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { IArtist } from "../../@types/contentful";
import { fetchEntity } from "../../api";

interface ArtistProps {
  artist: IArtist;
}

const Artist: NextPage<ArtistProps> = ({ artist }) => {
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
        <Link href={"/artists"}>
          <a>Artists</a>
        </Link>
        <span style={{ margin: "0 16px" }}>→</span>
        <span>{artist.fields.name}</span>
      </h3>

      <div>
        <strong>Albums:</strong>
        <ul>
          {!artist.fields.albums?.length && <li>No albums found</li>}
          {artist.fields.albums?.map((album) => (
            <li key={album.fields.slug} style={{ marginTop: "16px" }}>
              <Link href={`/albums/${album.fields.slug}`}>
                <a>{album.fields.title}</a>
              </Link>
              <ul style={{ marginTop: "8px" }}>
                {album.fields.songs?.map((song) => (
                  <li key={song.fields.slug}>
                    <Link href={`/songs/${song.fields.slug}`}>
                      <a>{song.fields.title}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Build: once | Local: on page visit
export const getStaticPaths: GetStaticPaths = async () => {
  const artists = await fetchEntity("artist").all();

  // Get the paths we want to pre-render based on artists
  const paths = artists.map((artist) => ({
    params: {
      id: artist.fields.slug,
    },
  }));

  // We'll pre-render only these paths at build time.
  // fallback=false means all other routes should 404.
  return { paths, fallback: false };
};

// Build: once per artist | Local: on page visit
export const getStaticProps: GetStaticProps<ArtistProps> = async ({
  params,
}) => {
  const slug = params?.id;

  if (typeof slug !== "string") throw new Error("Artist slug not provided");

  const artist = await fetchEntity("artist").findOne(
    (artist) => artist.fields.slug === slug
  );

  if (!artist) throw new Error(`Artist ${slug} not found`);

  return { props: { artist } };
};

export default Artist;
