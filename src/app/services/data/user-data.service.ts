import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Profile } from '../../models/user.models';
import { DataService } from './data.service';
import { FileService } from './file.service';

@Injectable({
    providedIn: 'root',
})
export class UserDataService {
    readonly path = 'profiles';

    constructor(private readonly databaseService: DataService, private readonly storageService: FileService) {}

    loadProfile(uid: string): Observable<Profile> {
        return this.databaseService.get(this.path, uid);
    }

    createProfile(uid: string, entity: Profile): Observable<Profile> {
        entity = { ...entity, createdAt: Date.now(), id: uid };

        // using update(): avoid generating id, use uid instead
        return this.databaseService.update(this.path, uid, entity);
    }

    updateProfile(uid: string, changes: Partial<Profile>): Observable<Profile> {
        return this.databaseService.update(this.path, uid, changes);
    }

    deleteProfile(uid: string): Observable<void> {
        return this.databaseService.remove(this.path, uid);
    }

    uploadProfilePhoto(uid: string, blob: Blob): Observable<string> {
        const path = `${this.path}/${uid}/photo256x256.png`; // png is defined by the image cropper

        return this.storageService.upload(path, blob);
    }

    deleteProfilePhoto(uid: string): Observable<void> {
        const path = `${this.path}/${uid}/photo256x256.png`; // png is defined by the image cropper

        return this.storageService.delete(path);
    }
}
