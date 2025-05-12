import { z } from 'zod';

export const protocols = ['shadowsocks', 'vmess', 'vless', 'trojan', 'hysteria2', 'tuic'];

const nullableString = z.string().nullish();
const portSchema = z.number().max(65535).nullish();
const securityConfigSchema = z
  .object({
    sni: nullableString,
    allow_insecure: z.boolean().nullable().default(false),
    fingerprint: nullableString,
    reality_private_key: nullableString,
    reality_public_key: nullableString,
    reality_short_id: nullableString,
    reality_server_addr: nullableString,
    reality_server_port: portSchema,
  })
  .nullish();

const transportConfigSchema = z
  .object({
    path: nullableString,
    host: nullableString,
    service_name: nullableString,
  })
  .nullish();

const baseProtocolSchema = z.object({
  port: portSchema,
  transport: z.string(),
  transport_config: transportConfigSchema,
  security: z.string(),
  security_config: securityConfigSchema,
});

const shadowsocksSchema = z.object({
  method: z.string(),
  port: portSchema,
  server_key: nullableString,
});

const vmessSchema = baseProtocolSchema;

const vlessSchema = baseProtocolSchema.extend({
  flow: nullableString,
});

const trojanSchema = baseProtocolSchema;

const hysteria2Schema = z.object({
  port: portSchema,
  hop_ports: nullableString,
  hop_interval: z.number().nullish(),
  obfs_password: nullableString,
  security: z.string(),
  security_config: securityConfigSchema,
});

const tuicSchema = z.object({
  port: portSchema,
  security: z.string(),
  security_config: securityConfigSchema,
});

const protocolConfigSchema = z.discriminatedUnion('protocol', [
  z.object({
    protocol: z.literal('shadowsocks'),
    config: shadowsocksSchema,
  }),
  z.object({
    protocol: z.literal('vmess'),
    config: vmessSchema,
  }),
  z.object({
    protocol: z.literal('vless'),
    config: vlessSchema,
  }),
  z.object({
    protocol: z.literal('trojan'),
    config: trojanSchema,
  }),
  z.object({
    protocol: z.literal('hysteria2'),
    config: hysteria2Schema,
  }),
  z.object({
    protocol: z.literal('tuic'),
    config: tuicSchema,
  }),
]);

const baseFormSchema = z.object({
  name: z.string(),
  tags: z.array(z.string()).nullish().default([]),
  country: z.string().nullish(),
  city: z.string().nullish(),
  server_addr: z.string(),
  speed_limit: z.number().nullish(),
  traffic_ratio: z.number().default(1),
  group_id: z.number().nullish(),
  relay_mode: z.string().nullish().default('none'),
  relay_node: z
    .array(
      z.object({
        host: z.string(),
        port: portSchema,
        prefix: z.string().nullish(),
      }),
    )
    .nullish()
    .default([]),
});

export const formSchema = z.intersection(baseFormSchema, protocolConfigSchema);
