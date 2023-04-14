import { Injectable } from '@angular/core';
import { DefaultDataServiceConfig, DefaultDataServiceFactory, EntityCollectionDataService, EntityDefinitionService } from '@ngrx/data';
import { HttpOptions } from '@ngrx/data/src/dataservices/interfaces';
import { IdSelector, Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from './data.service';

@Injectable()
export class AppDataServiceFactory implements Pick<DefaultDataServiceFactory, 'create'> {
  constructor(
    private readonly definitionService: EntityDefinitionService,
    private readonly dataService: DataService,
    private readonly config: DefaultDataServiceConfig,
  ) {}

  create<T>(entityName: string): EntityCollectionDataService<T> {
    return new AppDataService<T>(entityName, this.definitionService, this.dataService, this.config);
  }
}

export class AppDataService<T> implements EntityCollectionDataService<T> {
  readonly name = `${this.entityName} AppFirebaseDataService`;

  private readonly path: string;

  private readonly selectId: IdSelector<T> = this.definitionService.getDefinition(this.entityName).selectId;

  constructor(
    protected readonly entityName: string,
    private readonly definitionService: EntityDefinitionService,
    private readonly dataService: DataService,
    config: DefaultDataServiceConfig,
  ) {
    this.path = config.entityHttpResourceUrls?.[entityName]?.collectionResourceUrl ?? '';

    if (!this.path) {
      throw new Error('Missing URL configuration for ' + entityName + '.');
    }
  }

  getWithQuery(params: string | HttpOptions): Observable<T[]> {
    throw new Error('Method not implemented.');
  }

  getAll(): Observable<T[]> {
    return this.dataService.getAll(this.path);
  }

  getById(id: string): Observable<T> {
    return this.dataService.get(this.path, id);
  }

  add(entity: T): Observable<T> {
    return this.dataService.push(this.path, entity);
  }

  upsert(entity: T): Observable<T> {
    throw new Error('Method not implemented.');
  }

  update(update: Update<T>): Observable<T> {
    return this.dataService.update(this.path, update.id + '', update.changes);
  }

  delete(id: string): Observable<string> {
    return this.dataService.remove(this.path, id).pipe(map(_ => id));
  }
}
