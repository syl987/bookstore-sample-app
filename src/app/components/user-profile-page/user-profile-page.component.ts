import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { notNullable } from 'src/app/functions/typeguard.functions';
import { BodyType, Profile } from 'src/app/models/user.models';
import { DESCRIPTION_REGEXP, DISPLAY_NAME_REGEXP } from 'src/app/models/regexp.models';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-user-profile-page',
    templateUrl: './user-profile-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfilePageComponent implements OnInit {
    readonly personForm = this.formBuilder.nonNullable.group({
        displayName: '',
        description: '',
        bodyType: BodyType.REGULAR,
        height: 0,
    });

    readonly imageForm = new FormGroup({
        photo: new FormControl<Blob | null>(null, Validators.required),
    });

    private readonly croppedPhotoPngBase64$ = new BehaviorSubject<string | null | undefined>(undefined);

    readonly profile$ = this.userService.profile$;
    readonly photoUploading$ = this.userService.loading$; // TODO should be uploading$ instead

    readonly photoUrl$ = combineLatest([this.croppedPhotoPngBase64$, this.profile$]).pipe(map(([cropped, profile]) => cropped ?? profile?.photoUrl ?? null));

    readonly DISPLAY_NAME_REGEXP = DISPLAY_NAME_REGEXP;
    readonly DESCRIPTION_REGEXP = DESCRIPTION_REGEXP;

    readonly BodyType = BodyType;

    readonly stepperOrientation$: Observable<StepperOrientation> = this.breakpointObserver.observe('(min-width: 800px)').pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly breakpointObserver: BreakpointObserver,
        private readonly dialogService: DialogService,
        private readonly userService: UserService,
    ) {}

    ngOnInit(): void {
        this.userService.profile$.pipe(first(), filter(notNullable)).subscribe(profile => this.personForm.patchValue(profile));
    }

    savePersonData(): void {
        const profile: Partial<Profile> = this.personForm.getRawValue();

        this.userService.updateProfile(profile);
    }

    saveImageData(): void {
        const blob = this.imageForm.getRawValue().photo;

        if (!blob) {
            console.warn('No cropped image data.');
            return;
        }
        // TODO make uid storage folder only -> make photo a file within uid folder named photo384x384
        // TODO check max size in bytes
        // TODO separate uploader component with button as ng-content and inputs for path, outputs for dunno
        this.userService.uploadProfilePhoto(blob);
    }

    deleteProfilePhoto(): void {
        this.userService.deleteProfilePhoto();
    }

    openCropImageDialog(files: FileList | null): void {
        if (!files?.length) {
            console.warn('No file was picked.');
            return;
        }
        const dialogRef = this.dialogService.openCropImageDialog(files[0]);

        dialogRef.beforeClosed().subscribe(result => {
            this.imageForm.get('photo')?.setValue(result ?? null);
            this.changeDetectorRef.markForCheck();
        });
    }

    getStepState(form: FormGroup): 'init' | 'pending' | 'error' | 'done' {
        if (form.untouched) {
            return 'init';
        }
        switch (form.status) {
            case 'VALID':
                return 'done';
            case 'PENDING':
                return 'pending';
            default:
                return 'error';
        }
    }
}
