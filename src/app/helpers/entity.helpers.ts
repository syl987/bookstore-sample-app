import { HttpErrorResponse } from '@angular/common/http';
import { EntityActionDataServiceError, EntityActionPayload } from '@ngrx/data';
import { Dictionary } from '@ngrx/entity';

export function selectEntityById<T>([entities, id]: [Dictionary<T>, string | number | undefined]): T | undefined {
    return id ? entities[id] : undefined;
}

export function getEntityPayloadError(payload: EntityActionPayload<EntityActionDataServiceError>): Partial<HttpErrorResponse> | undefined {
    return payload.data?.error?.error;
}
