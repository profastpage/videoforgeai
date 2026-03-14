type AuditLogEntry = {
  id: string;
  actorUserId: string | null;
  eventType: string;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

const auditStore: AuditLogEntry[] = [];

export class AuditLogsRepository {
  async create(entry: Omit<AuditLogEntry, "id" | "createdAt">) {
    const nextEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...entry,
    };

    auditStore.unshift(nextEntry);
    return nextEntry;
  }

  async listRecent(limit = 20) {
    return auditStore.slice(0, limit);
  }
}

export const auditLogsRepository = new AuditLogsRepository();
