export async function getPokemons(offset = 0, limit = 20) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }

  const data = await response.json();

  const detailedPokemons = await Promise.all(
    data.results.map(async (p: { name: string; url: string }) => {
      const res = await fetch(p.url);
      return await res.json();
    }),
  );

  return {
    pokemons: detailedPokemons,
    next: data.next,
  };
}
