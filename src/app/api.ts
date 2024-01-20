"use server";

import { revalidateTag } from "next/cache";

let token: string = "";

const caller = async (method: string, url: string, body: string) => {
  revalidateTag("token");

  if (!token) {
    await getToken();
  }

  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Client-ID": `${process.env.IGDB_CLIENT_ID}`,
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch count");
  }

  return await res.json();
};

export async function getToken() {
  const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_SECRET}&grant_type=client_credentials`;
  const res = await fetch(url, {
    method: "POST",
    cache: "force-cache",
    next: { tags: ["token"] },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch token");
  }

  const data = await res.json();
  token = data.access_token;
}

export async function getGameById(id: number) {
  const url = "https://api.igdb.com/v4/games";
  const body = `fields name,aggregated_rating,category,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,game_engines,game_localizations,game_modes,genres,hypes,involved_companies,keywords,multiplayer_modes,platforms,player_perspectives,ports,rating,remakes,remasters,similar_games,slug,standalone_expansions,status,storyline,tags,themes,total_rating,updated_at,url,version_parent,version_title,videos,websites;where id=${id}; limit 1;`;

  return await caller("POST", url, body);
}

export async function search(searchString: string) {
  const url = "https://api.igdb.com/v4/search";
  const body = `fields id, name;search "${searchString}"; limit 50;`;

  return await caller("POST", url, body);
}
