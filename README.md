# OpenCredit

A real estate financing platform connecting entrepreneurs with financiers.

## Docker Deployment

This project uses GitHub Actions to automatically build and push Docker images to the GitHub Container Registry.

### Pulling the Image

To pull the latest image from GitHub Container Registry:

```bash
docker pull ghcr.io/yonatansinay2020/opencredit:latest
```

### Running the Container

```bash
docker run -p 3000:3000 ghcr.io/yonatansinay2020/opencredit:latest
```

The application will be available at http://localhost:3000

### Environment Variables

The following environment variables can be set when running the container:

- `PORT`: The port the application listens on (default: 3000)
- `NODE_ENV`: The environment mode (default: production)

Example with custom port:

```bash
docker run -p 8080:3000 -e PORT=3000 ghcr.io/yonatansinay2020/opencredit:latest
```

## Development

### Prerequisites

- Node.js 20 or later
- pnpm
- Docker (optional)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev
```

### Building for Production

```bash
# Build the application
pnpm run build

# Start the production server
pnpm run start
```

## License

This project is licensed under the MIT License. 