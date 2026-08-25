export type SeverityLevel = 'LOW' | 'MODERATE' | 'URGENT' | 'EMERGENCY';

export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  age?: number;
  gender?: string;
  country?: string;
  health_goals?: string[];
  onboarding_completed?: boolean;
  role?: 'user' | 'admin' | 'super_admin' | 'content_manager' | 'moderator';
}

export interface AssessmentData {
  category: string;
  concern: string;
  age?: number;
  duration?: string;
  severity?: string;
  existing_conditions?: string;
  current_medications?: string;
  lifestyle_factors?: string;
}

export interface AssessmentResult {
  id: string;
  created_at: string;
  user_id: string;
  category: string;
  concern: string;
  summary: string;
  explanation: string;
  recommendations: string[];
  severity: SeverityLevel;
}

export interface HealthTip {
  id: string;
  title: string;
  explanation: string;
  importance: string;
  action: string;
}
