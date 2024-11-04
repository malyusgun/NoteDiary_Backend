export interface ISheetDB {
  user_uuid: string;
  sheet_uuid?: string;
  sheet_title: string;
  sheet_icon: string;
  sheet_navigation_order: string;
  background_path?: string;
  sheet_entities: string[];
}
export interface IEntityDB {
  sheet_uuid?: string;
  entity_uuid: string;
  entity_type: 'divider' | 'paragraph' | 'image' | 'table';
  entity_order?: number;
  divider_height?: number;
  divider_type?: 'solid' | 'dashed' | 'dotted';
  title?: string | null;
  text?: string | null;
  font_size?: string | null;
  paragraph_size?: string | null;
  text_position?: string | null;
  image_buffer?: string[] | ArrayBuffer[];
  image_path?: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  entity_position?: string;
  entity_title_position?: string;
  image_scale?: string;
  table_columns?: ITableColumnDB[];
  table_data?: {
    [key: string]: never;
  }[];
}
export interface IUserDB {
  user_uuid: string;
  nick_name: string;
  password: string;
  email: string;
  settings?: string;
  user_sheets: string;
}
export interface ITableColumnDB {
  column_uuid: string;
  name: string;
  type: ITableColumnTypes;
  data: never;
}
type ITableColumnTypes = 'text' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'status' | 'rating' | 'knob';
