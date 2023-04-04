import { HttpErrorResponse } from '@angular/common/http';
import { EntityActionDataServiceError, EntityActionPayload } from '@ngrx/data';
import { Dictionary } from '@ngrx/entity';

export function getEntityById<T>([entityMap, id]: [Dictionary<T>, string | number | undefined]): T | undefined {
  return id ? entityMap[id] : undefined;
}

export function getEntityPayloadError(payload: EntityActionPayload<EntityActionDataServiceError>): Partial<HttpErrorResponse> | undefined {
  return payload.data?.error.error;
}
