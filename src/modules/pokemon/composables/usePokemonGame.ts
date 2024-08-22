import { computed, onMounted, ref } from 'vue';
import { GameStatus } from './../interfaces/game-status.enum';
import { pokemonApi } from '../api/pokemonApi';
import type { Pokemon, PokemonListResponse } from '../interfaces';
import confetti from 'canvas-confetti';

export const usePokemonGame = () => {
  const gameStatus = ref<GameStatus>(GameStatus.Playing);
  const pokemons = ref<Pokemon[]>([]);
  const pokemonOptions = ref<Pokemon[]>([]);

  const randomPokemon = computed(() => {
    const randomIndex = Math.floor(Math.random() * pokemonOptions.value.length);
    return pokemonOptions.value[randomIndex];
  }); //con el floor me lo redondea
  const isLoading = computed(() => pokemons.value.length === 0);

  const getPokemons = async (): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>('/?limit=151');

    //console.log(response.data);
    const pokemonArray = response.data.results.map((pokemon) => {
      const urlPaths = pokemon.url.split('/');
      const id = urlPaths.at(-2) ?? 0;
      return {
        name: pokemon.name,
        id: +id,
      };
    });

    return pokemonArray.sort(() => Math.random() - 0.5);
  };

  const getNextRound = (howMany: number = 4) => {
    gameStatus.value = GameStatus.Playing;
    pokemonOptions.value = pokemons.value.slice(0, howMany); //obtengo los primeros 4 pokemon de nuestro arreglo
    pokemons.value = pokemons.value.slice(howMany); //almaceno todos los pokemon excepto los 4 que obtuve
  };

  const checkAnswer = (id: number) => {
    const hasWon = randomPokemon.value.id === id;

    if (hasWon) {
      gameStatus.value = GameStatus.Won;
      confetti({
        particleCount: 300,
        spread: 150,
        origin: { y: 0.6 },
      });
      return;
    }

    gameStatus.value = GameStatus.Lost; //si no gana
  };

  onMounted(async () => {
    //await new Promise((r) => setTimeout(r, 1000));

    pokemons.value = await getPokemons();
    getNextRound();

    //console.log({ pokemons });
    //console.log(pokemonOptions.value);
  });

  return {
    gameStatus,
    isLoading,
    pokemonOptions,
    randomPokemon,

    //Methods
    getNextRound,
    checkAnswer,
  };
};
