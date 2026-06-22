import * as migration_20260622_145032_initial from './20260622_145032_initial';

export const migrations = [
  {
    up: migration_20260622_145032_initial.up,
    down: migration_20260622_145032_initial.down,
    name: '20260622_145032_initial'
  },
];
