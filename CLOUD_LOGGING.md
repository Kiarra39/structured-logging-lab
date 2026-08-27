# Cloud Logging Mapping

The API emits one JSON object per line on stdout. A container log collector can parse each line and index the fields without changing the application.

## Field mapping

| JSON field | Cloud meaning |
| --- | --- |
| `ts` | Event timestamp; use as the log entry timestamp when supported |
| `level` | Severity (`info`, `warn`, or `error`) |
| `service` | Service name, useful for filtering `orders-api` |
| `msg` | Event name, such as `orders.list.failed` |
| `reqId` | Request correlation field for an end-to-end trace |
| `orderId` and other fields | Structured event attributes |

## Google Cloud Logging

Configure the container runtime or logging agent to parse stdout as JSON. `level` maps to `severity`, `ts` maps to the entry timestamp, and the remaining properties become searchable `jsonPayload` fields. For example, an error query can filter `resource.labels.container_name="orders-api" AND jsonPayload.level="error"`, while a request trace can filter `jsonPayload.reqId="<request-id>"`.

## Grafana Loki

Ship the JSON stdout stream with Promtail or Grafana Alloy and enable JSON parsing in the pipeline. Keep low-cardinality fields such as `service` and `level` as indexed labels, and query high-cardinality fields such as `reqId` from parsed JSON at query time. Example LogQL filters are `{service="orders-api"} | json | level="error"` and `{service="orders-api"} | json | reqId="<request-id>"`.

## Evidence commands

```bash
docker logs orders-api | jq 'select(.level=="error")'
docker logs orders-api | jq 'select(.reqId=="<the-failing-req-id>")'
```
