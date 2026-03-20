export function createQueryKeys<TScope extends string>(
  scope: TScope
): {
  all: readonly [TScope];
  detail: (id: string | number) => readonly [TScope, string | number];
  list: (
    filters?: Record<string, unknown>
  ) => readonly [TScope, 'list', ...Record<string, unknown>[]];
} {
  return {
    all: [scope] as const,
    detail: (id: string | number) => [scope, id] as const,
    list: (filters?: Record<string, unknown>) =>
      [scope, 'list', ...(filters ? [filters] : [])] as const
  };
}
