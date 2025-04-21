# OpenCredit

A real estate financing platform connecting entrepreneurs with financiers.

## Docker Deployment

This project uses GitHub Actions to automatically build and push Docker images to the GitHub Container Registry. Images are versioned using semantic versioning (vx.x.x).

### Pulling the Image

To pull a specific version from GitHub Container Registry:

```bash
# Pull latest version
docker pull ghcr.io/yonatansinay2020/opencredit:latest

# Pull specific version (e.g., v1.0.0)
docker pull ghcr.io/yonatansinay2020/opencredit:v1.0.0
```

### Running the Container

```bash
# Run latest version
docker run -p 3000:3000 ghcr.io/yonatansinay2020/opencredit:latest

# Run specific version
docker run -p 3000:3000 ghcr.io/yonatansinay2020/opencredit:v1.0.0
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

### Versioning

To create a new version:

1. Create and push a git tag:
```bash
git tag v1.0.0
git push origin v1.0.0
```

2. GitHub Actions will automatically:
   - Build the Docker image
   - Tag it with the version (e.g., v1.0.0)
   - Push it to the GitHub Container Registry

## License

This project is licensed under the MIT License. 