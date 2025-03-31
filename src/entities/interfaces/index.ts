interface IEntityUuidAndOrder {
  entity_uuid: string;
  entity_order: number;
  entity_type: 'divider' | 'paragraph' | 'image' | 'table';
}

export interface IChangeEntitiesOrder {
  main: IEntityUuidAndOrder;
  target: IEntityUuidAndOrder;
}

export interface ITableColumnDB {
  name: string;
  options?: object;
  type?: TTableColumnType;
  width?: number;
  editable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  initSort?: 'up' | 'down' | 'none';
  padding?: string;
}

export type TTableColumnType =
  | 'checkbox'
  | 'number'
  | 'text'
  | 'date'
  | 'select'
  | 'rating'
  | 'progressBar'
  | 'knob'
  | 'avatar'
  | 'image';

export type TSize = 'small' | 'normal' | 'large' | 'huge';

export type TThemeColor =
  | 'white'
  | 'blue'
  | 'sky'
  | 'cyan'
  | 'teal'
  | 'lime'
  | 'green'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'pink'
  | 'fuchsia'
  | 'purple'
  | 'indigo'
  | 'rose'
  | 'red'
  | 'black';

export type TDarkness =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';
