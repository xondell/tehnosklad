export class EnvironmentConfigurationError extends Error {
  constructor(names: readonly string[]) {
    super(`Missing required environment variables: ${names.join(", ")}`);
    this.name = "EnvironmentConfigurationError";
  }
}

export function requireEnvironmentVariables<
  const T extends Record<string, string | undefined>,
>(values: T): { [Key in keyof T]: string } {
  const missing = Object.entries(values)
    .filter(([, value]) => !value?.trim())
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new EnvironmentConfigurationError(missing);
  }

  return values as { [Key in keyof T]: string };
}
