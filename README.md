# Historical Unit Converter — Functional Programming Sample

> Note: This project was created as a sample application to showcase functional programming concepts in JavaScript/TypeScript.

## What the app does

The Historical Unit Converter is a web application for converting historical units into modern measurements. It is built with Next.js and leverages the fp-ts library to implement a purely functional conversion.

### Key Features

- Convert historical units into modern measurements
- Pure conversion logic separated from UI
- Avaiable Polish and English language
- Demonstrates functional programming concepts: functors, monads, natural transformations, and monadic operations

## Run locally (development)

You can run the app locally using the usual Node.js commands. This project follows a standard Next.js layout.

1. Install dependencies

```powershell
npm install
```

2. Run the dev server

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

## Run with Docker

Build and run the Docker image (PowerShell commands):

```powershell
docker build -t historical-unit-converter .
docker run -d -p 3000:3000 --name historical-unit-converter-container historical-unit-converter
```

This builds the app and runs it in a container. The app will be reachable at http://localhost:3000.
