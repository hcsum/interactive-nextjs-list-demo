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

export const FREE_TRAIL_ITEMS_LIMIT = 13;

export const ERROR_FREE_TRAIL_ITEM_LIMIT =
  "Free trail items limit reached. To add more items, please consider joining membership.";
