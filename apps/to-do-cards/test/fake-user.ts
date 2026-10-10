/**
 * In-memory stand-in for the Mongoose `User` model, covering only the calls
 * the app makes. It follows MongoDB where the tests depend on it: a null or
 * undefined filter value matches a missing field, a `{ field: 0 }` projection
 * drops that field, and the schema's unique indexes reject duplicates.
 */

export type UserRecord = Record<string, unknown> & { _id: string };

const UNIQUE_FIELDS = [
  'email',
  'googleId',
  'facebookId',
  'gitHubId',
  'twitterXId'
];

let records: UserRecord[] = [];
let nextId = 1;

const matches = (record: UserRecord, filter: Record<string, unknown>) =>
  Object.entries(filter).every(([key, value]) =>
    value == null ? record[key] == null : record[key] === value
  );

const project = (
  record: UserRecord | undefined,
  projection?: Record<string, 0>
) => {
  if (!record) return null;
  const copy = structuredClone(record);
  for (const key of Object.keys(projection ?? {})) delete copy[key];
  return copy;
};

export const FakeUser = {
  async findOne(filter: Record<string, unknown>) {
    return project(records.find((record) => matches(record, filter)));
  },
  async findById(id: string, projection?: Record<string, 0>) {
    return project(
      records.find((record) => record._id === id),
      projection
    );
  },
  async findOneAndUpdate(
    filter: Record<string, unknown>,
    update: { $set: Record<string, unknown> },
    options: { new?: boolean; projection?: Record<string, 0> }
  ) {
    const record = records.find((candidate) => matches(candidate, filter));
    if (!record) return null;
    const before = structuredClone(record);
    Object.assign(record, update.$set);
    return project(options.new ? record : before, options.projection);
  },
  async create(fields: Record<string, unknown>) {
    for (const key of UNIQUE_FIELDS) {
      const value = fields[key];
      if (value != null && records.some((record) => record[key] === value)) {
        throw new Error(`E11000 duplicate key error: ${key}`);
      }
    }
    const record: UserRecord = { ...fields, _id: `user-${nextId++}` };
    records.push(record);
    return project(record);
  }
};

export const seedUsers = (seed: Omit<UserRecord, '_id'>[]) => {
  nextId = 1;
  records = [];
  return seed.map((fields) => {
    const record: UserRecord = { ...fields, _id: `user-${nextId++}` };
    records.push(record);
    return record;
  });
};

export const allUsers = () => structuredClone(records);
