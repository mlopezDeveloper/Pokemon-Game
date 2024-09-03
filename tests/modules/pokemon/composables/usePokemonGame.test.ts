import { usePokemonGame } from '@/modules/pokemon/composables/usePokemonGame';
import { withSetup } from 'tests/utils/with-setup';

describe('usePokemonGame', async () => {
  test('should initialize with the correct default values', async () => {
    const [results, app] = withSetup(usePokemonGame);
  });
});
