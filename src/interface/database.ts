export interface IPageEntity {
  entity_uuid: string;
  entity_type: 'divider' | 'paragraph' | 'image' | 'table';
}
export interface IEntity {
  page_uuid?: string;
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
  image_buffer?: string;
  image_path?: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  entity_position?: string;
  entity_title_position?: string;
  image_scale?: string;
  table_columns?: ITableColumn[];
  table_data?: {
    [key: string]: never;
  }[];
}
export interface ITableColumn {
  column_uuid: string;
  name: string;
  type: ITableColumnTypes;
  data: never;
}
type ITableColumnTypes =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'status'
  | 'rating'
  | 'knob';
