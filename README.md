# Call Intents Challenge

A project designed to demonstrate the handling of call intents. The system comprises several applications and supporting packages to manage data ingestion, API services, and database interactions.

---

## Demo
[![Demo Video]](s3://call-intents-challenge-demo/Screen Recording 2025-01-22 at 7.14.02 pm.mov)


## Table of Contents

- [Call Intents Challenge](#call-intents-challenge)
  - [Demo](#demo)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [These were then sent to the db.](#these-were-then-sent-to-the-db)
  - [Project Structure](#project-structure)
  - [Applications](#applications)
    - [App](#app)
    - [Ingest](#ingest)
    - [API](#api)
  - [Packages](#packages)
    - [Prisma Layer](#prisma-layer)
    - [Database](#database)
    - [Prisma](#prisma)
  - [Installation](#installation)
  - [Limitations](#limitations)

---

## Overview

The **Call Intents Challenge** is a modular project designed to:
- Label and ingest call intent data.
- Expose APIs to get call intents and categories.
- Provide a dashboard to view intents and their distribution.

The architecture follows a multi-app and package-based approach for modularity and scalability.

The call_intent files namely `call_intents_challenge.txt` is uploaded to an S3 bucket which invokes a lambda listening for the `Object:Created` event.

The intents have stop words removed in order to improve performance and token usage.

There are 3 steps to the categorization process.
1. A few shot approach was used in the initial labelling of the data, where a small sample of the file was used as an example mapping the human labelled data to the intent in a json object.
```plaintext
Categorize caller intents coming from a helpline to a Telecommunications company.
Categories relate to customer experience in the telecommunications industry.
Do not use words "Enquiry" or "Inquiry" in the categories.
Do not use plurals in your answer.
Use 2 words maximum, prefer one word but only if it is a noun.
Use US spelling.
Use capital letters at the start of each word, and no punctuation.
You will be given a json indexed by id containing intents to categorize in which the output will be a json with
the intent category with the same index as the provided intent.
Categorize strings with undecidable intent as "Unknown" not ''.
--- EXAMPLES ---
PROMPT: {"QrQ3_xyGiys9TGyVxFsO-":"Ignite international data roaming","8URUqNJt3KK4qMGbB4fHd":"Demand service for broken apparatus","W7U8kksHA20GZYGq85r-H":"Demand a copy of previous invoices","-qoOfxPUjg3pwi5DLZn9U":"Solve a technical mystery","DjPt_WbyCqTDkM48P3v-y":"Implore a temporary service interruption","99Si7yFBZdwPiYOsXuMAm":"Uncover the early termination fee implications","u_rN4ESGIZqp7F7hpuDqo":"Spark the inquiry into acquiring a modern phone or internet offering","7yBBxpE640NWUG50mv_lE":"Gather information on the data utilization and surcharge","4J6gFI8anMPEJYWWcCYHE":"Trigger the onboarding process for a brand-new handset or internet service","BuuWJ5eGmIB1gIqqFVizR":"Mobilize international data usageMobilize international data usage"}
COMPLETION: {"QrQ3_xyGiys9TGyVxFsO-":"Activation","8URUqNJt3KK4qMGbB4fHd":"Repair","W7U8kksHA20GZYGq85r-H":"Billing","-qoOfxPUjg3pwi5DLZn9U":"Technical Support","DjPt_WbyCqTDkM48P3v-y":"Service Termination","99Si7yFBZdwPiYOsXuMAm":"Fees","u_rN4ESGIZqp7F7hpuDqo":"Sales","7yBBxpE640NWUG50mv_lE":"Usage","4J6gFI8anMPEJYWWcCYHE":"Service Connection","BuuWJ5eGmIB1gIqqFVizR":"Data Roaming"}
```
2. This response is then used to feed back into the LLM which is asked to simplify the rough call intent categories provided by the first step.
```plaintext
You are tasked with simplifying customer experience categories in the Telecommunications sector.
  You will be given an array of categories in which you will group similar categories to simpler ones, and remove ones
  that .
  Your answer should be a significantly shorter array than the one given to you.
  --- EXAMPLE ---
  PROMPT: ["Service Disruption","Service Failure","Theft","Theft Report","Account Access","Account","Offers","Offering"]
  COMPLETION: ["Service Disruption","Theft","Account","Offers"]
  --- EXPLANATION ---
  The category "Serice Failure" was removed in favor of "Service Disruption" because it was more akin to customer experience 
  terminology. The category "Theft Report" was removed because "Theft" conveys just as much meaning.
```
3. The list output from the second step is used as labels in which the LLM must apply to the call intents as its category.
```plaintext
You are tasked with mapping customer intents from a customer experience helpline you will receive a json indexed by id containing intents to categorize.
You must map its matching category to its id and return the json.
You MUST assign it to one of the following categories: ${categories.join(", ")}.
It MUST be the most applicable and relevent category of that intent.
Return JSON in plain text, do not format with markdown!
Do not insert newlines.
Categorize intents with undecidable categories as "Unknown" not ''.

```

These were then sent to the db.
---

## Project Structure

The project is organized into the following apps and packages:

```plaintext
/
├── apps/
│   ├── app/             # Front-end application
│   ├── ingest/          # Data ingestion service
│   └── api/             # Backend API service
├── packages/
│   ├── prisma-layer/    # Prisma ORM utilities
│   ├── database/        # Database schema and seed data
│   ├── prisma/          # Prisma client and configuration
├── README.md            # Documentation
├── package.json         # Root dependencies
└── ...                  # Other project files
```

---

## Applications

### App
- **Location:** `apps/app`
- **Description:** A simple web based dashboard for analysing call intents and category distributions.
- **Tech Stack:** [React](https://reactjs.org/), [Material-UI](https://mui.com/), [Vite](https://vitejs.dev/), [Cloudfront](https://aws.amazon.com/cloudfront/), [AWS SAM](https://aws.amazon.com/serverless/sam/).
- **Commands:**
  ```bash
  cd apps/app
  pnpm install
  pnpm run dev
  ```

---

### Ingest
- **Location:** `apps/ingest`
- **Tech Stack:** [AWS Lambda](https://aws.amazon.com/lambda/), [AWS SAM](https://aws.amazon.com/serverless/sam/), [AWS S3](https://aws.amazon.com/s3/), [OpenAI API](https://platform.openai.com/docs/).
- **Deploy:**
  ```bash
  cd apps/ingest
  pnpm run deploy
  ```
- **Description:** Handles ingestion, inference and storage of call intent data.
---

### API
- **Location:** `apps/api`
- **Tech Stack:** [Node.js](https://nodejs.org/), [AWS API Gateway](https://aws.amazon.com/api-gateway/), [Prisma](https://www.prisma.io/), [AWS SAM](https://aws.amazon.com/serverless/sam/).
- **Deploy:**
  ```bash
  cd apps/api
  pnpm run deploy
  ```
- **Description:** Exposes API Gateway HTTP API for access to intents and categories.
---

## Packages

### Prisma Layer
- **Location:** `packages/prisma-layer`
- **Setup:**
  ```bash
  cd packages/prisma-layer
  pnpm run deploy
  ```
- **Description:** Contains Prisma ORM utilities and reusable database access logic in a lambda layer. This reduceds bundled lambda size from greater than 68 Mb to less than 400 Kb and can be resused across the lambda stack, namely `apps/api` and `apps/ingest`.
---

### Database
- **Location:** `packages/database`
- **Deployment:**
  ```bash
  cd packages/database
  pnpm run deploy
  ```
- **Tech Stack:** [PostgreSQL](https://www.postgresql.org/), [AWS EC2](https://aws.amazon.com/ec2/), [AWS SAM](https://aws.amazon.com/serverless/sam/)

- **Description:** Database is EC2 instance deployed through AWS SAM which initializes a containerised postgres database.
---

### Prisma
- **Location:** `packages/prisma`
- **Setup:**
  ```bash
  cd packages/prisma
  pnpm install
  pnpm run generate
  pnpm run migrate
  ```
- **Description:** Contains the Prisma client and configuration for database access. Is packaged in the pnpm workspace under the package name `@amiller/prisma` for sharing between projects, namely `apps/api` and `apps/ingest`.
---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vanillamiller/call-intents-challenge.git
   cd call-intents-challenge
   ```

2. Install dependencies for all apps and packages:
   ```bash
   pnpm install
   ```

3. Set up the environment:
   - Copy the `.env.example` file to `.env` in each app/package and configure it as needed.

---

## Limitations
The application was built as an MVP and has the following limitations.
- No authentication or authorization
- No automated testing
- Minimal LLM output validation
- No turbo monorepo pipeline for infra deployment
- Limited AWS security
- No github actions/workflows
- No global theme
