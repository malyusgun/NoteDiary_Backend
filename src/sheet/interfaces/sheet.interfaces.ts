export interface ISheetDB {
  user_uuid: string;
  sheet_uuid?: string;
  sheet_title: string;
  sheet_icon: string;
  sheet_children: string[];
  background_path?: string;
  sheet_entities: string[];
}
