import * as migration_20260622_145032_initial from './20260622_145032_initial';
import * as migration_20260623_110003_remove_tags_field from './20260623_110003_remove_tags_field';
import * as migration_20260623_114138_remove_slug_from_categories from './20260623_114138_remove_slug_from_categories';
import * as migration_20260623_120302_add_case_study_fields from './20260623_120302_add_case_study_fields';

export const migrations = [
  {
    up: migration_20260622_145032_initial.up,
    down: migration_20260622_145032_initial.down,
    name: '20260622_145032_initial',
  },
  {
    up: migration_20260623_110003_remove_tags_field.up,
    down: migration_20260623_110003_remove_tags_field.down,
    name: '20260623_110003_remove_tags_field',
  },
  {
    up: migration_20260623_114138_remove_slug_from_categories.up,
    down: migration_20260623_114138_remove_slug_from_categories.down,
    name: '20260623_114138_remove_slug_from_categories',
  },
  {
    up: migration_20260623_120302_add_case_study_fields.up,
    down: migration_20260623_120302_add_case_study_fields.down,
    name: '20260623_120302_add_case_study_fields'
  },
];
