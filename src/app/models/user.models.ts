export interface UserProfileDTO {
  id: string;
  createdAt: number;
  updatedAt: number;
  version: number;

  photoUrl?: string | null;
  displayName: string;
  description: string;
}
