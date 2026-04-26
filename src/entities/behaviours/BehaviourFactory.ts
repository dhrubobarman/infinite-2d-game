import type { Behaviours } from '@/entities/behaviours/Behaviours';
import { DriftBehaviour } from '@/entities/behaviours/DriftBehaviour';
import { SeekBehaviour } from '@/entities/behaviours/SeekBehaviour';

export type BehaviourTypes = 'seek' | 'drift';

export class BehaviourFactory {
  static createBehaviour(behaviourType: BehaviourTypes): Behaviours {
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
