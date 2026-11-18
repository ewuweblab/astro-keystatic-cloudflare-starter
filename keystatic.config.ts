// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

// Storage strategy:
// - `astro dev`     → `local`: the admin at /keystatic writes straight to src/content/.
// - deployed build → `cloud`: the admin commits to GitHub through Keystatic Cloud,
//                    so editors sign in with Keystatic Cloud instead of GitHub.
//
// Set PUBLIC_KEYSTATIC_CLOUD_PROJECT (e.g. "my-team/my-project", from keystatic.cloud)
// to enable cloud mode. Until it's set, builds fall back to `local` (read-only on the
// deployed site). Set PUBLIC_KEYSTATIC_STORAGE=local|cloud to override either way,
// e.g. to try cloud mode while running `astro dev`.
const cloudProject: string | undefined = import.meta.env.PUBLIC_KEYSTATIC_CLOUD_PROJECT;
const storageOverride: string | undefined = import.meta.env.PUBLIC_KEYSTATIC_STORAGE;

const useCloud =
  storageOverride === 'cloud' ||
  (storageOverride !== 'local' && !import.meta.env.DEV && Boolean(cloudProject));

if (useCloud && !cloudProject) {
  throw new Error(
    'Keystatic cloud storage needs PUBLIC_KEYSTATIC_CLOUD_PROJECT (e.g. "my-team/my-project").',
  );
}

export default config({
  storage: useCloud ? { kind: 'cloud' } : { kind: 'local' },
  ...(useCloud && cloudProject ? { cloud: { project: cloudProject } } : {}),
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});
