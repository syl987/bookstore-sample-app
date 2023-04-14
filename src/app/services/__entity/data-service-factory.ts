import { Injectable } from '@angular/core';
import { DefaultDataServiceConfig, DefaultDataServiceFactory, EntityCollectionDataService, EntityDefinitionService } from '@ngrx/data';
import { HttpOptions } from '@ngrx/data/src/dataservices/interfaces';
import { IdSelector, Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirebaseDatabaseService } from '../__firebase/firebase-database.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AppDataServiceFactory implements Pick<DefaultDataServiceFactory, 'create'> {
  constructor(
    private readonly authService: AuthService,
    private readonly entityDefinitionService: EntityDefinitionService,
    private readonly firebaseDatabaseService: FirebaseDatabaseService,
    private readonly config: DefaultDataServiceConfig,
  ) {}

  create<T>(entityName: string): EntityCollectionDataService<T> {
    return new AppDataService<T>(entityName, this.authService, this.entityDefinitionService, this.firebaseDatabaseService, this.config);
  }
}

export class AppDataService<T> implements EntityCollectionDataService<T> {
  readonly name = `${this.entityName} AppFirebaseDataService`;

  private readonly selectId: IdSelector<T> = this.entityDefinitionService.getDefinition(this.entityName).selectId;

  private get path(): string {
    const url = this.config.entityHttpResourceUrls?.[this.entityName]?.collectionResourceUrl ?? '';

    return url.replace('{$uid}', this.authService.uid + '');
  }

  constructor(
    protected readonly entityName: string,
    private readonly authService: AuthService,
    private readonly entityDefinitionService: EntityDefinitionService,
    private readonly firebaseDatabaseService: FirebaseDatabaseService,
    private readonly config: DefaultDataServiceConfig,
  ) {
    if (!config.entityHttpResourceUrls?.[entityName]?.collectionResourceUrl) {
      throw new Error('Missing URL configuration for ' + entityName + '.');
    }
  }

  getWithQuery(params: string | HttpOptions): Observable<T[]> {
    throw new Error('Method not implemented.');
  }

  getAll(): Observable<T[]> {
    return this.firebaseDatabaseService.getAll(this.path);
  }

  getById(id: string): Observable<T> {
    return this.firebaseDatabaseService.get(this.path, id);
  }

  add(entity: T): Observable<T> {
    return this.firebaseDatabaseService.push(this.path, entity);
  }

  upsert(entity: T): Observable<T> {
    return this.firebaseDatabaseService.set(this.path, this.selectId(entity) + '', entity);
  }

  update(update: Update<T>): Observable<T> {
    return this.firebaseDatabaseService.update(this.path, update.id + '', update.changes);
  }

  delete(id: string): Observable<string> {
    return this.firebaseDatabaseService.remove(this.path, id).pipe(map(_ => id));
  }
}
