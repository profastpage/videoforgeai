export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          company_name: string | null;
          timezone: string;
          theme_preference: "light" | "dark" | "system";
          created_at: string;
          updated_at: string;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          description: string;
          monthly_price: number;
          monthly_credits: number;
          max_duration_seconds: number;
          history_limit_days: number;
          concurrency_limit: number;
          priority: "standard" | "priority" | "highest";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: "trialing" | "active" | "past_due" | "canceled" | "incomplete";
          billing_cycle_anchor: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      credits_balance: {
        Row: {
          user_id: string;
          available_credits: number;
          reserved_credits: number;
          lifetime_used_credits: number;
          updated_at: string;
        };
      };
      credits_transactions: {
        Row: {
          id: string;
          user_id: string;
          generation_id: string | null;
          amount: number;
          type: "grant" | "usage" | "refund" | "adjustment";
          reason: string;
          meta: Json;
          created_at: string;
        };
      };
      video_generations: {
        Row: {
          id: string;
          user_id: string;
          project_name: string;
          prompt: string;
          negative_prompt: string | null;
          generation_type: string;
          status: string;
          aspect_ratio: string;
          resolution: string;
          duration_seconds: number;
          style: string;
          template_slug: string | null;
          source_image_url: string | null;
          provider_key: string;
          provider_job_id: string | null;
          progress: number;
          estimated_credits: number;
          consumed_credits: number | null;
          error_code: string | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          deleted_at: string | null;
        };
      };
      generation_assets: {
        Row: {
          id: string;
          generation_id: string;
          kind: "preview" | "source" | "final";
          storage_driver: string;
          path: string;
          public_url: string | null;
          mime_type: string | null;
          size_bytes: number | null;
          created_at: string;
        };
      };
      prompt_templates: {
        Row: {
          id: string;
          category: string;
          slug: string;
          title: string;
          description: string;
          prompt: string;
          recommended_aspect_ratio: string;
          recommended_style: string;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_user_id: string | null;
          event_type: string;
          entity_type: string;
          entity_id: string;
          payload: Json;
          created_at: string;
        };
      };
    };
  };
}
