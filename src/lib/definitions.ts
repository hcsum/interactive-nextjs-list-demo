import { JWTPayload } from "jose";

export type ItemFormState =
  | {
      errors?: {
        name?: string[];
        pieces?: string[];
        deadline?: string[];
      };
    }
  | undefined;

export interface SessionPayload extends JWTPayload {
  userId: string;
}

export const MAX_FILE_SIZE_ALLOWED_MB = 15;
export const MAX_FILE_SIZE_FOR_UPLOAD_MB = 0.5;
export const FREE_TRAIL_IMAGE_ANALYSIS_COUNT_PER_MONTH = 3;
export const MEMBERSHIP_IMAGE_ANALYSIS_COUNT_PER_MONTH = 10;
export const FREE_TRAIL_ITEMS_LIMIT = 20;
export const MEMBERSHIP_ITEMS_LIMIT = 3000;

export const ERROR_FREE_TRAIL_ITEM_LIMIT =
  "Free trail items limit reached. To add more items, please consider joining membership.";
