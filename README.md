# My Enclave App

An application that runs inside an [AWS Nitro Enclave](https://aws.amazon.com/ec2/nitro/nitro-enclaves/) using the [Introspector Enclave](https://github.com/ArkLabsHQ/introspector-enclave) framework.

## Prerequisites

- Node.js 22+
- Docker
- [Nix](https://nixos.org/)
- AWS CLI v2
- AWS CDK CLI (`npm install -g aws-cdk`)
- jq

## Quick Start

### 1. Install the enclave CLI

```sh
go install github.com/ArkLabsHQ/introspector-enclave/cmd/enclave@latest
```

### 2. Configure

Edit `enclave/enclave.yaml`:

- Set `account` to your AWS account ID
- Set `name` to your app name
- Configure `secrets` as needed

### 3. Set up app hashes

```sh
enclave setup --language nodejs
```

This auto-detects your GitHub remote and computes all Nix hashes (including npm deps hash).

### 4. Build

```sh
enclave build
```

Produces a reproducible EIF image with deterministic PCR0 measurements.

### 5. Deploy

```sh
enclave deploy
```

Creates the full AWS stack: VPC, EC2, KMS key, IAM roles, and secrets.

### 6. Verify

```sh
enclave verify
```

Verifies the running enclave's attestation document matches your local build.

## Writing Your App

Your app is a plain Node.js HTTP server. No SDK imports needed.

- Listen on `ENCLAVE_APP_PORT` (default 7074)
- Read secrets from environment variables (e.g. `APP_SIGNING_KEY`)
- The enclave supervisor handles TLS, attestation, and response signing

## Development Workflow

The enclave build fetches your app source from GitHub at the exact commit specified
in `enclave.yaml`. Your code must be committed and pushed before building.

**Important:** `package-lock.json` must be committed to your repository.
Nix requires it to compute reproducible dependency hashes.

**After code changes (no new dependencies):**

```sh
git add -A && git commit -m "my changes" && git push
enclave update    # fast: updates nix_rev + nix_hash only
enclave build
```

**After dependency changes (package.json):**

```sh
npm install                # updates package-lock.json
git add -A && git commit -m "update deps" && git push
enclave setup --language nodejs   # full: recomputes all hashes including npm deps hash
enclave build
```

See [Introspector Enclave documentation](https://github.com/ArkLabsHQ/introspector-enclave) for the full reference.
