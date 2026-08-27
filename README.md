# structured-logging-lab

This repository contains a simple Orders API application for the DevOps Foundation assignment: Implementing Structured Logging for Debugging (LU 5.3).

## Setup

```bash
docker compose up -d
```

## View Logs

```bash
docker logs orders-api
```

## Trigger Error

```bash
curl localhost:3000/simulate-error
```

## Structured Logging Evidence

The original container produced unstructured output such as:

```text
Orders API running on port 3000
Unexpected database pool error: terminating connection due to administrator command
```

The upgraded container produces one JSON object per line. Captured startup output:

```json
{"ts":"2026-08-27T04:09:57.761Z","level":"info","service":"orders-api","msg":"server.start"}
{"ts":"2026-08-27T04:09:57.764Z","level":"info","service":"orders-api","msg":"db.connect.start"}
{"ts":"2026-08-27T04:09:57.781Z","level":"info","service":"orders-api","msg":"server.ready","port":3000}
{"ts":"2026-08-27T04:09:57.820Z","level":"info","service":"orders-api","msg":"db.connect.ok"}
```

Run the API on an available host port when port 3000 is already occupied:

```bash
docker compose rm -sf orders-api
docker compose run --name orders-api -d -p 3001:3000 orders-api
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3001/simulate-error
docker logs orders-api
```

The failing request emits an `error` record containing its generated `reqId`, followed by the `request.end` record with status 500. Use that ID to trace the complete request:

```bash
docker logs orders-api | jq 'select(.level=="error")'
docker logs orders-api | jq 'select(.reqId=="<the-failing-req-id>")'
```

See [CLOUD_LOGGING.md](CLOUD_LOGGING.md) for cloud field mapping and LogQL/Google Cloud Logging query examples.
