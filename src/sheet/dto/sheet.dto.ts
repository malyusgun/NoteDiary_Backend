export class SheetDTO {
  readonly user_uuid: string;
  sheet_uuid: string;
  readonly sheet_title: string;
  sheet_icon?: string;
  sheet_children?: string[];
  sheet_entities?: string[];
}
export class EditSheetBackgroundDTO {
  readonly sheet_uuid: string;
  readonly background_url: string;
}
