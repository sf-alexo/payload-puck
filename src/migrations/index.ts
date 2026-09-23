import * as migration_20260622_145032_initial from './20260622_145032_initial';
import * as migration_20260623_110003_remove_tags_field from './20260623_110003_remove_tags_field';
import * as migration_20260623_114138_remove_slug_from_categories from './20260623_114138_remove_slug_from_categories';
import * as migration_20260623_120302_add_case_study_fields from './20260623_120302_add_case_study_fields';
import * as migration_20260624_132754_add_mcp_api_keys from './20260624_132754_add_mcp_api_keys';
import * as migration_20260624_141550_add_mcp_capabilities from './20260624_141550_add_mcp_capabilities';
import * as migration_20260629_124500_add_page_hierarchy from './20260629_124500_add_page_hierarchy';
import * as migration_20260923_123051_add_header_footer_fields from './20260923_123051_add_header_footer_fields';

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
    name: '20260623_120302_add_case_study_fields',
  },
  {
    up: migration_20260624_132754_add_mcp_api_keys.up,
    down: migration_20260624_132754_add_mcp_api_keys.down,
    name: '20260624_132754_add_mcp_api_keys',
  },
  {
    up: migration_20260624_141550_add_mcp_capabilities.up,
    down: migration_20260624_141550_add_mcp_capabilities.down,
    name: '20260624_141550_add_mcp_capabilities',
  },
  {
    up: migration_20260629_124500_add_page_hierarchy.up,
    down: migration_20260629_124500_add_page_hierarchy.down,
    name: '20260629_124500_add_page_hierarchy',
  },
  {
    up: migration_20260923_123051_add_header_footer_fields.up,
    down: migration_20260923_123051_add_header_footer_fields.down,
    name: '20260923_123051_add_header_footer_fields'
  },
];
