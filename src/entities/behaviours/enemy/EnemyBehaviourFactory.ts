import type { Behaviours } from '@/entities/behaviours/Behaviours';
import { DriftBehaviour } from '@/entities/behaviours/enemy/DriftBehaviour';
import { SeekBehaviour } from '@/entities/behaviours/enemy/SeekBehaviour';

export type EnemyBehaviourTypes = 'seek' | 'drift';

export class EnemyBehaviourFactory {
  static createBehaviour(behaviourType: EnemyBehaviourTypes): Behaviours {
    switch (behaviourType) {
      case 'seek':
        return new SeekBehaviour();
      case 'drift':
        return new DriftBehaviour();
      default:
        console.log(`Invalid behaviour type: ${behaviourType}, defaulting to seek`);
        return new SeekBehaviour();
    }
  }
}
