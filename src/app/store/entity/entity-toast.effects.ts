import { Inject, Injectable } from '@angular/core';
import { EntityAction, EntityOp, ofEntityOp, Pluralizer } from '@ngrx/data';
import { Actions, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { APP_ENTITY_NAMES, APP_ENTITY_PLURAL_NAMES, AppEntityDisplayNameMap } from 'src/app/models/app.models';
import { ToastService } from 'src/app/services/toast.service';

@Injectable()
export class EntityToastEffects {
    readonly showEntitySuccessToast$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofEntityOp([
                    EntityOp.SAVE_ADD_ONE_SUCCESS,
                    EntityOp.SAVE_UPDATE_ONE_SUCCESS,
                    EntityOp.SAVE_UPSERT_ONE_SUCCESS,
                    EntityOp.SAVE_DELETE_ONE_SUCCESS,
                    EntityOp.SAVE_ADD_MANY_SUCCESS,
                    EntityOp.SAVE_UPDATE_MANY_SUCCESS,
                    EntityOp.SAVE_UPSERT_MANY_SUCCESS,
                    EntityOp.SAVE_DELETE_MANY_SUCCESS,
                ]),
                tap(({ payload }) => this.toastService.showSuccessToast(this.getSuccessMessage(payload.entityName, payload.entityOp))),
            );
        },
        { dispatch: false },
    );

    readonly showEntityErrorToast$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofEntityOp([
                    EntityOp.SAVE_ADD_ONE_ERROR,
                    EntityOp.SAVE_UPDATE_ONE_ERROR,
                    EntityOp.SAVE_UPSERT_ONE_ERROR,
                    EntityOp.SAVE_DELETE_ONE_ERROR,
                    EntityOp.SAVE_ADD_MANY_ERROR,
                    EntityOp.SAVE_UPDATE_MANY_ERROR,
                    EntityOp.SAVE_UPSERT_MANY_ERROR,
                    EntityOp.SAVE_DELETE_MANY_ERROR,
                    EntityOp.QUERY_BY_KEY_ERROR,
                    EntityOp.QUERY_ALL_ERROR,
                    EntityOp.QUERY_MANY_ERROR,
                    EntityOp.QUERY_LOAD_ERROR,
                ]),
                tap(({ payload }) => this.toastService.showErrorToast(this.getErrorMessage(payload.entityName, payload.entityOp))),
            );
        },
        { dispatch: false },
    );

    constructor(
        private readonly actions$: Actions<EntityAction>,
        private readonly toastService: ToastService,
        @Inject(APP_ENTITY_NAMES) private readonly entityNames: Partial<AppEntityDisplayNameMap>,
        @Inject(APP_ENTITY_PLURAL_NAMES) private readonly entityPluralNames: Partial<AppEntityDisplayNameMap>,
        private readonly pluralizer: Pluralizer,
    ) {}

    private getSuccessMessage(entityName: string, endityOp: EntityOp): string {
        switch (endityOp) {
            case EntityOp.SAVE_ADD_ONE_SUCCESS:
                return `${this.getName(entityName)} successfully created.`;
            case EntityOp.SAVE_UPDATE_ONE_SUCCESS:
                return `${this.getName(entityName)} data successfully saved.`;
            case EntityOp.SAVE_UPSERT_ONE_SUCCESS:
                return `${this.getName(entityName)} data successfully saved.`;
            case EntityOp.SAVE_DELETE_ONE_SUCCESS:
                return `${this.getName(entityName)} successfully deleted.`;
            case EntityOp.SAVE_ADD_MANY_SUCCESS:
                return `${this.getPluralName(entityName)} successfully created.`;
            case EntityOp.SAVE_UPDATE_MANY_SUCCESS:
                return `${this.getPluralName(entityName)} data successfully saved.`;
            case EntityOp.SAVE_UPSERT_MANY_SUCCESS:
                return `${this.getPluralName(entityName)} data successfully saved.`;
            case EntityOp.SAVE_DELETE_MANY_SUCCESS:
                return `${this.getPluralName(entityName)} successfully deleted.`;
            default:
                return `Operation successful.`; // should not happen
        }
    }

    private getErrorMessage(entityName: string, endityOp: EntityOp): string {
        switch (endityOp) {
            case EntityOp.SAVE_ADD_ONE_ERROR:
                return `Error creating ${this.getName(entityName)}.`;
            case EntityOp.SAVE_UPDATE_ONE_ERROR:
                return `Error updating ${this.getName(entityName)}.`;
            case EntityOp.SAVE_UPSERT_ONE_ERROR:
                return `Error saving ${this.getName(entityName)}.`;
            case EntityOp.SAVE_DELETE_ONE_ERROR:
                return `Error deleting ${this.getName(entityName)}.`;
            case EntityOp.QUERY_BY_KEY_ERROR:
                return `Error loading ${this.getName(entityName)}.`;
            case EntityOp.SAVE_ADD_MANY_ERROR:
                return `Error creating ${this.getPluralName(entityName)}.`;
            case EntityOp.SAVE_UPDATE_MANY_ERROR:
                return `Error updating ${this.getPluralName(entityName)}.`;
            case EntityOp.SAVE_UPSERT_MANY_ERROR:
                return `Error saving ${this.getPluralName(entityName)}.`;
            case EntityOp.SAVE_DELETE_MANY_ERROR:
                return `Error deleting ${this.getPluralName(entityName)}.`;
            case EntityOp.QUERY_ALL_ERROR:
            case EntityOp.QUERY_MANY_ERROR:
            case EntityOp.QUERY_LOAD_ERROR:
                return `Error loading ${this.getPluralName(entityName)}.`;
            default:
                return `Unknown Error.`; // should not happen
        }
    }

    private getName(entityName: string): string {
        return (this.entityNames as any)[entityName] ?? entityName;
    }

    private getPluralName(entityName: string): string {
        return (this.entityPluralNames as any)[entityName] ?? this.pluralizer.pluralize(entityName);
    }
}
