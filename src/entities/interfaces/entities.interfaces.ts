import { EntityDBDTO } from '../dto/entities.dto';

export interface IChangeEntitiesOrder {
  main: EntityDBDTO;
  target: EntityDBDTO;
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

export interface ITableColumnSelect {
  value: string;
  label?: string;
  group?: string;
  iconLeft?: string;
  iconRight?: string;
  iconLeftColor?: string;
  iconRightColor?: string;
  color?: string;
  background?: string;
}

export interface ITableColumnProgressBar {
  start?: number;
  end?: number;
  color?: string;
  darknessColor?: string;
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
