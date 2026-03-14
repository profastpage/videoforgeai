"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seededLocalClients } from "@/lib/seed/clients";
import type { LocalClient, UpsertLocalClientInput } from "@/lib/schemas/client";

type ClientsState = {
  clients: LocalClient[];
  selectedClientId: string | null;
  selectClient: (clientId: string | null) => void;
  createClient: (input: UpsertLocalClientInput) => LocalClient;
  updateClient: (clientId: string, input: UpsertLocalClientInput) => LocalClient | null;
  deleteClient: (clientId: string) => void;
};

export const useClientsStore = create<ClientsState>()(
  persist(
    (set) => ({
      clients: seededLocalClients,
      selectedClientId: seededLocalClients[0]?.id ?? null,
      selectClient: (clientId) => set({ selectedClientId: clientId }),
      createClient: (input) => {
        const client: LocalClient = {
          id: crypto.randomUUID(),
          updatedAt: new Date().toISOString(),
          ...input,
        };

        set((state) => ({
          clients: [client, ...state.clients],
          selectedClientId: client.id,
        }));

        return client;
      },
      updateClient: (clientId, input) => {
        let updatedClient: LocalClient | null = null;

        set((state) => ({
          clients: state.clients.map((client) => {
            if (client.id !== clientId) {
              return client;
            }

            updatedClient = {
              ...client,
              ...input,
              updatedAt: new Date().toISOString(),
            };

            return updatedClient;
          }),
        }));

        return updatedClient;
      },
      deleteClient: (clientId) =>
        set((state) => {
          const remainingClients = state.clients.filter((client) => client.id !== clientId);

          return {
            clients: remainingClients,
            selectedClientId:
              state.selectedClientId === clientId
                ? (remainingClients[0]?.id ?? null)
                : state.selectedClientId,
          };
        }),
    }),
    {
      name: "videoforge-local-clients-v1",
    },
  ),
);
