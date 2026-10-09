# PortedHub

A library of PC/console ports that run as fully functional browser games.

## Tech Stack

- **Framework**: Vite + Vue 3
- **Routing**: Vue Router
- **Deployment**: Optimized for Vercel

## Project Structure

**Important**: Ports are automatically discovered from `public/games/index.json`. Add a port ID to this JSON array and it will appear on the site.

```
portedhub/
├── public/
│   └── games/              # Port data and screenshots
│       ├── index.json      # List of all port IDs (auto-discovered)
│       └── cs-1.6/
│           ├── game.json   # Metadata for one port
│           └── screenshot.jpg
├── src/
│   ├── components/
│   │   └── PortCard.vue    # Reusable port card component
│   ├── views/
│   │   ├── Home.vue        # Landing page
│   │   └── Library.vue     # Main library with filters
│   ├── router/
│   │   └── index.js        # Route configuration
│   ├── App.vue             # Main app component
│   ├── main.js             # Entry point
│   └── style.css           # Global styles
└── package.json
```

## Adding New Ports

You can use the guided CLI to create a port entry and update the library index:

```bash
npm run add:port
```

Follow the prompts for the port details. The command creates `public/games/<id>/game.json` and registers the port in `public/games/index.json`. For a screenshot, provide an optional HTTP(S) image URL first; the CLI suggests the filename and extension from that URL, which you can accept or edit before it downloads the image to `public/games/<id>/<filename>`. Leave the URL blank to enter a filename and copy the image into that location yourself. The legacy `npm run add:game` command remains as an alias.

Alternatively, add a port manually:

1. Create a new folder in `public/games/` with a unique ID (e.g., `public/games/pacman/`)
2. Add a `game.json` file with the port metadata:

```json
{
  "title": "Counter-Strike 1.6",
  "screenshot": "screenshot.png",
  "genre": "First-Person Shooter",
  "description": "A Counter-Strike 1.6 browser port featuring classic maps and bot matches.",
  "creator": {
    "name": "Unknown"
  },
  "website": "https://cs.dphn.ai/",
  "type": "clone"
}
```

3. Add a screenshot image and set its filename in the optional `screenshot` field in `game.json`. Any image file extension is supported; if omitted, the app uses `screenshot.svg`.
4. Add your port ID to `public/games/index.json`:

```json
["cs-1.6", "your-new-port-id"]
```

That's it! The port will automatically appear in both the Library and Home page. No code changes needed.

## Port JSON Fields

- `title` (required): Game or port name
- `screenshot` (optional): Screenshot filename relative to the port folder; any extension is supported (defaults to `screenshot.svg`)
- `genre` (required): Genre for filtering
- `description` (required): A single description for the port
- `creator` (required): Object containing creator details
  - `name` (required): Creator's name
  - `social` (optional): Link to creator's social media
- `website` (required): URL where the port can be played
- `type` (optional): "original", "clone", "crossover", or "console" - adds a badge to the port and can be used to filter the library. Use "console" for emulated console ports such as Nintendo 64 or PlayStation games.

Each library entry represents one port, with its creator, playable website, and type stored directly on that entry.

The library is a static site, so an in-site editor cannot save new entries to the project files. Use the CLI locally, then commit and deploy the generated JSON files to publish the entry.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The project is configured for Vercel deployment. Simply:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect the Vite configuration and deploy

Alternatively, you can deploy to any static hosting service (Netlify, GitHub Pages, etc.) by running `npm run build` and deploying the `dist` folder.

## Customization

### Change the Slogan

Edit the slogan in `src/views/Home.vue`:

```vue
<p class="slogan">100% browser, 0% downloads</p>
```

### Modify Colors

The main colors used in the project:
- Primary dark: `#1a1a2e`
- Accent: `#e94560`
- Background: `#f8f9fa`

These can be found in the `<style>` sections of the Vue components.
