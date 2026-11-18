/**
 * Builds the AI Birthday Video Generator scene guides (MkDocs) from the main site's page JSON.
 * Run from the main site repo so @/ imports resolve:
 *   cd ~/shnext/2610/ai-birthday-video-generator && npx tsx ../ai-birthday-video-generator-guides/build.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { SHOWCASE_VIDEOS, SITE_IMAGES } from '@/config/media/showcase-media';

const OUT = path.resolve('../ai-birthday-video-generator-guides');
const SITE = 'https://aibirthdayvideogenerator.com';
const PAGES_DIR = 'src/config/locale/messages/en/pages/video';
const UTM = '?utm_source=readthedocs';
const IDENTITY =
  'AI birthday video generator from a single photo: they pop champagne on a park bench, blow out a Scorpio cake, or light a crown cake at the car window.';

const ALL_MEDIA = [...SHOWCASE_VIDEOS, ...SITE_IMAGES];

const slugs = fs
  .readdirSync(PAGES_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''));

const scenes = slugs
  .map((slug) => {
    const raw = JSON.parse(fs.readFileSync(`${PAGES_DIR}/${slug}.json`, 'utf8'));
    const page = raw.page;
    const s = page.sections;
    const clips = (s.demo?.items ?? [])
      .map((it: any) => ({
        title: it.title,
        desc: it.description,
        media: ALL_MEDIA.find((v) => v.id === it.media_id),
      }))
      .filter((c: any) => c.media && c.media.video);
    const pagePath = slug === 'ai-birthday-video-generator' ? '/' : `/${slug}`;
    return {
      slug,
      pagePath,
      name: page.title as string,
      summary: (raw.metadata?.description || page.description) as string,
      what: (s.what_is?.description || page.description) as string,
      steps: s.how_to?.items ?? [],
      clips,
    };
  })
  .sort((a, b) => {
    if (a.pagePath === '/') return -1;
    if (b.pagePath === '/') return 1;
    return a.name.localeCompare(b.name);
  });

fs.mkdirSync(`${OUT}/docs/scenes`, { recursive: true });

for (const sc of scenes) {
  const url = `${SITE}${sc.pagePath}${UTM}`;
  const homeUrl = `${SITE}/${UTM}`;
  const lines: string[] = [
    `# ${sc.name}`,
    '',
    sc.what,
    '',
    '## How to make it',
    '',
    ...sc.steps.map((st: any, i: number) => `${i + 1}. **${st.title}.** ${st.description}`),
    '',
  ];
  if (sc.clips.length) {
    lines.push('## Reference scenes', '');
    for (const c of sc.clips) {
      lines.push(
        `**${c.title}.** ${c.desc}`,
        '',
        `<video src="${c.media.src}" poster="${c.media.poster}" controls muted playsinline preload="none" width="270"></video>`,
        ''
      );
    }
    lines.push(
      `The clips above are creator posts showing the look; they were not made on AI Birthday Video Generator. The [${sc.name} page](${url}) lets you recreate the scene from a single photo on [${SITE.replace('https://', '')}](${homeUrl}) — one 12-second vertical clip with sound, paid per run with no subscription.`,
      ''
    );
  } else {
    lines.push(
      `Open the [${sc.name} page](${url}) on [${SITE.replace('https://', '')}](${homeUrl}) to pick a scene, upload one clear photo, and generate a 12-second vertical clip with sound.`,
      ''
    );
  }
  fs.writeFileSync(`${OUT}/docs/scenes/${sc.slug}.md`, lines.join('\n'));
}

const index = [
  '# AI Birthday Video Generator — Scene Guides',
  '',
  `${IDENTITY} This documentation covers the birthday video scenes, single-photo preparation steps, and prompt customization details.`,
  '',
  'Each guide below explains one birthday scene: what happens in the 12-second vertical clip, which photo angle works best, and how to customize the age number, zodiac sign, or cake message.',
  '',
  '| Scene | What happens |',
  '|---|---|',
  ...scenes.map(
    (sc) => `| [${sc.name}](scenes/${sc.slug}.md) | ${sc.summary.replace(/\|/g, '/')} |`
  ),
  '',
  `All scene templates are available at [AI Birthday Video Generator](${SITE}/${UTM}).`,
  '',
].join('\n');
fs.writeFileSync(`${OUT}/docs/index.md`, index);

const yml = [
  'site_name: AI Birthday Video Generator Guides',
  'site_url: https://aibirthdayvideogenerator.readthedocs.io/',
  'repo_url: https://github.com/hanshs474/ai-birthday-video-generator-guides',
  `site_description: "${IDENTITY.replace(/"/g, '\\"')}"`,
  'theme: readthedocs',
  'nav:',
  '  - Overview: index.md',
  '  - Scenes:',
  ...scenes.map((sc) => `      - "${sc.name.replace(/"/g, "'")}": scenes/${sc.slug}.md`),
  '',
].join('\n');
fs.writeFileSync(`${OUT}/mkdocs.yml`, yml);
fs.writeFileSync(`${OUT}/docs/requirements.txt`, 'mkdocs==1.6.1\n');
fs.writeFileSync(
  `${OUT}/.readthedocs.yaml`,
  'version: 2\nbuild:\n  os: ubuntu-24.04\n  tools:\n    python: "3.12"\nmkdocs:\n  configuration: mkdocs.yml\npython:\n  install:\n    - requirements: docs/requirements.txt\n'
);
fs.writeFileSync(
  `${OUT}/README.md`,
  `# AI Birthday Video Generator Guides\n\n${IDENTITY}\n\nDocumentation hosted on Read the Docs: https://aibirthdayvideogenerator.readthedocs.io/\n\nOfficial site: [${SITE}](${SITE}/)\n`
);
fs.writeFileSync(
  `${OUT}/LICENSE`,
  'MIT License\n\nCopyright (c) 2026 AI Birthday Video Generator\n'
);
console.log(`Generated ${scenes.length} scene pages in ${OUT}`);
