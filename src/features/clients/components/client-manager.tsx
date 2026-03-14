"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, PencilLine, Plus, Trash2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  upsertLocalClientSchema,
  type UpsertLocalClientFormInput,
  type UpsertLocalClientInput,
} from "@/lib/schemas/client";
import { useClientsStore } from "@/features/clients/stores/use-clients-store";
import { cn } from "@/lib/utils";

const content = {
  en: {
    title: "Local client editor",
    description:
      "Create, edit and organize client records locally for the workspaces you manage with your customers.",
    addClient: "Add client",
    editClient: "Edit client",
    emptyTitle: "No clients yet",
    emptyDescription:
      "Add your first customer profile to keep briefs, brand context and campaign owners organized.",
    formDescription:
      "Data is saved locally in this browser so you can manage customer context without waiting for backend integration.",
    fields: {
      companyName: "Company name",
      contactName: "Contact name",
      email: "Email",
      website: "Website",
      industry: "Industry",
      status: "Status",
      primaryGoal: "Primary goal",
      notes: "Notes",
    },
    actions: {
      create: "Create client",
      save: "Save client",
      delete: "Delete client",
    },
    statuses: {
      lead: "Lead",
      active: "Active",
      paused: "Paused",
      archived: "Archived",
    },
    industries: {
      ecommerce: "Ecommerce",
      saas: "SaaS",
      realEstate: "Real estate",
      beauty: "Beauty",
      restaurant: "Restaurant",
      agency: "Agency",
      localBusiness: "Local business",
    },
    cardGoal: "Primary goal",
    cardUpdated: "Updated",
    successCreated: "Client created locally.",
    successUpdated: "Client updated locally.",
    successDeleted: "Client removed locally.",
  },
  es: {
    title: "Editor local de clientes",
    description:
      "Crea, edita y organiza registros de clientes localmente para los workspaces que gestionas con tus clientes.",
    addClient: "Agregar cliente",
    editClient: "Editar cliente",
    emptyTitle: "Todavia no hay clientes",
    emptyDescription:
      "Agrega tu primer perfil de cliente para ordenar briefs, contexto de marca y responsables de campana.",
    formDescription:
      "Los datos se guardan localmente en este navegador para que puedas gestionar el contexto del cliente sin esperar una integracion backend.",
    fields: {
      companyName: "Nombre de empresa",
      contactName: "Nombre de contacto",
      email: "Email",
      website: "Sitio web",
      industry: "Industria",
      status: "Estado",
      primaryGoal: "Objetivo principal",
      notes: "Notas",
    },
    actions: {
      create: "Crear cliente",
      save: "Guardar cliente",
      delete: "Eliminar cliente",
    },
    statuses: {
      lead: "Lead",
      active: "Activo",
      paused: "Pausado",
      archived: "Archivado",
    },
    industries: {
      ecommerce: "Ecommerce",
      saas: "SaaS",
      realEstate: "Bienes raices",
      beauty: "Belleza",
      restaurant: "Restaurante",
      agency: "Agencia",
      localBusiness: "Negocio local",
    },
    cardGoal: "Objetivo principal",
    cardUpdated: "Actualizado",
    successCreated: "Cliente creado localmente.",
    successUpdated: "Cliente actualizado localmente.",
    successDeleted: "Cliente eliminado localmente.",
  },
} as const;

const statusOptions = ["lead", "active", "paused", "archived"] as const;
const industryOptions = [
  "ecommerce",
  "saas",
  "realEstate",
  "beauty",
  "restaurant",
  "agency",
  "localBusiness",
] as const;

export function ClientManager() {
  const { locale } = useLocale();
  const copy = content[locale];
  const {
    clients,
    selectedClientId,
    selectClient,
    createClient,
    updateClient,
    deleteClient,
  } = useClientsStore();
  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? null;
  const form = useForm<UpsertLocalClientFormInput, undefined, UpsertLocalClientInput>({
    resolver: zodResolver(upsertLocalClientSchema),
    defaultValues: {
      companyName: selectedClient?.companyName ?? "",
      contactName: selectedClient?.contactName ?? "",
      email: selectedClient?.email ?? "",
      website: selectedClient?.website ?? "",
      industry: selectedClient?.industry ?? "ecommerce",
      status: selectedClient?.status ?? "lead",
      primaryGoal: selectedClient?.primaryGoal ?? "",
      notes: selectedClient?.notes ?? "",
    },
  });
  const selectedIndustry = useWatch({ control: form.control, name: "industry" });
  const selectedStatus = useWatch({ control: form.control, name: "status" });

  useEffect(() => {
    form.reset({
      companyName: selectedClient?.companyName ?? "",
      contactName: selectedClient?.contactName ?? "",
      email: selectedClient?.email ?? "",
      website: selectedClient?.website ?? "",
      industry: selectedClient?.industry ?? "ecommerce",
      status: selectedClient?.status ?? "lead",
      primaryGoal: selectedClient?.primaryGoal ?? "",
      notes: selectedClient?.notes ?? "",
    });
  }, [form, selectedClient]);

  function handleCreateNew() {
    selectClient(null);
    form.reset({
      companyName: "",
      contactName: "",
      email: "",
      website: "",
      industry: "ecommerce",
      status: "lead",
      primaryGoal: "",
      notes: "",
    });
  }

  const onSubmit = form.handleSubmit((values) => {
    if (selectedClient) {
      updateClient(selectedClient.id, values);
      toast.success(copy.successUpdated);
      return;
    }

    createClient(values);
    toast.success(copy.successCreated);
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{copy.title}</CardTitle>
              <CardDescription>{copy.description}</CardDescription>
            </div>
            <Button type="button" onClick={handleCreateNew}>
              <Plus className="h-4 w-4" />
              {copy.addClient}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {clients.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-border bg-background/40 p-6 text-center">
              <div className="text-lg font-semibold">{copy.emptyTitle}</div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.emptyDescription}</p>
            </div>
          ) : (
            clients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => selectClient(client.id)}
                className={cn(
                  "rounded-[24px] border border-border bg-background/50 p-4 text-left transition hover:border-primary/40",
                  selectedClientId === client.id && "border-primary bg-primary/5",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-semibold">{client.companyName}</div>
                    <div className="text-sm text-muted-foreground">{client.contactName}</div>
                  </div>
                  <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                    {copy.statuses[client.status]}
                  </span>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">{client.email}</div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {copy.fields.industry}
                    </div>
                    <div className="mt-1 text-sm">{copy.industries[client.industry]}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {copy.cardUpdated}
                    </div>
                    <div className="mt-1 text-sm">
                      {new Date(client.updatedAt).toLocaleDateString(locale === "es" ? "es-PE" : "en-US")}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {copy.cardGoal}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {client.primaryGoal}
                  </p>
                </div>
              </button>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              {selectedClient ? <PencilLine className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
            </span>
            <div>
              <CardTitle>{selectedClient ? copy.editClient : copy.addClient}</CardTitle>
              <CardDescription>{copy.formDescription}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">{copy.fields.companyName}</Label>
                <Input id="companyName" {...form.register("companyName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">{copy.fields.contactName}</Label>
                <Input id="contactName" {...form.register("contactName")} />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">{copy.fields.email}</Label>
                <Input id="email" type="email" {...form.register("email")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">{copy.fields.website}</Label>
                <Input id="website" placeholder="https://example.com" {...form.register("website")} />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{copy.fields.industry}</Label>
                <Select
                  value={selectedIndustry ?? "ecommerce"}
                  onValueChange={(value) =>
                    form.setValue("industry", value as UpsertLocalClientInput["industry"], {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {copy.industries[option]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{copy.fields.status}</Label>
                <Select
                  value={selectedStatus ?? "lead"}
                  onValueChange={(value) =>
                    form.setValue("status", value as UpsertLocalClientInput["status"], {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {copy.statuses[option]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryGoal">{copy.fields.primaryGoal}</Label>
              <Textarea id="primaryGoal" className="min-h-[110px]" {...form.register("primaryGoal")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{copy.fields.notes}</Label>
              <Textarea id="notes" className="min-h-[120px]" {...form.register("notes")} />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="sm:flex-1">
                {selectedClient ? copy.actions.save : copy.actions.create}
              </Button>
              {selectedClient ? (
                <Button
                  type="button"
                  variant="outline"
                  className="sm:flex-1"
                  onClick={() => {
                    deleteClient(selectedClient.id);
                    toast.success(copy.successDeleted);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  {copy.actions.delete}
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
