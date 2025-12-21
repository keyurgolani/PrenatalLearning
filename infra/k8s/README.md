# Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the Prenatal Learning Hub application using Kustomize.

## Structure

```
infra/k8s/
├── base/                    # Base configurations shared across environments
│   ├── configmap.yaml
│   ├── mongodb-deployment.yaml
│   ├── mongodb-service.yaml
│   ├── mongodb-pvc.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── kustomization.yaml
└── overlays/
    ├── dev/                 # Development environment (local images)
    │   ├── namespace.yaml
    │   ├── secrets.yaml
    │   ├── nginx-configmap.yaml
    │   ├── configmap-patch.yaml
    │   ├── backend-patch.yaml
    │   ├── frontend-patch.yaml
    │   ├── mongodb-patch.yaml
    │   └── kustomization.yaml
    └── prod/                # Production environment (published images)
        ├── namespace.yaml
        ├── secrets.yaml
        ├── nginx-configmap.yaml
        ├── configmap-patch.yaml
        ├── backend-patch.yaml
        ├── frontend-patch.yaml
        ├── mongodb-patch.yaml
        ├── ingress.yaml
        └── kustomization.yaml
```

## Prerequisites

- kubectl configured with cluster access
- Kustomize (built into kubectl v1.14+)
- Docker (for building dev images)

## Deployment

### Development Environment

Dev uses locally built images for faster iteration:

```bash
# Build local images first
pnpm run k8s:dev:build
# Or manually:
# docker build -f infra/docker/Dockerfile.web -t prenatal-learning:dev .
# docker build -f infra/docker/Dockerfile.server -t prenatal-learning-backend:dev ./apps/server

# Apply to cluster
pnpm run k8s:dev:apply

# Port forward to access the app
kubectl port-forward svc/dev-frontend 8080:80 -n prenatal-learning-dev

# Open http://localhost:8080 in your browser
```

### Production Environment

Production uses published images from Docker Hub (`keyurgolani/prenatal-learning:latest`).

Before deploying:

1. Update `infra/k8s/overlays/prod/secrets.yaml` with secure credentials
2. Update `infra/k8s/overlays/prod/configmap-patch.yaml` with your domain
3. Update `infra/k8s/overlays/prod/ingress.yaml` with your domain and TLS settings

```bash
# Preview the manifests
pnpm run k8s:prod:preview

# Apply to cluster
pnpm run k8s:prod:apply
```

## Useful Commands

```bash
# Check deployment status
pnpm run k8s:dev:status
pnpm run k8s:prod:status

# View logs
kubectl logs -f deployment/dev-backend -n prenatal-learning-dev
kubectl logs -f deployment/prod-backend -n prenatal-learning-prod

# Port forward for local access (dev)
kubectl port-forward svc/dev-frontend 8080:80 -n prenatal-learning-dev
kubectl port-forward svc/dev-backend 3001:3001 -n prenatal-learning-dev

# Delete deployments
pnpm run k8s:dev:delete
pnpm run k8s:prod:delete
```

## Environment Differences

| Feature                     | Development                     | Production                                         |
| --------------------------- | ------------------------------- | -------------------------------------------------- |
| Images                      | Local (`prenatal-learning:dev`) | Published (`keyurgolani/prenatal-learning:latest`) |
| Replicas (frontend/backend) | 1                               | 2                                                  |
| MongoDB Storage             | 1Gi                             | 10Gi                                               |
| Resource Limits             | Lower                           | Higher                                             |
| Ingress                     | No                              | Yes                                                |
| Rate Limiting               | Relaxed                         | Stricter                                           |

## Security Notes

- **Never commit real secrets** to version control
- For production, consider using:
  - [Sealed Secrets](https://sealed-secrets.netlify.app/)
  - [External Secrets Operator](https://external-secrets.io/)
  - Cloud provider secret management (AWS Secrets Manager, GCP Secret Manager, etc.)
