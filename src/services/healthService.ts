import { AssessmentData, AssessmentResult, HealthTip } from '../types';
import { supabase, isMockSupabase } from '../lib/supabase';

export const healthService = {
  async processAssessment(data: AssessmentData): Promise<Omit<AssessmentResult, 'id' | 'created_at' | 'user_id' | 'category' | 'concern'>> {
    const response = await fetch('/api/assess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      throw new Error('Failed to process assessment');
    }

    return response.json();
  },

  async saveAssessmentResult(userId: string, data: AssessmentData, result: any): Promise<AssessmentResult> {
    if (isMockSupabase) {
      // Return a mock saved result
      return {
        id: Math.random().toString(36).substring(7),
        created_at: new Date().toISOString(),
        user_id: userId,
        category: data.category,
        concern: data.concern,
        ...result,
      };
    }

    const { data: savedData, error } = await supabase
      .from('assessments')
      .insert([
        {
          user_id: userId,
          category: data.category,
          concern: data.concern,
          summary: result.summary,
          explanation: result.explanation,
          recommendations: result.recommendations,
          severity: result.severity,
          raw_data: data
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving assessment:', error);
      throw new Error('Failed to save assessment');
    }

    return savedData as AssessmentResult;
  },

  async getHistory(userId: string): Promise<AssessmentResult[]> {
    if (isMockSupabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching history:', error);
      throw new Error('Failed to fetch history');
    }

    return data as AssessmentResult[];
  },
  
  async getHealthTips(): Promise<HealthTip[]> {
    // Return some mock tips for the UI
    return [
      {
        id: '1',
        title: 'Hydration is Key',
        explanation: 'Water makes up about 60% of your body weight and is essential for every system to function properly.',
        importance: 'Even mild dehydration can drain your energy and make you feel tired.',
        action: 'Aim to drink 8 glasses (about 2 liters) of water a day. Carry a reusable water bottle with you.'
      },
      {
        id: '2',
        title: 'Prioritize Sleep',
        explanation: 'Sleep plays a critical role in healing and repairing your heart and blood vessels.',
        importance: 'Ongoing sleep deficiency is linked to an increased risk of heart disease, kidney disease, high blood pressure, and stroke.',
        action: 'Try to go to bed and wake up at the same time every day, even on weekends.'
      }
    ];
  }
};
