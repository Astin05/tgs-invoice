import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  company_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  tax_id?: string;
  website?: string;
  bank_name: string;
  account_number: string;
  routing_number: string;
  account_holder_name: string;
  currency: string;
  default_payment_terms: number;
  created_at: string;
  updated_at: string;
}

// Sign up with email and password
export const signUp = async (
  email: string,
  password: string,
  fullName: string,
  companyName: string
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
        },
      },
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        full_name: fullName,
        company_name: companyName,
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        bank_name: '',
        account_number: '',
        routing_number: '',
        account_holder_name: '',
        currency: 'USD',
        default_payment_terms: 30,
      });

      if (profileError) throw profileError;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Watch auth changes
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        full_name: session.user.user_metadata?.full_name || '',
      });
    } else {
      callback(null);
    }
  });
};
