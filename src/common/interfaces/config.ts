export interface ServerConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
}

export interface JwtConfig {
  secret: string;
  expiration: string;
}

export interface MongoDbConfig {
  uri: string;
}

export interface PostgresConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface EmailConfig {
  service: string;
  user: string;
  password: string;
  from: string;
}

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export interface AppConfig {
  server: ServerConfig;
  jwt: JwtConfig;
  mongodb: MongoDbConfig;
  postgres: PostgresConfig;
  email: EmailConfig;
  google: GoogleOAuthConfig;
  rateLimit: RateLimitConfig;
}
