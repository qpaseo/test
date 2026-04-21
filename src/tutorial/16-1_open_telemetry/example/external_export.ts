import { Elysia } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

// trace 데이터를 외부로 전송
new Elysia().use(
	opentelemetry({
		spanProcessors: [
			new BatchSpanProcessor(
				new OTLPTraceExporter({
					url: 'https://api.axiom.co/v1/traces', 
					headers: {
						Authorization: `Bearer ${Bun.env.AXIOM_TOKEN}`, 
						'X-Axiom-Dataset': Bun.env.AXIOM_DATASET!
					} 
				})
			)
		]
	})
)
