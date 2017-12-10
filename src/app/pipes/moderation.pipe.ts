import { Pipe, PipeTransform } from '@angular/core';
import { KalturaEntryModerationStatus } from "kaltura-ngx-client/api/types/KalturaEntryModerationStatus";

@Pipe({
  name: 'moderation'
})
export class ModerationPipe implements PipeTransform {

  transform(value: KalturaEntryModerationStatus): string {
    let moderationStatus: string = "";
    if (value) {
      switch (value) {
        case KalturaEntryModerationStatus.approved:
          moderationStatus = "Approved";
          break;
        case KalturaEntryModerationStatus.autoApproved:
          moderationStatus = "Auto Approved";
          break;
        case KalturaEntryModerationStatus.flaggedForReview:
          moderationStatus = "Flagged";
          break;
        case KalturaEntryModerationStatus.pendingModeration:
          moderationStatus = "Pending";
          break;
        case KalturaEntryModerationStatus.rejected:
          moderationStatus = "Rejected";
          break;
      }
      return moderationStatus;
    }
  }

}
