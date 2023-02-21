import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProfileService } from 'src/app/services/car.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-message-page',
    templateUrl: './message-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagePageComponent implements OnInit {
    readonly uid: string = this.route.snapshot.params['profileId'];

    readonly userProfile$ = this.userService.profile$;
    readonly otherProfile$ = this.profileService.entityMap$.pipe(map(m => m[this.uid]));

    constructor(private readonly route: ActivatedRoute, private readonly userService: UserService, private readonly profileService: ProfileService) {}

    ngOnInit(): void {
        this.profileService.getByKey(this.uid);
        // TODO init chat (if not exists)
        // TODO load chat
    }
}
