export interface DatabaseType {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
        };
      };
    };
  };
}
