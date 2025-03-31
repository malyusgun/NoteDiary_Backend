import { ITableColumnDB, TDarkness, TSize, TThemeColor } from '../interfaces';

export interface EntityDBDTO {
  sheet_uuid?: string;
  entity_uuid: string;
  readonly entity_type: 'divider' | 'paragraph' | 'image' | 'table';
  entity_order?: number;
  readonly divider_height?: number;
  readonly divider_type?: 'solid' | 'dashed' | 'dotted';
  title?: string | null;
  text?: string | null;
  readonly font_size?: string | null;
  readonly paragraph_size?: string | null;
  readonly text_position?: string | null;
  image_buffer?: string[] | ArrayBuffer[];
  image_path?: string;
  image_url?: string;
  readonly image_width?: number;
  readonly image_height?: number;
  readonly entity_position?: string;
  readonly entity_title_position?: string;
  readonly image_scale?: string;
  readonly table_columns?: ITableColumnDB[];
  readonly table_data?: unknown[][];
  readonly multipleSort?: boolean;
  readonly gap?: string;
  readonly size?: TSize;
  readonly showAllLines?: boolean;
  readonly stripedRows?: boolean;
  readonly center?: boolean;
  readonly fontSize?: string;
  readonly theme?: TThemeColor;
  readonly textColor?: TThemeColor;
  readonly darknessTheme?: TDarkness;
  readonly darknessTextColor?: TDarkness;
  readonly paginator?: boolean;
  readonly editable?: boolean;
  readonly noEditingSettings?: {
    columns?: number[];
    rows?: number[];
    cells?: [number, number][];
  };
  readonly handlers?: {
    cell: [number, number];
    handler?: () => void;
  }[];
}
