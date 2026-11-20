# API & SDKs

AI birthday video generator from a single photo: they pop champagne on a park bench, blow out a Scorpio cake, or light a crown cake at the car window.

Programmatic generation at [AI Birthday Video Generator](https://aibirthdayvideogenerator.com/?utm_source=readthedocs&utm_medium=api-docs) uses Bearer API keys issued per user account.

## Authentication

1. Sign in and create a key at [API Keys](https://aibirthdayvideogenerator.com/settings/apikeys?utm_source=readthedocs&utm_medium=api-docs).
2. Send the token in the HTTP `Authorization` header:

```text
Authorization: Bearer sk-...
```

Requests without a valid `Bearer sk-...` header return HTTP `401` (`{"code":-1,"message":"invalid API key — create one at https://aibirthdayvideogenerator.com/settings/apikeys"}`).

## Endpoints

Base URL: `https://aibirthdayvideogenerator.com`

### `POST /api/ai/generate`

Starts an asynchronous birthday video generation task (`12`-second `9:16` `720p` output via `seedance-2-mini` on `kie`).

```json
{
  "provider": "kie",
  "mediaType": "video",
  "model": "seedance-2-mini",
  "scene": "image-to-video",
  "prompt": "Popping champagne on a park bench with 30th birthday balloons",
  "options": {
    "duration": "12",
    "resolution": "720p",
    "aspect_ratio": "9:16",
    "image_input": ["https://example.com/photo.jpg"]
  }
}
```

- When `image_input` is omitted, set `"scene": "text-to-video"`.

### `POST /api/ai/query`

Polls task status using the `taskId` returned by `/api/ai/generate`.

```json
{
  "taskId": "task_..."
}
```

### `POST /api/user/get-user-credits`

Returns the current credit balance for the API key owner (`{}`).

## Published SDKs & Integrations

| Ecosystem | Package | Registry |
|---|---|---|
| Go | `github.com/hanshs474/abvg-go` | [pkg.go.dev](https://pkg.go.dev/github.com/hanshs474/abvg-go) |
| Python | `aibirthday` | [PyPI](https://pypi.org/project/aibirthday/) |
| TypeScript / Deno / Node | `@aibirthday/sdk` | [JSR](https://jsr.io/@aibirthday/sdk) |
| MCP Server | `aibirthday-mcp` | [npm](https://www.npmjs.com/package/aibirthday-mcp) |
| D | `abvg` | [code.dlang.org](https://code.dlang.org/packages/abvg) |
| ComfyUI | `ComfyUI-abvg` | [GitHub](https://github.com/hanshs474/ComfyUI-abvg) |
| Curated Comparison | `awesome-ai-birthday-video-tools` | [GitHub](https://github.com/hanshs474/awesome-ai-birthday-video-tools) |

See [Pricing](https://aibirthdayvideogenerator.com/pricing?utm_source=readthedocs&utm_medium=api-docs) for credit packages and [AI Birthday Video Generator](https://aibirthdayvideogenerator.com/?utm_source=readthedocs&utm_medium=api-docs) for scene templates.
