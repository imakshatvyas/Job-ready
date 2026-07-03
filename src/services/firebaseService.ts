import type { UserProfile } from '../services/aiEngine';

interface Application {
  jobId: string;
  status: string;
  notes?: string;
  reminderDate?: string;
}

interface UserData {
  profile: UserProfile | null;
  savedJobs: string[];
  applications: Application[];
  onboarded: boolean;
  preferences: {
    roles: string[];
    industries: string[];
    countries: string[];
    workMode: string;
    willingToRelocate: boolean;
  };
}

// Simulated Firebase Client SDK wrapper
export class FirebaseService {
  private static getPrefix(uid: string): string {
    return `firebase_db_${uid}`;
  }

  public static async getUserData(uid: string): Promise<UserData> {
    const prefix = this.getPrefix(uid);
    const saved = localStorage.getItem(prefix);
    
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default empty schema for new user
    const defaultData: UserData = {
      profile: null,
      savedJobs: [],
      applications: [],
      onboarded: false,
      preferences: {
        roles: [],
        industries: [],
        countries: [],
        workMode: 'Any',
        willingToRelocate: true
      }
    };
    
    localStorage.setItem(prefix, JSON.stringify(defaultData));
    return defaultData;
  }

  public static async updateUserData(uid: string, data: Partial<UserData>): Promise<void> {
    const prefix = this.getPrefix(uid);
    const current = await this.getUserData(uid);
    const updated = { ...current, ...data };
    localStorage.setItem(prefix, JSON.stringify(updated));
  }

  public static async saveResumeHistory(uid: string, fileName: string, profile: UserProfile): Promise<void> {
    const key = `firebase_db_${uid}_resume_history`;
    const current = localStorage.getItem(key);
    const list = current ? JSON.parse(current) : [];
    list.unshift({
      id: `res-${Date.now()}`,
      fileName,
      timestamp: new Date().toLocaleString(),
      profile
    });
    localStorage.setItem(key, JSON.stringify(list.slice(0, 10))); // Keep last 10 versions
  }

  public static async getResumeHistory(uid: string): Promise<Array<{ id: string; fileName: string; timestamp: string; profile: UserProfile }>> {
    const key = `firebase_db_${uid}_resume_history`;
    const current = localStorage.getItem(key);
    return current ? JSON.parse(current) : [];
  }
}
