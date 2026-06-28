// Supabase client - graceful fallback when credentials are missing
// The app works fully without Supabase using in-memory/generated data

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = SUPABASE_URL && !SUPABASE_URL.includes('placeholder') && SUPABASE_KEY && !SUPABASE_KEY.includes('placeholder');

// Simple fetch-based Supabase client (no external dependency needed)
class SupabaseClient {
  private url: string;
  private key: string;

  constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
  }

  async from(table: string) {
    return {
      select: async (columns = '*') => {
        if (!isConfigured) return { data: [], error: null };
        try {
          const res = await fetch(`${this.url}/rest/v1/${table}?select=${columns}`, {
            headers: {
              apikey: this.key,
              Authorization: `Bearer ${this.key}`,
            },
          });
          const data = await res.json();
          return { data, error: null };
        } catch (error) {
          return { data: [], error };
        }
      },
      upsert: async (records: Record<string, unknown> | Record<string, unknown>[]) => {
        if (!isConfigured) return { data: records, error: null };
        try {
          const res = await fetch(`${this.url}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
              apikey: this.key,
              Authorization: `Bearer ${this.key}`,
              'Content-Type': 'application/json',
              Prefer: 'resolution=merge-duplicates',
            },
            body: JSON.stringify(records),
          });
          const data = await res.json();
          return { data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      insert: async (records: Record<string, unknown> | Record<string, unknown>[]) => {
        if (!isConfigured) return { data: records, error: null };
        try {
          const res = await fetch(`${this.url}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
              apikey: this.key,
              Authorization: `Bearer ${this.key}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(records),
          });
          const data = await res.json();
          return { data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
    };
  }
}

export const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_KEY);
export const isSupabaseConfigured = isConfigured;
