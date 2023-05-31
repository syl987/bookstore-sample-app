import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserBookDTO, UserBookEditDraftDTO } from 'src/app/models/book.models';
import { ResponseError } from 'src/app/models/error.models';
import { FirebaseUploadData } from 'src/app/models/firebase.models';
import { GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';

// TODO buy actions

export const UserBooksActions = createActionGroup({
  source: 'UserBooks',
  events: {
    'load': props<{ id: string }>(),
    'load SUCCESS': props<{ book: UserBookDTO }>(),
    'load ERROR': props<{ error: ResponseError }>(),

    'load all': emptyProps(),
    'load all SUCCESS': props<{ books: UserBookDTO[] }>(),
    'load all ERROR': props<{ error: ResponseError }>(),

    'create': props<{ volumeData: GoogleBooksVolumeDTO }>(),
    'create SUCCESS': props<{ book: UserBookDTO }>(),
    'create ERROR': props<{ error: ResponseError }>(),

    'delete': props<{ id: string }>(),
    'delete SUCCESS': props<{ id: string }>(),
    'delete ERROR': props<{ error: ResponseError }>(),

    'edit draft': props<{ id: string; data: UserBookEditDraftDTO }>(),
    'edit draft SUCCESS': props<{ book: UserBookDTO }>(),
    'edit draft ERROR': props<{ error: ResponseError }>(),

    'upload image': props<{ id: string; data: Blob | Uint8Array | ArrayBuffer }>(),
    'upload image PROGRESS': props<{ response: FirebaseUploadData }>(),
    'upload image SUCCESS': props<{ response: FirebaseUploadData }>(),
    'upload image ERROR': props<{ error: ResponseError }>(),

    'delete image': props<{ id: string }>(),
    'delete image SUCCESS': emptyProps(),
    'delete image ERROR': props<{ error: ResponseError }>(),

    'publish': props<{ id: string }>(),
    'publish SUCCESS': props<{ book: UserBookDTO }>(),
    'publish ERROR': props<{ error: ResponseError }>(),
  },
});
